// https://astexplorer.net/
const acorn = require("../../acorn/dist/acorn")
const walk = require("../../acorn-walk/dist/walk")
const fs = require('fs')
const path = require('path')
const extractASTType = require('./extractor/asttype')
const extractClassname = require('./extractor/classname')
const extractMethodname = require('./extractor/methodname')
const extractVariablename = require('./extractor/variablename')
const extractParametername = require('./extractor/parametername')

const resolve = file => path.resolve(__dirname, file)

const walkSync = function (dir, filelist = []) {
  fs.readdirSync(dir).forEach(file =>{
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));
  });
  return filelist;
}

const getJavascriptFileList = function (repository) {
  let fileList = walkSync(repository)
  fileList = fileList.filter((file) =>{
    return file.match(/\.js$/g)
  })
  return fileList
}

const analysisASTTypes = function (fileList) {
  let types = []
  fileList.forEach((file, idx) =>{
    const program = fs.readFileSync(file, 'utf-8')
    const ast = acorn.parse(program, {
      sourceType: 'module',
      ecmaVersion: 9
    })
    const astTypeMap = extractASTType(ast)
    types = types.concat(Array.from(astTypeMap.keys()))
  })
  console.log('All Types', types)
}

const analysisNames = function (fileList) {
  fileList.forEach((file, idx) =>{
    if(idx > 10){
      return
    }
    
    const program = fs.readFileSync(file, 'utf-8')
    const ast = acorn.parse(program, {
      sourceType: 'module',
      ecmaVersion: 9
    })
    const classNameMap = extractClassname(ast)
    const methodNameMap = extractMethodname(ast)
    const variableNameMap = extractVariablename(ast)
    const parameterNameMap = extractParametername(ast)
    
    console.log(file)
    console.log('Class Names', classNameMap)
    console.log('Method Names', methodNameMap)
    console.log('Variable Names', variableNameMap)
    console.log('Parameter Names', parameterNameMap)
    
  })
}
let fileList = getJavascriptFileList(resolve('./data/vuex/src'))
fileList = [resolve('./data/vuex/src/helpers.js')]
fileList = [resolve('./data/vuex/src/index.esm.js')]
fileList = [resolve('./data/vuex/src/index.js')]
fileList = [resolve('./data/vuex/src/mixin.js')]
fileList = [resolve('./data/vuex/src/store.js')]
fileList = [resolve('./data/vuex/src/util.js')]

analysisNames(fileList)
// analysisASTTypes(fileList)
