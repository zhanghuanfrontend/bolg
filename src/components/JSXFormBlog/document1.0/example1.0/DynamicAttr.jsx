import React from 'react'
import JSXForm from 'JSXForm/index.min.1.2.2.js'
import { Input } from 'antd';
import './index.less'

export default class DynamicAttr extends React.Component {
    constructor(){
        super()
        this.state = {
            formData: {
                list: [
                    {
                        name: ''
                    }
                ]
            }
        }
    }
    render() {
        return <div className="dynamic-attr-area">
            <JSXForm 
                value={this.state.formData} 
                onChange={data => this.setState({formData: data})}
            >
                <div v-for="item in list">
                    <Input v-$disabled="item.name === 'ban'" v-model="item.name" v-label="名称" />
                </div>
            </JSXForm>
        </div>
    }
}