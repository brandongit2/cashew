import fs from "fs"
import path from "path"

import lexer from "./lexer"
import parser from "./parser"

let file = fs.readFileSync(path.resolve(__dirname, `../cashew/test.chw`)).toString()

const tokens = lexer(file)
parser(tokens)
