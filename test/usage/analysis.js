// https://astexplorer.net/
const acorn = require("../../acorn/dist/acorn")
const walk = require("../../acorn-walk/dist/walk")
const fs = require('fs')
const path = require('path')

const resolve = file => path.resolve(__dirname, file)

const vanilla = resolve('./data/vanilla.js')
program = fs.readFileSync(vanilla, 'utf-8')

// 바닐라 module type 소스코드 파싱
const parsed = acorn.parse(program, {
  sourceType: 'module',
  ecmaVersion: 9
})

walk.simple(acorn.parse("this.data['test']"), {
  MemberExpression(node, state) {
    console.log('MemberExpression', JSON.stringify(node, null, 2))
  }
})
