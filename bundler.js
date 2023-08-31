const fs = require('fs')

const path = require('path')
// babel parse 生成 ast
const parser = require('@babel/parser')
// 遍历
const traverse = require('@babel/traverse').default

const babel = require('@babel/core')

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

    const { code } = babel.transformFromAst(ast, null , {
        // presets: ['env']  // babel 6.x
        presets: ['@babel/preset-env'] // babel 7.x
    })  

    return {
        id, 
        filename,
        depends,
        code
    }
}

const createGraph = function(entry) {

    const mainAsset = createAsset(entry)

    // 使用一个队列来 遍历
    const queue = [mainAsset]


    for(const asset of queue){

        asset.mapping = {}

        const dirname = path.dirname(asset.filename)

        asset.depends.forEach((relativePath) => {
            const absolutePath = path.join(dirname, relativePath)

            const child = createAsset(absolutePath)

            asset.mapping[relativePath] = child.id

            // 有依赖继续 push  ,直到队列结束
            queue.push(child)
        })
    }

    return queue
}

const graph = createGraph('./example/entry.js')

const bundle = (graph) => {
    // 打包生成 bundle (可以运行的产物)
    let modules = ''

    graph.forEach(mod => {
        // 根据 babel env 处理的结果 传值
        modules += `${mod.id}: [
            function(require, module, exports){
                ${mod.code}
            },
            ${JSON.stringify(mod.mapping)}
        ],`
    })

    const _result = `
        (function(modules) {
            // 关键函数
            function require(id) {
                const [fn, mapping] = modules[id]

                function localRequire(relativePath) {
                    return require(mapping[relativePath])
                }

                const module = { exports: {} }

                fn(localRequire, module, module.exports);
                return module.exports
            }
            require(0)
        }) ({${modules}})
    `;

    return _result

}

const result = bundle(graph)

console.log(result)