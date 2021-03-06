import fs from "fs"
import path from "path"

import {lexer} from "./lexer"
import {parser} from "./parser"

const file = fs
  .readFileSync(path.resolve(__dirname, `../cashew/test.chw`))
  .toString()

const tokens = lexer(file)
const ast = parser(tokens)

console.log(ast)
