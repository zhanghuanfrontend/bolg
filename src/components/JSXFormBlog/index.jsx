import React from 'react'
import { Select } from 'antd'
import 'react-markdown-reader/less/highlight.less'
import { readMarkdown, addUrlParam, getUrlParam, getUrlHash, setUrlHash } from 'utils'
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
            curMenu: '',
        }
        this.cache = {}
        addUrlParam({page: curPage})
    }
    componentDidMount(){
       document.addEventListener('scroll', this.handleScrollFn)
    }
    // 监听滚动
    handleScrollFn = () => {
        const { catalogList, curMenu } = this.state
        if(!catalogList || catalogList.length === 0 || !curMenu){
            return 
        }
        let index = 0
        const len = catalogList.length
        catalogList.forEach((item, idx) => {
            if(item.id === curMenu){
                index = idx
            }
        })
        const ele = document.getElementById(curMenu)
        const prevEle = index > 0 ? document.getElementById(catalogList[index - 1].id) : ele
        const nextEle = index < len - 1 ? document.getElementById(catalogList[index + 1].id) : ele
        if(!ele || !prevEle || !nextEle){
            return
        }
        const prevTop = prevEle.getBoundingClientRect().top
        const nextTop = nextEle.getBoundingClientRect().top
        const top = ele.getBoundingClientRect().top
        if(top < nextTop && nextTop <= 0){
            this.setState({curMenu: catalogList[index + 1].id})
        }else if(prevTop < top && prevTop >= 0){
            this.setState({curMenu: catalogList[index - 1].id})
        }
    }
    componentWillUpdate(nextProps, nextState){
        const { catalogList } = nextState
        if(catalogList && catalogList !== this.state.catalogList){
            let curMenu = getUrlHash()
            if(!curMenu || !catalogList.some(item => item.id === curMenu)){
                curMenu = catalogList[0].id
                setUrlHash(curMenu)
            }
            this.setState({curMenu,})
        }
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
        const { curPage, catalogList, curVersion, curDoc, curMenu } = this.state
        return <div className="jsx-form-area">
            <div className="left-side">
                <div className="menu-header">
                    JSX-Form
                    <Select className="version-select" value={curVersion} onChange={value => {
                        const curDoc = versionList.find(item => item.version === value)
                        this.setState({
                            curVersion: value, 
                            curDoc, 
                            catalogList: curDoc.menuList || [],
                            curPage: curDoc.autoPage
                        })
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
                                return <li key={idx} 
                                    onClick={() => this.setState({curMenu: item.id})}
                                    className={`${curMenu === item.id ? 'active' : ''}`}>
                                    <a 
                                        className={`${item.subMenu ? 'sub-menu' : ''}`} 
                                        href={`#${item.id}`}>{item.name}</a>
                                </li>
                            })
                        }
                    </ul>
                </div>
            }
        </div>
    }
}