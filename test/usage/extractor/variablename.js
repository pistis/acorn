// https://astexplorer.net/
// https://doc.esdoc.org/github.com/mason-lang/esast/variable/index.html#static-variable-MethodDefinitionKind
const walk = require("../../../acorn-walk/dist/walk")

const extractVariablename = function (ast) {
  const names = new Map()
  
  walk.simple(ast, {
    VariableDeclarator(node, state) {
      const { type, name } = node.id

      if (type !== 'Identifier' || (node.init && node.init.type.indexOf('Function') !== -1)) return 
      if (names.has(name)) {
        names.set(name, names.get(name) + 1)
      } else {
        names.set(name, 1)
      }
    }
  })

  return names
}

module.exports = extractVariablename
