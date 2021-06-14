const heap: Record<string, any> = {}

function splitBalancedOn(code: string, delimiter: string) {
  const groups: string[] = []
  let cur = ``

  let depth = 0
  for (let char of code) {
    if (char === delimiter[0]) {
      depth++
      if (depth === 1) continue
    }
    if (char === delimiter[1]) {
      depth--
      if (depth === 0) continue
    }

    if (depth > 0) cur += char
    if (depth === 0 && cur.length > 0) {
      groups.push(cur)
      cur = ``
    }
  }
  if (cur.length > 0) groups.push(cur)

  return groups
}

export function parser(code: string): string {
  let words = code
    .trim()
    .match(/((?<=\s)|^)\s*(".+?"|\(.+\)|\[.+\]|.+?)((?=\s)|$)/gms)
    ?.map((word) => word.trim())
    .filter(Boolean)
  if (!words) return `undefined`

  words = words?.map((word, i) => {
    if (word[0] === `[` && word[word.length - 1] === `]`) {
      splitBalancedOn(word.slice(1, -1), `()`).forEach((expr) => {
        parser(expr)
      })
      return `undefined`
    } else if (word[0] === `(` && word[word.length - 1] === `)`) {
      return parser(word.slice(1, -1))
    } else {
      if (words?.[0] !== `set` && i !== 0 && /^[\w+]$/.test(word) && !/^[0-9]+$/.test(word)) {
        return heap[word]
      } else {
        return word
      }
    }
  })

  const [op, ...args] = words
  switch (op) {
    case `print`: {
      console.log(
        ...args.map((arg) => {
          if (arg[0] === `"` && arg[arg.length - 1] === `"`) {
            return arg.slice(1, -1)
          } else {
            return arg
          }
        }),
      )
      return `undefined`
    }
    case `add`: {
      return args.reduce((cur, acc) => {
        if (/[^0-9]/.test(cur)) {
          return String(parseFloat(heap[cur]) + parseFloat(acc))
        }

        return String(parseFloat(cur) + parseFloat(acc))
      })
    }
    case `sub`: {
      return args.reduce((cur, acc) => {
        if (/[^0-9]/.test(cur)) {
          return String(parseFloat(heap[cur]) - parseFloat(acc))
        }

        return String(parseFloat(cur) - parseFloat(acc))
      })
    }
    case `mul`: {
      return args.reduce((cur, acc) => {
        if (/[^0-9]/.test(cur)) {
          return String(parseFloat(heap[cur]) * parseFloat(acc))
        }

        return String(parseFloat(cur) * parseFloat(acc))
      })
    }
    case `div`: {
      return args.reduce((cur, acc) => {
        if (/[^0-9]/.test(cur)) {
          return String(parseFloat(heap[cur]) / parseFloat(acc))
        }

        return String(parseFloat(cur) / parseFloat(acc))
      })
    }
    case `set`: {
      heap[args[0]] = args[1]
      return args[1]
    }
    case `undefined`: {
      return `undefined`
    }
    default: {
      throw new Error(`Unknown operator ${op}.`)
    }
  }
}

function test(name: string, code: string) {
  console.log(`\n==========${name}==========`)
  console.log(`input:\n${code}\n\noutput:`)
  parser(code)
}

test(`test 1`, `( print ( add 1 ( mul 2 6 ) ) )`)

test(`test 2`, `( print "hello world" "string 2" )`)

test(
  `test 3`,
  `
    [
      ( set x 4 )
      ( set x ( div x 2 ) )
      ( set y ( add x 6 ( mul x x ) ) )
      ( print y )
    ]
  `,
)
