import React from 'react'
import JSXForm from '../../../../JSXForm/index.min.1.2.2'
import { Input, Select, Button, Icon, Radio } from 'antd';
import {osList, typeList} from './testData'
const TextArea = Input.TextArea
const RadioGroup = Radio.Group
const Option = Select.Option
import './index.less'

export default class Base extends React.Component {
    constructor(){
        super()
        this.state = {
            formData: {
                os: 'web',
                param: '',
                desc: '',
                type: 'string'
            }
        }
    }
    render() {
        return <div className="base-form-area">
            <JSXForm 
                value={this.state.formData} 
                ref={this.jsxForm}
                onChange={data => this.setState({formData: data})}
            >
                <Input v-model="param" v-label="param" v-validate={['required', /^[a-zA-Z_]+$/g]} />
                <Select v-model="os" v-label="操作系统" v-validate={['required']}>
                    {
                        osList.map(item => <Option key={item} value={item}>{item}</Option>)
                    }
                </Select>
                <RadioGroup v-label="类型" v-model="type">
                    {
                        typeList.map(item => <Radio key={item} value={item}>{item}</Radio>)
                    }
                </RadioGroup>
                <TextArea v-label="描述" v-model="desc" rows="3"></TextArea>
                <Button className="submit-btn" onClick={this.submitFormData} type="primary">提交</Button>
            </JSXForm>
        </div>
    }
}