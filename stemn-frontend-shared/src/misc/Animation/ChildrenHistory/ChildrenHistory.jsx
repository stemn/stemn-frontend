export default class ChildrenHistory {
  constructor() {
  }
  children = []
  get(newChildren, shouldUpdate) {
    if (shouldUpdate) {
      this.children = newChildren
    }
    return this.children || newChildren
  }
}

