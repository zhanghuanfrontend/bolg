import React from 'react'
import ReactDOM from 'react-dom'
import { Table } from 'antd'
import { Markdown } from 'react-markdown-reader';
import CodeDisplay from 'tmp/CodeDisplay'
// 渲染实例代码
const renderCodeDisplay = (Element, idName, cache) => {
    const wrap = document.getElementById(idName)
    if(!wrap){
        setTimeout(() => {
            this.renderCodeDisplay(Element, idName, cache)
        }, 10)
        return 
    }
    ReactDOM.render(
        <CodeDisplay {...cache}>
            <Element />
        </CodeDisplay>,
        wrap
    )
}

// 解析参数
const parseParam = (paramArr, idName, cache, options) => {
    const { requireFn } = options
    if(paramArr.length === 0){
        return
    }
    const type = paramArr[0] || ''
    switch(type){
        case 'path':
            const path = paramArr[1] || ''
            const Element = requireFn(path).default
            setTimeout(() => {
                renderCodeDisplay(Element, idName, cache)
            }, 10)
            break
        case 'param':
            const key = paramArr[1] || ''
            const value = paramArr[2] || true
            switch(key){
                case 'type':
                    break
                case 'title':
                    cache.title = value
                    break
                case 'desc':
                    cache.desc = value
                    break
            }
    }
}
// 解析可执行代码
const parseExecCode = (code, idName, options) => {
    const paramReg = /@(.*?)(\n|$)/g
    const cache = {}
    const displayCode = code.replace(paramReg, (match, content) => {
        if(content && content.includes(' ')){
            const paramArr = content.split(' ').filter(item => item)
            parseParam(paramArr, idName, cache, options)
        }
        return ''
    })
    cache.code = displayCode
}

// 读取表格数据
const parseTableCode = (tableCode, idName) => {
    const params = tableCode.replace(/\s/g, '').replace(/(&quot;|&#39;)/g, '"')
    let config = []
    try {
        config = JSON.parse(params)
    }catch(err){
        console.error('表格配置格式错误')
    }
    if(!Array.isArray(config[0]) || !Array.isArray(config[1])){
        return ''
    }
    const columns = config[0].map(item => ({
        ...item,
        key: item.dataKey
    }))
    const dataSource = config[1].map((item, idx) => ({
        ...item,
        key: idx
    }))
    const Element = <Table columns={columns} pagination={false} dataSource={dataSource} />

    setTimeout(() => {
        ReactDOM.render(
            Element,
            document.getElementById(idName)
        )
    }, 10)
}

// 解析markdown语法
export default (mdContent, options, callback) => {
    const { cache, setState } = options

    if(!cache.md){
        // 替换代码
        const reg = /<\/?code>/g
        let displayMd = mdContent.replace(reg, (match) => {
            if(match === '</code>'){
                return '</pre></code>'
            }
            return '<pre><code>'
        })
        // 读取目录
        const catalogList = []
        const menuReg = /<(h[23]).*?id="(.*?)">(.*?)<\/\1>/g
        displayMd = displayMd.replace(menuReg, (match, name, id, content, input) => {
            const idName = `${id}_${input}`
            catalogList.push({
                name: content,
                id: idName,
                subMenu: name === 'h3'
            })
            return `<${name} id="${idName}">${content}</${name}>`
        })
        setState && setState('catalogList', catalogList)
        // 读取可执行代码
        const execReg = /<p>~{3}([\s\S]*?)~{3}<\/p>/gm
        displayMd = displayMd.replace(execReg, (match, code, index) => {
            const idName = `exec-code-display-area-${index}`
            parseExecCode(code, idName, options)
            return `<div class="code-display-wrap" id="${idName}"></div>`
        })
        // 读取表格
        const tableReg = /<p>(?:t|T)able\s+([^]*?)<\/p>/g
        displayMd = displayMd.replace(tableReg, (match, table, index) => {
            const idName = `table-display-area-${index}`
            parseTableCode(table, idName)
            return `<div class="tabel-display-wrap" id="${idName}"></div>`
        })
        cache.md = displayMd
    }
    return <Markdown>{cache.md}</Markdown>
}