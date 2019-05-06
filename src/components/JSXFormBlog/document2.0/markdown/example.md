## 示例

### 使用方法

安装JSXForm依赖：

```
npm install react_jsx_form --save
```

修改webpack配置：

```
const JSXFormLoader = require('react_jsx_form/dist/loader.js')
module: {
    rules: [
        {
            test: /\.(js|jsx)$/,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        ...
                    }
                },
                {
                    loader: JSXFormLoader,
                }
            ]
        }
    ]
}
```

> 一定要将JSXForm loader放在babel-loader的后面，这样JSXFrom loader先去解析指令，接着再交由babel-loader解析转换成ES5。

使用JSXForm：

```
import JSXForm from 'react_jsx_form'
<JSXForm>
    <Input v-model="name">
</JSXForm>
```

### 使用示例

~~~
@ path /example2.0/example/Base.jsx
@ param title 基本例子
@ param desc v-validate是用于校验的指令，v-class用于添加特定className。labelWidth整体设置label宽度，v-label-width则设置当前表单组件的label宽度。

```
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
```
~~~

~~~
@ path /example2.0/Context.jsx
@ param title 增减表单
@ param desc 使用v-for指令实现增减表单，使用_self的getValue/setValue方法来获取/修改表单数据。

```
export default class Base extends React.Component {
    constructor(){
        super()
        this.state = {
            outputData: {}
        }
    }
    render() {
        return <div>
            <JSXForm className="dynamic-form-area" onChange={(valid, data) => this.setState({outputData: data})}>
                <div className="param-item" v-for="(item, index) in paramList">
                    <div className="param-rows">
                        <Select v-model="item.name" v-class="param-select" v-label="param">
                            <Option v-for="paramItem in {paramList}" value={paramItem.name}>{paramItem.name}</Option>
                        </Select>
                        <Select className="type-select" v-model="item.type">
                            <Option v-for="typeItem in {typeList}" value={typeItem}>{typeItem}</Option>
                        </Select>
                    </div>
                    <TextArea v-model="item.desc" v-label="描述" rows="3"></TextArea>
                    <div className="add-btn" onClick={() => {
                        const paramList = _self.getValue('paramList') || []
                        paramList.push({name: '', type: 'integer', desc: ''})
                        _self.setValue('paramList', paramList)
                    }} v-show={index === _self.getValue('paramList').length - 1}>+</div>
                    <div className="delete-btn" v-show={_self.getValue('paramList').length > 1} onClick={() => {
                        const paramList = _self.getValue('paramList')
                        paramList.splice(index, 1)
                        _self.setValue('paramList', paramList)
                    }}>
                        <Icon theme="filled" type="delete" />
                    </div>
                </div>
            </JSXForm>
            <span>表单输出结果：</span>
            <pre>
                <code>{JSON.stringify(this.state.outputData)}</code>
            </pre>
        </div>
    }
}
```
~~~

~~~
@ path /example2.0/example/Packing.jsx
@ param title 输入输出处理
@ param desc 使用v-packing指令对输入框的输入和输出做格式处理。

```
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
```
~~~

~~~
@ path /example2.0/example/Linkage.jsx
@ param title 联动表单
@ param desc 使用v-packing指令对输入框的输入和输出做格式处理。

```
export default class Base extends React.Component {
    constructor() {
        super()
        this.state = {
            outputData: {}
        }
    }
    render() {
        const provinces = Object.keys(address)
        return <div>
            <JSXForm 
                className="base-form-area"
                onChange={(valid, data) => this.setState({outputData: data})}>
                <Select 
                    v-model="province" 
                    v-label="省份" 
                    onChange={value => {
                        const cities = address[value]
                        const citieList = Object.keys(cities)
                        const defaultCity = citieList[0]
                        const towns = cities[defaultCity] || []
                        _self.setValue({
                            '_assistData.cities': citieList,
                            '_assistData.towns': towns,
                            'city': defaultCity,
                            'town': towns[0],
                        })
                    }}>
                    <Option v-for="provItem in {provinces}" value={provItem}>{provItem}</Option>
                </Select>
                <Select 
                    v-model="city" 
                    v-label="城市" 
                    onChange={value => {
                        const cities = address[_self.getValue('city')] || {}
                        const towns = cities[value] || []
                        _self.setValue('_assistData.towns', towns)
                    }}>
                    <Option v-for="cityItem in _assistData.cities" v-init={['请先选择省份']} value={cityItem}>{cityItem}</Option>
                </Select>
                <Select v-model="town" v-label="城区/县">
                    <Option v-for="cityItem in _assistData.towns" v-init={['请先选择城区']} value={cityItem}>{cityItem}</Option>
                </Select>
            </JSXForm>
            <span>表单输出结果：</span>
            <pre>
                <code>{JSON.stringify(this.state.outputData)}</code>
            </pre>
        </div>
    }
}
```
~~~

### 指令统计

table [[
    {"title": "指令", "dataIndex": "dir"},
    {"title": "描述", "dataIndex": "desc"}
], [
    {"dir": "v-model", "desc": "绑定表单数据"}
]]

