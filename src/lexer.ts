export enum Mode {
  STATEMENT,
  FUNCTION,
  EXPRESSION,
}

export enum TT {
  OBJECT = `object`,
  LITERAL = `literal`,
  PUNCTUATION = `punctuation`,
}

export interface Token {
  match: string
  type: TT
}

export interface Expression {
  tokens: Token[]
}

export interface Statement {
  expressions: Expression[]
}

export class LexerError extends Error {
  constructor(public msg: string) {
    super(msg)
  }
}

export default function lexer(code: string): Token[] {
  let mode: Mode = Mode.STATEMENT
  let statements: Statement[] = []

  while (code.length > 0) {
    let match

    match = code.match(/^([()]|print|\r?\n|["'].+?["'])/)
    if (!match) throw new LexerError(`Unknown token starting at ${code}`)

    if (match[0] === `print`) {
      mode = Mode.FUNCTION
    } else if (match[0] === `(`) {
      mode = Mode.EXPRESSION
    }

    statements.push({})
  }

  return tokens
}
