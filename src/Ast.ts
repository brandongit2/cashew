export class AstNode {
  children: AstNode[] = []

  append(child: AstNode) {
    this.children.push(child)
  }
}

export class NumNode extends AstNode {
  constructor(public val: string) {
    super()
  }
}

export class StrNode extends AstNode {
  constructor(public val: string) {
    super()
  }
}

export class IdfrNode extends AstNode {
  constructor(public name: string) {
    super()
  }
}

export class BinOpNode extends AstNode {
  constructor(public op: string, public lhs?: string, public rhs?: string) {
    super()
  }
}

export class FuncNode extends AstNode {
  constructor(public name: string, public params: string[] = []) {
    super()
  }
}

export class ImportNode extends AstNode {
  constructor(public importExpr: ImportListNode, public src: StrNode) {
    super()
  }
}

export class ImportListNode extends AstNode {
  constructor(public objs: IdfrNode[]) {
    super()
  }
}
