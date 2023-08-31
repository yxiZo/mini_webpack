const fs = require('fs')

const path = require('path')
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

const createGraph = (entry) => {

    const mainAsset = createAsset(entry)

    const queue = [mainAsset]


    for(const asset of queue){
        
        asset.mapping = {}

        const dirname = path.dirname(asset.filename)

        asset.depends.forEach((relativePath) => {
            const absolutePath = path.join(dirname, relativePath)

            const child = createAsset(absolutePath)

            asset.mapping[relativePath] = child.id

            queue.push(child)
        })
    }

    return queue
}

const graph = createGraph('./example/entry.js')


console.log(graph)