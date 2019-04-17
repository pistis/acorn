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

// console.log(JSON.stringify(parsed, null, 2))

// AST walk
walk.full(parsed, (node, state, type) => {
  // console.log(`${Object.keys(node)} | ${state} | ${type}`)
})

walk.full(acorn.parse("let a = 1 + 1"), (node, state, type) => {
  // console.log(`${Object.keys(node)} | ${state} | ${type}`)
})

walk.simple(parsed, {
  VariableDeclaration(node, state) { // XXX VariableDeclarator의 상위
    // console.log(JSON.stringify(node, null, 2))
    // console.log(state)
  },
  FunctionDeclaration(node, state) {  // function 정의
    console.log('FunctionDeclaration')
    // const { type, name } = node.id  // 함수 이름
    // const paramNames = node.params.map(param => param.name)  // 함수 인자

    // console.log(`${type}, ${name}`)
    // console.log(`${paramNames}`)
    // console.log('FunctionDeclaration', JSON.stringify(node, null, 2))
    // console.log(state)
  },
  VariableDeclarator(node, state) { // var, let, const
    console.log('VariableDeclarator')
    // const { type, name } = node.id
    
    // console.log(`${type}, ${name}`)
    // console.log('VariableDeclarator', JSON.stringify(node, null, 2))
    // console.log(state)
  },
  MemberExpression(node, state) { // 멤버 변수 or 함수
    console.log('MemberExpression')
    if (node.computed) { // property is Expression
      const { type, name } = node.property
      console.log(`${type}, ${name}`)
    } else { // property is Identifier
      const { type, name } = node.property
      console.log(`${type}, ${name}`)
    }
  },
})

// Comments...
// 내부 변수 정의의 기준을 어떻게 할 것인지?
// 정의 표현식만 빈도수 체크를 할 것인가?
// 코드상에 나타나는 빈도수를 체크할 것인가?
// 빈도수도 종류별로 하자. 정의한 빈도수, 코드상에 나타난 빈도 수 (represent)
