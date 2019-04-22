import React from 'react'
import { Icon } from 'antd'
import './index.less'

export default class CodeDisplay extends React.Component {
    constructor(){
        super()
        this.state = {
            showCode: false
        }
        this.codeArea = React.createRef()
    }
    componentDidMount(){
        if(this.codeArea && this.codeArea.current){
            hljs.highlightBlock(this.codeArea.current);
        }
    }
    render() {
        const { title = '', desc = '', code = '' } = this.props
        const { showCode } = this.state
        return <div className="code-display-code">
            <div className="code-area">
                {this.props.children}
            </div>
            <div className="content">
                <div className="title">
                    <span className="line"></span>
                    <span className="title-content">{title}</span>
                    <span className="line last-line"></span>
                </div>
                <div className="desc">
                    {desc}
                </div>
                <div className="display-code" onClick={() => this.setState({showCode: !showCode})}>
                    <Icon type="down" className={`${showCode ? 'show-code' : ''}`} />
                </div>
                <div className={`code-display-area ${showCode ? 'show-code' : ''}`} 
                    ref={this.codeArea}
                    dangerouslySetInnerHTML={{__html: code}}></div>
            </div>
        </div>
    }
}