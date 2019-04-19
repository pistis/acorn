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
const extractArgumentsname = require('./extractor/argumentsname')
const extractAttributename = require('./extractor/attributename')

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

const classNames = new Map()
const methodNames = new Map()
const variableNames = new Map()
const parameterNames = new Map()
const argumentsNames = new Map()
const attributeNames = new Map()

const addResult = function(results, maps) {
  // console.log(maps)
  maps.forEach((value, key) => {
    if (results.has(key)) {
      results.set(key, results.get(key) + 1)
    } else {
      results.set(key, 1)
    }
  })
}
const analysisNames = function (fileList) {
  fileList.forEach((file, idx) =>{
    // if(idx > 10){
    //   return
    // }
    
    const program = fs.readFileSync(file, 'utf-8')
    const ast = acorn.parse(program, {
      sourceType: 'module',
      ecmaVersion: 9
    })
    try {
      addResult(classNames, extractClassname(ast))
      addResult(methodNames, extractMethodname(ast))
      addResult(variableNames, extractVariablename(ast))
      addResult(parameterNames, extractParametername(ast))
      addResult(argumentsNames, extractArgumentsname(ast))
      addResult(attributeNames, extractAttributename(ast))

      // console.log(file)
      // console.log('Class Names', classNameMap)
      // console.log('Method Names', methodNameMap)
      // console.log('Variable Names', variableNameMap)
      // console.log('Parameter Names', parameterNameMap)
      // console.log('Arguments Names', argumentsNameMap)
      // console.log('Attribute Names', attributeNameMap)
    } catch(e) {
      console.log(file)
      console.error(e)
      process.exit()
    }
  })

  console.log(methodNames)
  const list = []
  variableNames.forEach((value, key) => {
    list.push(`${key} ${value}`)
  })

  fs.writeFileSync(resolve('./results.txt'), list.join('\n'), {
    encoding : 'utf8',
    flag : 'w+'
  })
}
let fileList = getJavascriptFileList(resolve('./data/vuex/src'))
// fileList = getJavascriptFileList(resolve('/Users/lineplus/Desktop/dev/company/LINE-Search/src'))
// fileList = [resolve('./data/vuex/src/helpers.js')]
// fileList = [resolve('./data/vuex/src/index.esm.js')]
// fileList = [resolve('./data/vuex/src/index.js')]
// fileList = [resolve('./data/vuex/src/mixin.js')]
// fileList = [resolve('./data/vuex/src/store.js')]
// fileList = [resolve('./data/vuex/src/util.js')]
// fileList = [resolve('./data/vuex/src/plugins/logger.js')]
// fileList = [resolve('./data/vuex/src/module/module-collection.js')]
// fileList = [resolve('/Users/lineplus/Desktop/dev/company/LINE-Search/src/client/js/common/is.js')]

console.log(`${fileList.length} file list anaysis`)
analysisNames(fileList)
// analysisASTTypes(fileList)
