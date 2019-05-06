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
            formData: {
                styles: {
                    border: 'solid 1px #ddd',
                    fontSize: '14px',
                    padding: '8px 15px'
                }
            }
        }
    }
    render() {
        const { formData } = this.state
        return <div>
            <JSXForm 
                value={formData}
                className="base-form-area"
                onChange={(valid, data) => this.setState({formData: data})}>
                <TextArea 
                    v-label="基本样式" 
                    v-model="styles" 
                    rows="5"
                    v-packing={{
                        input: (curValue) => {
                            const keys = Object.keys(curValue)
                            let displayStr = ''
                            keys.forEach((key, idx) => {
                                const valueStr = typeof curValue[key] !== 'undefined' ? `="${curValue[key]}"` : ''
                                if(key){
                                    displayStr += `${key}${valueStr}${idx === keys.length - 1 ? '' : '\n'}`
                                }
                            })
                            return displayStr
                        },
                        output: (curValue) => {
                            const params = curValue.split('\n')
                            const styles = {}
                            params.forEach(item => {
                                let key = item
                                let value = undefined
                                if(item.includes('=')){
                                    key = item.split('=')[0]
                                    value = item.split('=')[1].replace(/"/g, '')
                                }
                                styles[key] = value
                            })
                            return styles
                        }
                    }}></TextArea>
            </JSXForm>
            <div style={formData.styles}>这是样式输入框测试数据</div>
        </div>
    }
}