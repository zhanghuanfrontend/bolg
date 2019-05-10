## 示例

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
@ param desc 表单内控制逻辑的数据，最好放在\_assistData属性下，在获取表单数据时，JSXForm会自动剔除\_assistData数据。

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
    {"dir": "v-model", "desc": "绑定表单数据"},
    {"dir": "v-html", "desc": "展示表单数据内容，有局部刷新功能"},
    {"dir": "v-label", "desc": "添加表单组件label"},
    {"dir": "v-label-width", "desc": "设置当前组件label的宽度，可以在JSXForm上设置labelWidth属性统一设置"},
    {"dir": "v-class", "desc": "添加自定义className"},
    {"dir": "v-validate", "desc": "添加表单验证，使用方法"},
    {"dir": "v-total", "desc": "v-model、v-label、v-validate的省略写法"},
    {"dir": "v-for", "desc": "重复指令，能重复当前组件"},
    {"dir": "v-init", "desc": "当前组件初始值，可以在JSXForm设置value属性统一设置初始值"},
    {"dir": "v-packing", "desc": "对表单组件的输入输出值进行封装"}
]]

### JSXForm属性

table [[
    {"title": "属性", "dataIndex": "dir"},
    {"title": "描述", "dataIndex": "desc"}
], [
    {"dir": "watch", "desc": "统一设置表单数据监听"},
    {"dir": "value", "desc": "统一设置表单初始值，比v-init优先级低"},
    {"dir": "labelWidth", "desc": "统一设置表单label宽度，比v-label-width优先级低"},
    {"dir": "localUpdate", "desc": "是否开启局部刷新，默认为true，如果设置为false，表单数据每次更新，整个JSXForm都会刷新。"},
    {"dir": "className", "desc": "给JSXForm添加class"},
    {"dir": "onChange", "desc": "JSXForm表单数据改变时会触发该事件"}
]]

### JSXForm方法

table [[
    {"title": "方法", "dataIndex": "dir"},
    {"title": "描述", "dataIndex": "desc"},
    {"title": "类型", "dataIndex": "type"}
], [
    {"dir": "validForm", "desc": "主动校验表单，传入key，校验key对应表单组件，不传入key，则校验当前表单。", "type": "Function (key?: string)"},
    {"dir": "initForm", "desc": "重新初始化表单", "type": "Function ()"},
    {"dir": "getValue", "desc": "获取JSXForm的值，传入key，获取key对应表单组件，不传入key，则获取当前表单数据，如果存在校验error，返回是false", "type": "Function(key?: string)"},
    {"dir": "setValue", "desc": "修改JSXForm的值", "type": "Function (key: string, value: any, callback?: function)"},
    {"dir": "watch", "desc": "添加监听", "type": "Function (key: string, callback: function)"}
]]

> JSXForm的方法既可以通过JSXForm的ref实例来调用，也可以在JSXForm内部，通过_self变量进行调用。

### 表单校验（v-validate）

> v-validate传入格式为Array，每项为一个校验规则。<br />
每项校验规则可以是以下格式：<br />
- String 例如：required、number、boolean、integer、float <br />
- RegExp <br />
- Function <br />

```
<JSXForm>
    <Input v-model="param" v-validate={['required', /^[a-zA-Z_]+$/g]} />
</JSXForm>
```

### v-for

> v-for可以遍历渲染组件

```
// 遍历渲染Option
<Option v-for="(item, index) in paramList" value={item.value}>{item.label}</Option>
<Option v-for="item in paramList" value={item.value}>{item.label}</Option>
// paramList不是变量，它是表单Data的key
// 如果你只是想渲染一个变量，而不是表单内部的数据
// 例如：formWrapList是表单外部的变量
<<Option v-for="item in {formWrapList}">{item.label}</Option>>
```

### v-total

> v-total是v-model、v-label、v-validate省略写法。格式为数组，第一个元素为v-model，第二个为v-label，第三个往后都是v-validate。

```
<JSXForm>
    <Input v-total={['param', '参数', /^\d+$/g, 'required']} />
</JSXForm>
// 上面等价于
<Input v-model='param' v-label='参数' v-validate={[/^\d+$/g, 'required']} />
```

### v-html
> v-html是为了展示表单数据，该展示内容可以根据表单数据的变化而局部刷新。

```
<JSXForm>
    <Input v-total={['param', '参数']} />
    <span v-html="param" v-packing={
        input: (curValue) => {
            return <div>参数值为：{curValue}</div>
        }
    }></span>
</JSXForm>
```

> v-packing只是为了包装v-html绑定的数据，如果不传入v-packing，则直接显示v-html对应表单的值。

### 组件初始值（v-init）

> v-init为当前组件设置初始值，也可以在JSXForm上传入value属性统一设置，v-int会覆盖value属性的初始值。

```
<JSXForm value={{
    param: 'test'
}}>
    <Input v-model="param" v-init="init-value" />
</JSXForm>
```

### _assistData

> 表单里，经常会存储额外的变量，但是这些变量你不想把它们上传到服务器，例如参与控制逻辑的变量，你可以将它们设置为表单Data的_assistData属性下面，表单在提交数据时，会自动剔除_assistData里面的变量。

```
<JSXForm>
    <Input v-model="param" v-show={_self.getValue('_assistData.show')} />
    <Button onClick={() => {
        _self.setValue('_assistData.show', true)
    }}>显示</Button>
    <Button onClick={() => {
        _self.setValue('_assistData.show', false)
    }}>隐藏</Button>
</JSXForm>
```
> 例如上面的代码里，控制表单组件显示与隐藏的变量show，就应该放在_assistData属性里，这样，表单数据在提交时，会自动剔除该变量。


### setValue

> setValue可以修改表单的值

```
// 修改一个表单组件的值
_self.setValue('param.name', 'test')
// 批量修改
_self.setValue({
    'pararm.name': 'test',
    'type': {}
})
```
> 由于表单的更新采用延迟统一更新，所以以下使用方式均会出现问题。

```
_self.setValue('count', _self.getValue('count') + 1)
_self.setValue('count', _self.getValue('count') + 1)
_self.setValue('count', _self.getValue('count') + 1)
// 上面三次调用setValue，实际只会执行一次
_self.setValue('name', 'init-value')
console.log(_self.getValue('name'))
// 由于延迟更新，getValue不能获取到最新更新的值
// 可以采用回调函数方式使用
_self.setValue('name', 'init-value' , (data) => {
    // 回调函数的参数为最新表单Data
    console.log(data.name)
})
```

### watch

> watch用来监听表单数据的变化

```
// 监听某一个表单组件
_self.watch('param.name', (prev, curVal) => {
})
// 批量监听
_self.watch({
    'param.name': (prev, curVal) => {},
    'param.type': (prev, curVal) => {},
    ...
})
```
> JSXForm的这些方法，既可以通过JSXForm的ref实例来调用，也可以通过_self变量进行调用，通过_self调用是对当前表单进行操作，通过JSXForm ref实例调用，可以跨表单操作。