import React from 'react'
import { Select } from 'antd'
import 'react-markdown-reader/less/highlight.less'
import { readMarkdown, addUrlParam, getUrlParam } from 'utils'
import './index.less'
import { versionList } from './utils/versions'

const Option = Select.Option

export default class JSXFormBlog extends React.Component {
    constructor() {
        super()
        const len = versionList.length
        const curDoc = versionList[len - 1]
        const page = getUrlParam('page')
        const curPage = page || curDoc.autoPage
        this.state = {
            curPage: curPage,
            catalogList: [],
            curVersion: curDoc.version,
            curDoc,
        }
        this.cache = {}
        addUrlParam({page: curPage})
    }
    displayPage = () => {
        const { curPage, curDoc } = this.state
        if(curPage !== this.cache.curPage){
            this.cache = {}
            this.cache.curPage = curPage
        }
        const markdown = (curDoc.menuList.find(item => item.key === curPage) || {}).md
        if(!markdown){
            return
        }
        return readMarkdown(markdown, {
            cache: this.cache,
            requireFn: (path) => {
                return require(__dirname + curDoc.path + path.trim())
            },
            setState: (key, value) => {
                this.setState({[key]: value})
            }
        })
    }
    render() {
        const { curPage, catalogList, curVersion, curDoc } = this.state
        return <div className="jsx-form-area">
            <div className="left-side">
                <div className="menu-header">
                    JSX-Form
                    <Select className="version-select" value={curVersion} onChange={value => {
                        const curDoc = versionList.find(item => item.version === value)
                        this.setState({curVersion: value, curDoc, catalogList: []})
                    }}>
                        {
                            versionList.map(item => <Option key={item.version} value={item.version}>{item.title}</Option>)
                        }
                    </Select>
                </div>
                <div className="menu-content">
                    {
                        curDoc.menuList.map(item => {
                            return <div className={`menu-item ${item.key === curPage ? 'active' : ''}`} 
                                key={item.key}
                                onClick={() => {
                                    addUrlParam({page: item.key})
                                    this.setState({curPage: item.key})
                                }}
                            >
                                {item.title}
                            </div>
                        })
                    }
                </div>
            </div>
            <div className="container" style={{right: catalogList.length > 1 ? 260 : 0}}>
                {this.displayPage()}
            </div>
            {
                catalogList.length > 1 && <div className="right-side">
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
            }
        </div>
    }
}