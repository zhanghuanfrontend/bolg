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
            formData: {
                paramList: [
                    {
                        name: '',
                        type: 'string',
                        desc: ''
                    }
                ]
            }
        }
    }
    render() {
        const { formData } = this.state
        return <div className="dynamic-form-area">
            <JSXForm value={formData}>
                <div className="param-item" v-for="(item, index) in paramList" v-init={[
                    {
                        name: '',
                        type: 'string',
                        desc: ''
                    }
                ]}>
                    <div className="param-rows">
                        <Select v-model="item.name" v-class="param-select" v-label="param">
                            {
                                paramList.map(item => <Option value={item.name}>{item.name}</Option>)
                            }
                        </Select>
                        <Select className="type-select" v-model="item.type">
                            {
                                typeList.map(item => <Option value={item}>{item}</Option>)
                            }
                        </Select>
                    </div>
                    <TextArea v-model="item.desc" v-label="描述" rows="3"></TextArea>
                    <div className="add-btn" onClick={() => {
                        const paramList = _self.getValue('paramList')
                        paramList.push({name: '', type: 'integer', desc: ''})
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
        </div>
    }
}