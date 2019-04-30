import React from 'react'
import JSXForm from 'JSXForm/index.min.1.2.2.js'
import { Input, Select, Button, Icon, Radio } from 'antd';
import {osList, typeList} from './testData'
const Option = Select.Option
const RadioGroup = Radio.Group
const TextArea = Input.TextArea
import './index.less'

JSXForm.directive('v-d-options', (Element, value) => {
    const [list = [], ReactElement] = value
    return <Element>
        {
            list.map(item => {
                let label = item, value = item
                if(item instanceof Object){
                    label = item.label || ''
                    value = item.value || ''
                }
                return <ReactElement key={value} value={value}>{label}</ReactElement>
            })
        }
    </Element>
})

JSXForm.directive('v-d-total', (Element, value) => {
    const [model, label, ...validate] = value
    const props = {
        'v-model': model,
        'v-label': label,
        'v-validate': validate
    } 
    return <Element {...props} />
})

export default class CustomDirective extends React.Component {
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
        const {formData} = this.state
        return <div className="custom-directive-area">
            <JSXForm value={formData} onChange={data => this.setState({formData: data})}>
                <Input v-d-total={['param', 'param', 'required']} />
                <Select v-d-total={['os', '操作系统']} v-d-options={[osList, Option]}></Select>
                <RadioGroup v-d-total={['type', '类型']} v-d-options={[typeList, Radio]}>
                </RadioGroup>
                <TextArea v-d-total={['desc', '描述']} rows="3"></TextArea>
                <Button className="submit-btn" onClick={this.submitFormData} type="primary">提交</Button>
            </JSXForm>
        </div>
    }
}