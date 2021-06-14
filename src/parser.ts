import {TT, Token} from "./lexer"

export class ParserError extends Error {
  constructor(public msg: string) {
    super(msg)
  }
}

const stack = []

export default function parser(tokens: Token[]): any {
  for (let i = 0; i < tokens.length; ) {
    const token = tokens[i]
    let numTokensConsumed = 1

    switch (token.type) {
      case TT.OBJECT: {
        if (token.match === `print`) {
          if (tokens[i + 1].match !== `(`) throw new ParserError(`Expected '('; instead found ${token.match}.`)
          if (tokens[i + 3].match !== `)`) throw new ParserError(`Expected ')'; instead found ${token.match}.`)

          const literal = tokens[i + 2]
          if (literal.type !== TT.LITERAL)
            throw new ParserError(`Expected a literal; instead found a(n) ${literal.type}.`)

          let toPrint = literal.match
          if (/^["'].+?["']$/.test(literal.match)) {
            toPrint = literal.match.slice(1, -1)
          }

          console.log(toPrint)

          numTokensConsumed = 4
        }

        break
      }
      case TT.PUNCTUATION: {
        break
      }
      default: {
        throw new ParserError(`Unknown token ${token.match}.`)
      }
    }

    i += numTokensConsumed
  }
}
