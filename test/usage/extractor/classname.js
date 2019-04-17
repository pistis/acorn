// https://astexplorer.net/
// https://doc.esdoc.org/github.com/mason-lang/esast/class/src/ast.js~ClassDeclaration.html
const walk = require("../../../acorn-walk/dist/walk")

const extractClassname = function (ast) {
  const names = new Map()
  
  walk.simple(ast, {
    ClassDeclaration(node, state) {
      const { type, name } = node.id
      if (names.has(name)) {
        names.set(name, names.get(name) + 1)
      } else {
        names.set(name, 1)
      }
    }
  })

  return names
}

module.exports = extractClassname