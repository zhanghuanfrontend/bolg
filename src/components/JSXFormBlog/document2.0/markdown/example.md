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
```
~~~

~~~
@ path /example2.0/Context.jsx
@ param title 增减表单
@ param desc 使用v-for指令实现增减表单，使用_self的getValue/setValue方法来获取/修改表单数据。
```
<JSXForm value={formData}>
    <div className="param-item" v-for="(item, index) in paramList" v-init={[
        {
            name: '',
            type: 'string',
            desc: ''
        }
    ]}>
        <div className="param-rows">
            <Select v-model="item.name" v-class="param-select" v-label="param">
                {
                    paramList.map(item => <Option value={item.name}>{item.name}</Option>)
                }
            </Select>
            <Select className="type-select" v-model="item.type">
                {
                    typeList.map(item => <Option value={item}>{item}</Option>)
                }
            </Select>
        </div>
        <TextArea v-model="item.desc" v-label="描述" rows="3"></TextArea>
        <div className="add-btn" onClick={() => {
            const paramList = _self.getValue('paramList')
            paramList.push({name: '', type: 'integer', desc: ''})
            _self.setValue('paramList', paramList)
        }} v-show={index === _self.getValue('paramList').length - 1}>+</div>
        <div className="delete-btn" v-show={_self.getValue('paramList').length > 1} onClick={() => {
            console.log(index)
            const paramList = _self.getValue('paramList')
            paramList.splice(index, 1)
            _self.setValue('paramList', paramList)
        }}>
            <Icon theme="filled" type="delete" />
        </div>
    </div>
</JSXForm>
```
~~~

### 指令统计

