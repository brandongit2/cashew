import {AstNode, IdfrNode, ImportListNode, ImportNode, StrNode} from "./Ast"
import {Token} from "./lexer"

export class ParserError extends Error {
  constructor(public msg: string) {
    super(msg)
  }
}

export function parser(tokens: Token[]) {
  let i = 0
  let token = tokens[i]
  function nextToken() {
    token = tokens[++i]
  }

  const rootNodes: AstNode[] = []

  while (token !== undefined) {
    parseTopLevelExpr()
  }

  function parseTopLevelExpr() {
    if (token[0] === `import`) {
      parseImportExpr()
    } else if (token[0] === `idfr` && tokens[i + 1][0] === `=`) {
      parseAssgmtExpr()
    }

    nextToken()
  }

  function parseImportExpr() {
    let importMembers: IdfrNode[] = []
    let importSrc = ``

    nextToken()
    if (token[0] === `from`) throw new ParserError(`Expected an import object.`)

    while (true) {
      if (token[0] === `from`) {
        nextToken()
        break
      }

      if (tokens[i - 1][0] === `idfr`) {
        if (token[0] !== `,`) throw new ParserError(`"," expected.`)
        nextToken()
      }

      if (token[0] !== `idfr`)
        throw new ParserError(`Expected an identifier after "import".`)
      importMembers.push(new IdfrNode(token[1]!))
      nextToken()
    }

    if (token[0] !== `str`) throw new ParserError(`Expected an import source.`)
    importSrc = token[1]!

    rootNodes.push(
      new ImportNode(new ImportListNode(importMembers), new StrNode(importSrc)),
    )
  }

  function parseAssgmtExpr() {
    nextToken()
    nextToken()

    parseNormalExpr()
  }

  function parseNormalExpr() {
    while (true) {
      if (token[0] !== `idfr`) throw new ParserError(`Expected an identifier.`)
      nextToken()

      if (token[0] === `idfr`) parseFuncExpr()

      nextToken()

      if (token[0] !== ``) {
      }
    }
  }

  function parseFuncExpr() {}

  return rootNodes
}
