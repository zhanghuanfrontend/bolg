import React, { createRef } from 'react'
import JSXForm from 'react_jsx_form'
import { Input, Select, Button, Icon } from 'antd';
import { paramList, typeList } from './testData'
import './index.less'
const Option = Select.Option
const TextArea = Input.TextArea

export default class Base extends React.Component {
    constructor(){
        super()
        this.state = {
            outputData: {}
        }
    }
    render() {
        return <div>
            <JSXForm className="dynamic-form-area" onChange={(valid, data) => this.setState({outputData: data})}>
                <div className="param-item" v-for="(item, index) in paramList">
                    <div className="param-rows">
                        <Select v-model="item.name" v-class="param-select" v-label="param">
                            <Option v-for="paramItem in {paramList}" value={paramItem.name}>{paramItem.name}</Option>
                        </Select>
                        <Select className="type-select" v-model="item.type">
                            <Option v-for="typeItem in {typeList}" value={typeItem}>{typeItem}</Option>
                        </Select>
                    </div>
                    <TextArea v-model="item.desc" v-label="描述" rows="3"></TextArea>
                    <div className="add-btn" onClick={() => {
                        const paramList = _self.getValue('paramList') || []
                        paramList.push({desc: ''})
                        _self.setValue('paramList', paramList)
                    }} v-show={index === _self.getValue('paramList').length - 1}>+</div>
                    <div className="delete-btn" v-show={_self.getValue('paramList').length > 1} onClick={() => {
                        const paramList = _self.getValue('paramList')
                        paramList.splice(index, 1)
                        _self.setValue('paramList', paramList)
                    }}>
                        <Icon theme="filled" type="delete" />
                    </div>
                </div>
            </JSXForm>
            <span>表单输出结果：</span>
            <pre>
                <code>{JSON.stringify(this.state.outputData)}</code>
            </pre>
        </div>
    }
}