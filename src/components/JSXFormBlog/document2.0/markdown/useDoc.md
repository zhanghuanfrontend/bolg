## 使用说明
1：安装JSXForm依赖：

```
npm install react_jsx_form --save
```

2：引入解析指令的loader

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

> 一定要将JSXForm loader放在babel-loader的后面，这样JSXFrom-loader先去解析JSXForm指令，再由babel-loader将代码转换成ES5。

使用JSXForm：

```
import JSXForm from 'react_jsx_form'
<JSXForm>
    <JSXForm>
        <Input v-model="param"/>
        <Select v-model="os">
            <Option v-for="osItem in {osList}" key={osItem} value={osItem}>{osItem}</Option>
        </Select>
        <TextArea v-label="描述" v-model="desc" rows="3"></TextArea>
    </JSXForm>
</JSXForm>
```

## JSXForm模型

![性能优化](/static/images/img.png)

JSXForm表单可以分为表单初始化、表单更新、获取表单数据三大部分：

### 表单初始化
- JSXForm表单在启动后，首先从value中读取初始值并赋值给表单内部Data。
- 接着每个表单组件初始化，根据v-model从表单Data中读取对应的初始值，如果初始值不存在，则自动创建为undefined。
- 如果表单组件的v-init属性不为空，则将表单Data对应key赋值为v-init初始值。

~~~
@ path /example2.0/example/InitData.jsx
@ param title 表单数据初始化
@ param desc v-init会覆盖value初始值，表单数据自动拼装在v-model重合时，采用最后一次执行的结果。

```
export default class Base extends React.Component {
    constructor() {
        super()
        this.state = {
            outputData: {},
        }
    }
    render() {
        const initValue = {
            test: 'init-value',
            value: 'init-data'
        }
        return <div>
            <JSXForm 
                value={initValue}
                className="base-form-area"
                onChange={(valid, data) => {
                    console.log(data)
                    this.setState({outputData: data})
                }}>
                <Input v-model="test" />
                <Input v-model="value" v-init="v-init-data" />
                <Input v-model="param" />
                <Input v-model="param.name" />
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

### 表单更新

> 为了优化表单性能，JSXForm表单数据的更新是采用局部更新方式，即便是JSXForm表单最外层state更新，也只会让对应数据发生改变的表单组件局部更新，这样避免了大表单带来的性能问题。

> 局部更新是因为JSXForm内部采用发布订阅模式，每个含有v-model指令的表单组件，都会在外层包裹FormItem组件，在FormItem组件初始化时，会将更新函数注册到JSXForm中，修改某个表单组件数据时，会触发JSXForm中的更新函数，更新函数会找到对应FormItem的更新函数执行局部更新。

```
// 修改一个key
_self.setValue(key, value)
// 批量修改
_self.setValue({
    key1: value1,
    key2: value2
})
```
> 在setValue批量修改和表单组件频繁变化时，同样会频繁调用JSXForm的更新函数，但是过于频繁的更新没有意义，而且还会带来性能上的问题，因此，JSXForm表单数据的更新采用延迟统一更新策略。在一定时间范围内，将所有的修改合并后，统一进行更新。因此，多次同步调用setValue，实际上只会执行一次更新。

~~~
@ path /example2.0/performance/UpdateTest.jsx
@ param title 局部更新
@ param desc 只会数据发生变化的表单组件上进行更新。

```
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
```
~~~

### 获取表单数据

> 获取通过getValue、onChange、watch三种方式获取表单数据。
