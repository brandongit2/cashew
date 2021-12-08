export type TokenType =
  | `eof`
  | `eol`
  | `func`
  | `import`
  | `from`
  | `idfr`
  | `num`
  | `str`
export type Token = [TokenType | string, string | null]

export function lexer(file: string) {
  let i = 0

  let char = ` `
  const nextChar = () => {
    char = file[i++]
    if (char === undefined) throw `eof`
  }

  let buf
  function getToken(): Token {
    function handleComment(): void {
      do {
        nextChar()
        // @ts-ignore
      } while (char !== `\n` && char !== `\r`)
    }

    function handleIdfr(): Token {
      buf = ``
      while (/[\w_]/.test(char)) {
        buf += char
        nextChar()
      }

      if (buf === `func`) return [`func`, null]
      if (buf === `import`) return [`import`, null]
      if (buf === `from`) return [`from`, null]
      return [`idfr`, buf]
    }

    function handleNum(): Token {
      buf = ``
      let hasEncounteredDot = false

      do {
        if (char === `.`) {
          if (hasEncounteredDot) throw 0
          hasEncounteredDot = true
        }
        buf += char
        nextChar()
      } while (/[0-9.]/.test(char))

      return [`num`, buf]
    }

    function handleStr(): Token {
      buf = ``
      nextChar()
      while (char !== `"`) {
        buf += char
        nextChar()
      }
      nextChar()

      return [`str`, buf]
    }

    function handleNewLine(): Token {
      while (char === `\n` || char === `\r` || char === `#`) {
        // @ts-ignore
        if (char === `#`) handleComment()
        nextChar()
      }

      return [`eol`, null]
    }

    try {
      while (char === ` `) nextChar()

      if (/[a-zA-Z]/.test(char)) return handleIdfr()
      if (/[0-9]/.test(char)) return handleNum()
      if (char === `"`) return handleStr()
      if (char === `\n` || char === `\r`) return handleNewLine()

      if (char === `#`) {
        handleComment()
        return getToken()
      }

      try {
        return [char, null]
      } finally {
        nextChar()
      }
    } catch (err) {
      if (err === `eof`) return [`eof`, null]
      throw err
    }
  }

  const tokens: Token[] = []
  let token
  do {
    token = getToken()
    tokens.push(token)
  } while (token[0] !== `eof`)
  return tokens
}
