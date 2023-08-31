const fs = require('fs')

// babel parse 生成 ast
const parser = require('@babel/parser')
// 遍历
const traverse = require('@babel/traverse').default

let ID = 0

function createAsset(filename){
    const content = fs.readFileSync(filename, 'utf-8')
    const ast = parser.parse(content, {
        sourceType: 'module'
    })

    const depends = []
    // console.log(content)
    // console.log(ast)
    traverse(ast, {
        ImportDeclaration: ({node}) => { 
            // console.log(node)
            depends.push(node.source.value)
        }
    })
    // console.log(depends)

    const id  = ID++
    return {
        id, 
        filename,
        depends
    }
}



const mainAsset = createAsset('./example/entry.js')

console.log(mainAsset)