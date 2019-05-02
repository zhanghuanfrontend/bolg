import React from 'react'
import { Input } from 'antd'
import '../index.less'

export default class FormItem extends React.Component {
    constructor(){
        super()
        this.times = 0
    }
    render() {
        const { value, label, onChange} = this.props
        this.times++
        console.log(`${label} render one time`)
        return <div className="form-item-input">
            <Input value={value} onChange={onChange} />
            <div className="show-render-info">该组件 render {this.times} 次</div>
        </div>
    }
}