/* eslint-disable */

import whatGerber from '@stemn/whats-that-gerber'

export default () => ({
  parse,
  getBounds
})

const index = {
  BOTTOM: 1,
  TOP: 2,
  BOARD: 0,
  COPPER: 1,
  SOLDER: 2,
  PASTE: 3,
  SILK: 4,
  OUTLINE: 5,
}

const layerTypes = {
  tcu: [index.TOP, index.COPPER],
  tsm: [index.TOP, index.SOLDER],
  tss: [index.TOP, index.SILK],
  tsp: [index.TOP, index.PASTE],
  bcu: [index.BOTTOM, index.COPPER],
  bsm: [index.BOTTOM, index.SOLDER],
  bss: [index.BOTTOM, index.SILK],
  bsp: [index.BOTTOM, index.PASTE],
  out: [index.BOTTOM | index.TOP, index.OUTLINE],
  drl: [index.BOTTOM | index.TOP, index.BOARD],
  // icu: [index.TOP, index.COPPER], // Inner Copper
}

const layerNames = {}
layerNames[''] = 'No layer'
layerNames[`${index.BOTTOM}${index.COPPER}`] = 'Bottom copper'
layerNames[`${index.BOTTOM}${index.SOLDER}`] = 'Bottom solder mask'
layerNames[`${index.BOTTOM}${index.PASTE}`] = 'Bottom solder paste'
layerNames[`${index.BOTTOM}${index.SILK}`] = 'Bottom silk-screen'
layerNames[`${index.TOP}${index.COPPER}`] = 'Top copper'
layerNames[`${index.TOP}${index.SOLDER}`] = 'Top solder mask'
layerNames[`${index.TOP}${index.PASTE}`] = 'Top solder paste'
layerNames[`${index.TOP}${index.SILK}`] = 'Top silk-screen'
layerNames[`${index.TOP | index.BOTTOM}${index.BOARD}`] = 'Drill'
layerNames[`${index.TOP | index.BOTTOM}${index.OUTLINE}`] = 'Outline'


function parse(text, name) {
  let g
  const layerType = whatGerber(name)
  const [side, type] = layerTypes[layerType]

  if (layerType === 'drl') { // text.match(/^[\s%]*M48/)
    g = parseDrill(text, parseStandard)
  } else {
    g = parseStandard(text, parseStandard)
  }
  g.side = side
  g.type = type
  g.layerType = layerNames[`${g.side}${g.type}`]
  g.name = name
  g.isGerber = true
  g.bounds = getBounds(g)
  return g
}

function getBounds(g, r) {
  r = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
  const scale = g.scale
  r.minX /= scale, r.minY /= scale, r.maxX /= scale, r.maxY /= scale
  for (let i = 0; i < g.cmds.length; i++) {
    const s = g.shapes[g.cmds[i][1]]
    if (!s) { continue }
    let x = g.cmds[i][2], 
      y = g.cmds[i][3], 
      rx = 0, 
      ry = 0
    if (s[0] == 'C') { rx = ry = s[1] / 2 } else if (s[0] == 'R') { rx = s[1] / 2, ry = s[2] / 2 } else { continue }

    if (x - rx < r.minX) { r.minX = x - rx }
    if (y - ry < r.minY) { r.minY = y - ry }
    if (x + rx > r.maxX) { r.maxX = x + rx }
    if (y + ry > r.maxY) { r.maxY = y + ry }
  }
  r.minX *= scale, r.minY *= scale, r.maxX *= scale, r.maxY *= scale
  return r
}

