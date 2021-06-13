export enum TT {
  OBJECT = `object`,
  LITERAL = `literal`,
  PUNCTUATION = `punctuation`,
}

export interface Token {
  match: string
  type: TT
}

export default function lexer(code: string): Token[] {
  let tokens: Token[] = []

  while (code.length > 0) {
    let match

    match = code.match(/^print/)
    if (match) {
      tokens.push({
        match: match[0],
        type: TT.OBJECT,
      })
      code = code.substring(match[0].length)
      continue
    }

    match = code.match(/^([()]|\r?\n)/)
    if (match) {
      tokens.push({
        match: match[0],
        type: TT.PUNCTUATION,
      })
      code = code.substring(match[0].length)
      continue
    }

    match = code.match(/^["'](.+?|[0-9.]+)["']/)
    if (match) {
      tokens.push({
        match: match[0],
        type: TT.LITERAL,
      })
      code = code.substring(match[0].length)
      continue
    }

    if (!match) {
      console.log(`Unknown token starting at ${code}`)
      break
    }
  }

  return tokens
}
