// https://astexplorer.net/
// https://doc.esdoc.org/github.com/mason-lang/esast/variable/index.html#static-variable-MethodDefinitionKind
// https://doc.esdoc.org/github.com/mason-lang/esast/class/src/ast.js~FunctionDeclaration.html
const walk = require("../../../acorn-walk/dist/walk")

const extractMethodname = function (ast) {
  const names = new Map()
  
  walk.simple(ast, {
    MethodDefinition(node, state) {
      if (node.kind !== 'method') return
      const { type, name } = node.key
      if (type !== 'Identifier') return 
      if (names.has(name)) {
        names.set(name, names.get(name) + 1)
      } else {
        names.set(name, 1)
      }
    },
    FunctionDeclaration(node, state) {
      if (!node.id) return  // 익명함수
      const { type, name } = node.id
      if (type !== 'Identifier') return 
      if (names.has(name)) {
        names.set(name, names.get(name) + 1)
      } else {
        names.set(name, 1)
      }
    }
  })

  return names
}

module.exports = extractMethodname