function parseDrill(text) {
  text = text.replace(/^[\s%]*M48/, '')
  text = text.replace(/[^\S\n]+/g, '')

  function numVal(x) {
    if (x[0] == '+') { return numVal(x.slice(1)) }
    if (x[0] == '-') { return -numVal(x.slice(1)) }
    if (x == '0') { return 0 }
    if (g.omitLead) {
      while (x.length < g.num) { x = `0${x}` } 
    } else {
      while (x.length < g.num) { x += '0' } 
    }
    return parseFloat(`${x.slice(0, g.int)}.${x.slice(g.int)}`, 10)
  }

  const cmds = text.split('\n')

  var g = { offA: 0, offB: 0, shapes: [], cmds: [], scale: 1 }, 
    shape, 
    body = false, 
    prevX = 0, 
    prevY = 0

  for (let i = 0; i < cmds.length; i++) {
    var d = cmds[i]
    if (!body) {
      if (d[0] == 'T') {
        var r = /^T(\d+)[^C]*C([\d.]+)/.exec(d) // assert(r);
        g.shapes[parseInt(r[1], 10)] = ['C', +r[2]]
      } else if (d == 'METRIC,LZ') { g.scale = 1, g.omitLead = false, g.int = 3, g.dec = 3, g.num = 6 } else if (d == 'METRIC,TZ' || d == 'M71') { g.scale = 1, g.omitLead = true, g.int = 3, g.dec = 3, g.num = 6 } else if (d == 'INCH,LZ') { g.scale = 25.4, g.omitLead = false, g.int = 2, g.dec = 4, g.num = 6 } else if (d == 'INCH,TZ' || d == 'M72') { g.scale = 25.4, g.omitLead = true, g.int = 2, g.dec = 4, g.num = 6 } else if (d == '%') { body = true }
    } else {
      function getNum(offset) {
        const r = /^[-+\d]*/.exec(d = d.slice(offset)) // assert(r);
        d = d.slice(r[0].length)
        return numVal(r[0])
      }
      if (d[0] == 'T') { shape = parseInt(d.slice(1), 10) } else if (d[0] == 'R') {
        var r = /^\d+/.exec(d = d.slice(1)) // assert(r);
        let nr = parseInt(r[0], 10), 
          dx = 0, 
          dy = 0
        d = d.slice(r[0].length)
        if (d[0] == 'X') { dx = getNum(1) }
        if (d[0] == 'Y') { dy = getNum(1) }

        // assert(!d.length);
        for (var x = prevX, y = prevY, j = 0; j < nr; j++) { x += dx, y += dy, g.cmds.push([(1 << 2) | 3, shape, x, y]) }
        prevX = x, prevY = y
      } else {
        var x = prevX, 
          y = prevY, 
          coords = false
        if (d[0] == 'X') { x = getNum(1), coords = true }
        if (d[0] == 'Y') { y = getNum(1), coords = true }
        if (coords) {
          g.cmds.push([(1 << 2) | 3, shape, x, y])
          prevX = x, prevY = y
        }
      }
    }
  }
  return g
}

