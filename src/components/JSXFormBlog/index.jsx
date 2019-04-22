import React from 'react'
import 'react-markdown-reader/less/highlight.less'
import {
    beforePage,
    example,
    directive,
} from './markdown'
import { readMarkdown } from 'utils'
import './index.less'

export default class JSXFormBlog extends React.Component {
    constructor() {
        super()
        this.state = {
            curPage: 'example',
            catalogList: [],
        }
        this.cache = {}
    }
    displayPage = () => {
        const { curPage } = this.state
        if(curPage !== this.cache.curPage){
            this.cache = {}
            this.cache.curPage = curPage
        }
        let markdown = beforePage
        switch(curPage){
            case 'before':
                markdown = beforePage
                break
            case 'example':
                markdown = example
                break
            case 'directive':
                markdown = directive
                break
        }
        return readMarkdown(markdown, {
            cache: this.cache,
            requireFn: (path) => {
                return require(__dirname + path.trim())
            },
            setState: (key, value) => {
                this.setState({[key]: value})
            }
        })
    }
    render() {
        const { curPage, catalogList } = this.state
        const menuList = [
            {title: '前言', key: 'before'},
            {title: '实例', key: 'example'},
            {title: '指令', key: 'directive'},
            {title: '自定义指令', key: 'custom'},
            {title: '对比', key: 'contrast'},
            {title: '实现原理', key: 'principle'}
        ]
        return <div className="jsx-form-area">
            <div className="left-side">
                <div className="menu-header">JSX-Form</div>
                <div className="menu-content">
                    {
                        menuList.map(item => {
                            return <div className={`menu-item ${item.key === curPage ? 'active' : ''}`} 
                                key={item.key}
                                onClick={() => this.setState({curPage: item.key})}
                            >
                                {item.title}
                            </div>
                        })
                    }
                </div>
            </div>
            <div className="container">
                {this.displayPage()}
            </div>
            <div className="right-side">
                <h3>目录</h3>
                <ul>
                    {
                        catalogList.map((item, idx) => {
                            return <li key={idx} className={`${item.subMenu ? 'sub-menu' : ''}`}>
                                <a href={`#${item.id}`}>{item.name}</a>
                            </li>
                        })
                    }
                </ul>
            </div>
        </div>
    }
}