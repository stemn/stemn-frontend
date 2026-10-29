/**
 * Babel plugin: resolves the shared code's platform switches at build time and
 * turns the few CommonJS shims in the shared source into ES modules.
 *
 * Why: the shared code picks web/desktop implementations with patterns that
 * webpack bundled happily but Vite's dev server (native ESM, no CommonJS
 * transform for source files) cannot run:
 *
 *   module.exports = GLOBAL_ENV.APP_TYPE === 'web'
 *     ? require('./index.web.js')
 *     : require('./index.desktop.js')
 *
 *   export default GLOBAL_ENV.APP_THREAD === 'electron'
 *     ? modalName
 *     : require('./ErrorModal.container').default(modalName)
 *
 * What it does, per file:
 *  1. `GLOBAL_ENV.<KEY> ===|!==|==|!= 'literal'` conditions (in ternaries and if
 *     statements) whose KEY is known for the current build target are replaced
 *     by the branch that is taken. This also keeps React containers out of the
 *     Electron main-process bundle (APP_THREAD === 'electron').
 *  2. Remaining module-level `require('x')` calls (with `require` not locally
 *     bound) become hoisted `import * as _req from 'x'` namespace imports.
 *     A require inside a function is a build error (it was lazy; hoisting it
 *     could create import cycles).
 *  3. A top-level `module.exports = expr` becomes `export default expr`, plus
 *     `export * from 'x'` when expr is a bare `require('x')`, so named imports
 *     keep working.
 */
import type { NodePath, PluginAPI, PluginObject, types as BabelTypes } from '@babel/core'

export interface StemnPlatformOptions {
  /** Known GLOBAL_ENV values for this build target, e.g. { APP_TYPE: 'desktop', APP_THREAD: 'renderer' } */
  env: Record<string, string>
}

export default function stemnPlatformPlugin({ types: t }: PluginAPI, options: object): PluginObject {
  const { env } = options as StemnPlatformOptions
  const knownValue = (node: BabelTypes.Node): string | undefined => {
    if (
      t.isMemberExpression(node)
      && !node.computed
      && t.isIdentifier(node.object, { name: 'GLOBAL_ENV' })
      && t.isIdentifier(node.property)
      && Object.prototype.hasOwnProperty.call(env, node.property.name)
    ) {
      return env[node.property.name]
    }
    return undefined
  }

  /** true / false when the test can be decided at build time, undefined otherwise */
  const evaluate = (test: BabelTypes.Node): boolean | undefined => {
    if (t.isUnaryExpression(test, { operator: '!' })) {
      const inner = evaluate(test.argument)
      return inner === undefined ? undefined : !inner
    }
    if (!t.isBinaryExpression(test) || !['===', '!==', '==', '!='].includes(test.operator)) {
      return undefined
    }
    const { left, right } = test
    let value: string | undefined
    let literal: string | undefined
    if (t.isStringLiteral(right)) {
      value = knownValue(left)
      literal = right.value
    } else if (t.isStringLiteral(left)) {
      value = knownValue(right)
      literal = left.value
    }
    if (value === undefined || literal === undefined) {
      return undefined
    }
    const equal = value === literal
    return test.operator.startsWith('!') ? !equal : equal
  }

  const isRequireCall = (path: NodePath<BabelTypes.CallExpression>) => {
    const { callee, arguments: args } = path.node
    return t.isIdentifier(callee, { name: 'require' })
      && args.length === 1
      && t.isStringLiteral(args[0])
      && !path.scope.hasBinding('require')
  }

  return {
    name: 'stemn-platform',
    visitor: {
      ConditionalExpression(path) {
        const result = evaluate(path.node.test)
        if (result !== undefined) {
          path.replaceWith(result ? path.node.consequent : path.node.alternate)
        }
      },
      IfStatement(path) {
        const result = evaluate(path.node.test)
        if (result === undefined) return
        const branch = result ? path.node.consequent : path.node.alternate
        if (branch) {
          path.replaceWith(branch)
        } else {
          path.remove()
        }
      },
      Program: {
        exit(program) {
          const namespaces = new Map<string, BabelTypes.Identifier>()
          const namespaceFor = (source: string) => {
            let id = namespaces.get(source)
            if (!id) {
              id = program.scope.generateUidIdentifier('stemnRequire')
              namespaces.set(source, id)
            }
            return id
          }
          const reExports: string[] = []

          program.traverse({
            CallExpression(path) {
              if (!isRequireCall(path)) return
              // Only module-level requires are hoisted: a require inside a function is lazy,
              // and turning it into a static import can create import cycles (TDZ errors)
              if (path.getFunctionParent()) {
                throw path.buildCodeFrameError('require() inside a function cannot be converted to an ES import; use a top-level import or import()')
              }
              const source = (path.node.arguments[0] as BabelTypes.StringLiteral).value
              path.replaceWith(t.cloneNode(namespaceFor(source)))
            },
          })

          program.get('body').forEach((statement) => {
            if (!statement.isExpressionStatement()) return
            const expression = statement.node.expression
            if (
              t.isAssignmentExpression(expression, { operator: '=' })
              && t.isMemberExpression(expression.left)
              && t.isIdentifier(expression.left.object, { name: 'module' })
              && t.isIdentifier(expression.left.property, { name: 'exports' })
              && !program.scope.hasBinding('module')
            ) {
              const value = expression.right
              if (t.isIdentifier(value)) {
                const source = [...namespaces.entries()].find(([, id]) => id.name === value.name)
                if (source) reExports.push(source[0])
              }
              statement.replaceWith(t.exportDefaultDeclaration(value))
            }
          })

          const imports = [...namespaces.entries()].map(([source, id]) => t.importDeclaration(
            [t.importNamespaceSpecifier(t.cloneNode(id))],
            t.stringLiteral(source),
          ))
          const exportAll = reExports.map((source) => t.exportAllDeclaration(t.stringLiteral(source)))
          if (imports.length || exportAll.length) {
            program.unshiftContainer('body', [...imports, ...exportAll])
          }
        },
      },
    },
  }
}
