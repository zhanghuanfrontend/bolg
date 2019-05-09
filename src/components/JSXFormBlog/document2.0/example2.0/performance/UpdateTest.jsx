import React from 'react'
import JSXForm from 'react_jsx_form'
import { Input, Button } from 'antd'
import FormItem from './FormItem'
import '../index.less'

export default class UpdateTest extends React.Component {
    constructor(){
        super()
        this.state = {
            formData: {
                name: '',
                os: ''
            }
        }
    }
    modifyForm = () => {
        const { formData } = this.state
        this.setState({formData: {...formData, name: Math.floor(Math.random() * 100)}})
    }
    render() {
        const { formData } = this.state
        return <div className="update-test-area">
            <JSXForm value={formData}>
                <FormItem v-model="name" v-label="名称" label="名称"/>
                <Input v-model="os" v-label="系统" />
                <FormItem v-model="os" v-label="系统1" label="系统1" />
                <Button type="primary" className="modify-btn" onClick={this.modifyForm}>修改name</Button>
                <Button type="primary" className="modify-btn" onClick={() => {
                    _self.setValue('os', Math.floor(Math.random() * 100))
                }}>修改os</Button>
            </JSXForm>
        </div>
    }
}