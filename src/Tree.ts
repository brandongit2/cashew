export class TreeNode {
  public parent: TreeNode | null = null

  constructor(public content: any, public children: TreeNode[] = []) {}

  append(node: TreeNode | TreeNode[]) {
    if (node instanceof TreeNode) {
      node.parent = this

      this.children.push(node)
    } else {
      node.forEach((n) => (n.parent = this))
      this.children.push(...node)
    }
  }
}
