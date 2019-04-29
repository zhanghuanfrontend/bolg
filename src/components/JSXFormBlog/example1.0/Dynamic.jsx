import React, { createRef } from 'react'
import JSXForm from '../../../../JSXForm/index.min.1.2.2'
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
                    },
                    // {
                    //     name: '',
                    //     type: 'integer',
                    //     desc: ''
                    // }
                ]
            }
        }
        this.JSXForm = React,createRef()
    }
    render() {
        const {formData} = this.state
        return <div className="dynamic-form-area">
            <JSXForm value={formData} onChange={(data) => {
                this.setState({formData: data})
            }}>
                <div className="param-item" v-for="(item, index) in paramList">
                    <div className="param-rows">
                        <Select v-model="item.name" v-label-class="param-select" v-label="param">
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
                    <div className="add-btn" v-click="paramList.push({name: '', type: 'integer', desc: ''})" v-show="index === paramList.length - 1">+</div>
                    <div className="delete-btn" v-show="paramList.length > 1" v-click="paramList.splice(index, 1)">
                        <Icon theme="filled" type="delete" />
                    </div>
                </div>
            </JSXForm>
        </div>
    }
}