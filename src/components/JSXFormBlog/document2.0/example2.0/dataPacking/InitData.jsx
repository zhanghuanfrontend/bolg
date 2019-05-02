import React from 'react'
import { Button, Icon, Input, Select, Radio } from 'antd';
import JSXForm from 'react_jsx_form'
import './index.less'

export default class Base extends React.Component {
    constructor() {
        super()
        this.state = {
            outputData: {}
        }
    }
    render() {
        return <div className="data-packing-base">
            <JSXForm value={{
                    name: 'name-init',
                    type: 'type-init',
                }} 
                onChange={(valid, data) => this.setState({outputData: data})}>
                <Input v-model="name" v-label="name" />
                <Input v-model="type" v-init="date" v-label="type" />
                <div v-for="item in list">
                    <Input v-label="param" v-model="item.param" />
                </div>
            </JSXForm>
            <span>表单输出结果：</span>
            <pre>
                <code>{JSON.stringify(this.state.outputData)}</code>
            </pre>
        </div>
    }
}