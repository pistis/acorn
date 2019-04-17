const walk = require("../../../acorn-walk/dist/walk")

const extractASTType = function (ast) {
    const types = new Map()

    walk.full(ast, (node, state, type) => {
        if (types.has(type)) {
            types.set(type, types.get(type) + 1)
          } else {
            types.set(type, 1)
          }
    })

    return types
}
  
module.exports = extractASTType

