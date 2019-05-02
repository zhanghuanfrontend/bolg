import React from 'react'
import { Button, Icon, Input, Select, Radio } from 'antd';
import JSXForm from 'react_jsx_form'
import '../index.less'

export default class Base extends React.Component {
    constructor() {
        super()
        this.state = {
            outputData: {}
        }
    }
    render() {
        return <div className="base-form-area">
            <JSXForm
                labelWidth={50}
                onChange={(valid, data) => this.setState({outputData: data})}>
                <Input 
                    v-model="name" 
                    v-label="name"
                    v-label-width={60}
                    v-class="test-name-input"
                    v-validate={['required']}
                />
                <Input v-model="type" v-init="date" v-label="type" />
            </JSXForm>
            <span>表单输出结果：</span>
            <pre>
                <code>{JSON.stringify(this.state.outputData)}</code>
            </pre>
        </div>
    }
}