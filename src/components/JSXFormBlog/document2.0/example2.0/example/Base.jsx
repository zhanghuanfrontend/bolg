import React from 'react'
import { Button, Icon, Input, Select, Radio } from 'antd';
import {osList, typeList} from '../testData'
import JSXForm from 'react_jsx_form'
import '../index.less'

const TextArea = Input.TextArea
const RadioGroup = Radio.Group
const Option = Select.Option

export default class Base extends React.Component {
    constructor() {
        super()
        this.state = {
            outputData: {}
        }
    }
    render() {
        return <div>
            <JSXForm 
                className="base-form-area"
                onChange={(valid, data) => this.setState({outputData: data})}>
                <Input v-model="param" v-label="param" v-validate={['required', /^[a-zA-Z_]+$/g]} />
                <Select v-model="os" v-label="操作系统" v-validate={['required']}>
                    <Option v-for="osItem in {osList}" key={osItem} value={osItem}>{osItem}</Option>
                </Select>
                <RadioGroup v-label="类型" v-model="type">
                    <Radio v-for="typeItem in {typeList}" key={typeItem} value={typeItem}>{typeItem}</Radio>
                </RadioGroup>
                <TextArea v-label="描述" v-model="desc" rows="3"></TextArea>
            </JSXForm>
            <span>表单输出结果：</span>
            <pre>
                <code>{JSON.stringify(this.state.outputData)}</code>
            </pre>
        </div>
    }
}