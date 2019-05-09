import React from 'react'
import { Button, Icon, Input, Select, Radio } from 'antd';
import JSXForm from 'react_jsx_form'
import '../index.less'

const TextArea = Input.TextArea
const RadioGroup = Radio.Group
const Option = Select.Option

export default class Base extends React.Component {
    constructor() {
        super()
        this.state = {
            outputData: {},
        }
    }
    render() {
        const initValue = {
            test: 'init-value',
            value: 'init-data'
        }
        return <div>
            <JSXForm 
                value={initValue}
                className="base-form-area"
                onChange={(valid, data) => {
                    console.log(data)
                    this.setState({outputData: data})
                }}>
                <Input v-model="test" />
                <Input v-model="value" v-init="v-init-data" />
                <Input v-model="param" />
                <Input v-model="param.name" />
            </JSXForm>
            <span>表单输出结果：</span>
            <pre>
                <code>{JSON.stringify(this.state.outputData)}</code>
            </pre>
        </div>
    }
}