function parseStandard(text, name) {
  text = text.replace(/\s+/g, '') // Get rid of any spaces/newlines.
  // text = text.replace(/%%+/g, ''); // Compact parameters.

  // Split into data and parameters sections;
  const sections = text.split('%')

  let g = { offA: 0, offB: 0, shapes: [], cmds: [], scale: 1 }, 
    shape = 0, 
    macros = {}, 
    mode = 1, 
    inverted = false, 
    prevX = 0, 
    prevY = 0

  function numVal(x) {
    if (x[0] == '+') { return numVal(x.slice(1)) }
    if (x[0] == '-') { return -numVal(x.slice(1)) }
    if (x == '0') { return 0 }
    if (g.omitLead) {
      while (x.length < g.num) { x = `0${x}` }
    } else {
      while (x.length < g.num) { x += '0' }
    }
    return parseFloat(`${x.slice(0, g.int)}.${x.slice(g.int)}`, 10)
  }

  // Even positions are function codes, odd ones are parameters.
  for (let i = 0; i < sections.length; i++) {
    // Ignore empty sections.
    if (!sections[i].length) { continue }
    // Get rid of data end markers at the end of data.
    sections[i][sections[i].length - 1] == '*' && (sections[i] = sections[i].slice(0, -1))
    sections[i] = sections[i].split('*')
    for (var j = 0; j < sections[i].length; j++) {
      var d = sections[i][j]
      if (i % 2) { // Parameters.
        if (d[0] == 'F' && d[1] == 'S') { // Format Specification.
          var r = /^([LT]?)([AI])X(\d)(\d)Y(\d)(\d)$/.exec(d.slice(2)) // assert(r);
          g.omitLead = !r[1] || r[1] == 'L'
          g.abs = r[2] == 'A'
          if (!g.abs) throw new Error('Need absolute values')
          g.int = +r[3], g.dec = +r[4], g.num = g.int + g.dec
        } else if (d[0] == 'O' && d[1] == 'F') { // Offset.
          var r = /^(?:A([-+\d.]+)|)(?:B([-+\d.]+)|)$/.exec(d.slice(2)) // assert(r);
          g.offA = parseInt(r[1], 10), g.offB = parseInt(r[2], 10)
        } else if (d == 'IPNEG') // Image Polarity.
        { throw new Error('Negative image polarity') } else if (d[0] == 'L' && d[1] == 'P') { // Layer Polarity.
          if (inverted && d[2] == 'D') // Switch to dark.
          { g.cmds.push([16 << 2, inverted = false]) } else if (!inverted && d[2] == 'C') // Switch to clear.
          { g.cmds.push([16 << 2, inverted = true]) }
        } else if (d[0] == 'A' && d[1] == 'M') { // Aperture Macro.
          const macro = []
          for (j++; j < sections[i].length; j++) { macro.push(sections[i][j]/* .split(',') */) }
          macros[d.slice(2)] = macro
        } else if (d[0] == 'A' && d[1] == 'D' && d[2] == 'D') { // Aperture Definition.
          var r = /^(\d+)([^,]+)(?:,(.+)|)$/.exec(d.slice(3)) // assert(r);
          var j = r[1] - 10, 
            args = []
          if (r[3]) { args = r[3].split('X') }
          if (macros[r[2]]) {
            function applyArgs(m) {
              m = m.replace(/\$(\d+)/g, (s, n) => +args[n - 1] || 0).toLowerCase()
              let repl = true
              while (repl == true) { repl = false, m = m.replace(/([\d.]+)x([\d.]+)/g, (s, a, b) => repl = true, a * b) }
              repl = true
              while (repl == true) { repl = false, m = m.replace(/([\d.]+)\/([\d.]+)/g, (s, a, b) => repl = true, a / b) }
              repl = true
              while (repl == true) { repl = false, m = m.replace(/([\d.]+)\+([\d.]+)/g, (s, a, b) => repl = true, a + b) }
              repl = true
              while (repl == true) { repl = false, m = m.replace(/([\d.]+)-([\d.]+)/g, (s, a, b) => repl = true, a - b) }
              return m
            }
            let m1 = macros[r[2]], 
              m2 = []
            for (let k = 0; k < m1.length; k++) {
              const eq = /^\$(\d+)=(.+)$/.exec(m1[k])
              if (eq) { args[eq[1] - 1] = +applyArgs(eq[2]) } else { m2.push(applyArgs(m1[k]).split(',').map(x => +x)) }
            }
            g.shapes[j] = ['M', m2]
          } else { g.shapes[j] = [r[2]].concat(args.map(x => +x)) }
          if (j < shape) { shape = j }
        } else if (d == 'MOIN') // Specify Inches.
        { g.scale = 25.4 } else if (d == 'MOMM') // Specify MMs.
        { g.scale = 1 } else {
          // console.log(d);
        }
      } else { // Function codes.
        if (d[0] == 'G' && d[1] == '0' && d[2] == '4' || d[0] == 'M') { continue }
        if (d[0] == 'G' && d[1] == '5' && d[2] == '4') { d = d.slice(3) }
        if (d == 'G70') { // Specify Inches.
          g.scale = 25.4
          continue
        }
        if (d == 'G74') { // Set Single quadrant mode.
          mode &= ~4
          continue
        }
        if (d == 'G75') { // Set Multi quadrant mode.
          mode |= 4
          continue
        }
        if (d == 'G36') { // Start Outline fill.
          if (!(mode & 8)) { g.cmds.push([8 << 2, true]) }
          mode |= 8
          continue
        }
        if (d == 'G37') { // End Outline fill.
          if (mode & 8) { g.cmds.push([8 << 2, false]) }
          mode &= ~8
          continue
        }
        let cmode = 0
        if (d[0] == 'G' && d.length > 4) {
          var r = /^\d*/.exec(d = d.slice(1)) // assert(r);
          mode = (mode & 12) | (cmode = parseInt(r[0], 10))
          d = d.slice(r[0].length)
        }
        function getNum(offset) {
          const r = /^[-+\d]*/.exec(d = d.slice(offset)) // assert(r);
          d = d.slice(r[0].length)
          return numVal(r[0])
        }
        let x = prevX, 
          y = prevY, 
          oi = 0, 
          oj = 0, 
          hasX = false, 
          hasY = false
        if (d[0] == 'X') { x = getNum(1), hasX = true }
        if (d[0] == 'Y') { y = getNum(1), hasY = true }
        if (d[0] == 'I') { oi = getNum(1), (!(mode & 2) && (x += oi, hasX = true)) }
        if (d[0] == 'J') { oj = getNum(1), (!(mode & 2) && (y += oj, hasY = true)) }
        if (d[0] == 'D')  { // Draw.
          if (d[1] == '0') { g.cmds.push([(mode << 2) | d[2], shape, x, y, oi, oj]) } else { shape = d.slice(1) - 10 }
        } else if (hasX && (x != prevX) || hasY && (y != prevY)) { g.cmds.push([(mode << 2) | 1, shape, x, y, oi, oj]) } else { prevX = x, prevY = y }
      }
    }
  }
  return g
}

