const acorn = require("../../acorn")
const walk = require("../../acorn-walk")
const fs = require('fs')
const path = require('path')

const resolve = file => path.resolve(__dirname, file)

const vanilla = resolve('./data/vanilla.js')
program = fs.readFileSync(vanilla, 'utf-8')

// 바닐라 module type 소스코드 파싱
const parsed = acorn.parse(program, {
  sourceType: 'module',
  ecmaVersion: 7
})

// console.log(JSON.stringify(parsed, null, 2))

// AST walk
walk.full(parsed, (node, state, type) => {
  console.log(`${Object.keys(node)} | ${state} | ${type}`)
})
