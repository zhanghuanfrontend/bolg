## 统一上下文

> 在JSXForm1.x中，指令的解析在render过程中，是在React JSX解析之后，为了避免React将JSXFrom的变量进行解析，所以不得不设定JSXFrom中的所有变量为字符串类型，这边便形成了JSXForm、React两套不通用的上下文，不同上下文之间引用变量变得非常麻烦，不得不采用v-bind和v-$动态属性来实现变量互通。


JSXForm2.x中，由于是在webpack层解析指令，所以JSXFrom、React两套上下文可以互通。React可以直接使用JSXForm中的变量。

~~~
@ path /example2.0/Context.jsx
@ param title 统一上下文
@ param desc 在React使用了_self、v-for指令产生的item、index指令。

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
                    <TextArea v-model="item.desc" v-label="描述" rows="3"></TextArea>
                    <div className="add-btn" onClick={() => {
                        const paramList = _self.getValue('paramList') || []
                        paramList.push({desc: ''})
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

### JSXForm中的变量

1：_self变量

在JSXForm表单内，_self相当于一个全局变量，其包含以下属性和方法。

* data: 可读属性，当前表单的值
* setValue：修改表单数据
* getValue：获取表单数据
* validForm：主动校验表单
* initForm：重新初始化表单
* watch：监听表单的值

2：v-for指令产生的中间变量

```
<JSXForm>
    <div v-for="(item, index) in param.list">
        // 可以直接访问item、index变量
        console.log(item, index)
    </div>
</JSXForm>
```

## 自动组装数据

> 在JSXForm1.x中，JSXForm表单组件是一个完全受控组件，必须要传入value、onChange属性。

JSXForm2.x中，value不再是一个必传属性，当value不传入时，JSXForm会根据表单组件及v-model属性自动组装表单数据，value只是用来传入初始值，当然你也可以使用v-init单独对某个表单组件传入初始值。

~~~
@ path /example2.0/dataPacking/Base.jsx
@ param title 组装表单数据
@ param desc 可以使用v-init指令初始表单组件的值，当同时使用value和v-init时。v-init的初始值将覆盖value的。
```
export default class Base extends React.Component {
    constructor() {
        super()
        this.state = {
            outputData: {}
        }
    }
    render() {
        const initData = {
            name: 'name-init',
            type: 'type-init',
        }
        return <div className="data-packing-base">
            <JSXForm value={initData} 
                onChange={(valid, data) => this.setState({outputData: data})}>
                <Input v-model="name" v-label="name" />
                <Input v-model="type" v-init="date" v-label="type" />
                <div v-for="item in list">
                    <Input v-label="param" v-model="item.param" />
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

## 监听数据变化

> 表单组件往往是含有很复杂逻辑的，处理表单逻辑很大一部分是需要依赖监听数据变化的能力，在JSXForm1.x中，只提供一个watch属性，在整个表单组件层进行监听，其监听能力是有限的。

JSXForm2.x提供了多个维度的数据监听能力：

+ 同表单单个组件监听
+ 同表单整体监听
+ 跨表单单个组件监听
+ 跨表单整体监听

### 同表单监听

> 如果只需要监听某个表单组件的数据变化，只需要传入onChange属性即可，v-model只是将该组件的onChange包装了一层，组件本身的onChange函数仍然会被调用。或者使用_self.watch('key', callback)

```
<JSXForm>
    <Input v-model="name" onChange={() => {
        _self.watch("type", (prev, curValue) => {
            console.log(prev, curValue)
        })
    }} />
    <Input v-model="type" />
<JSXForm>
```

> 表单整体监听则传入watch属性。

```
<JSXForm watch={{
    'param': (prev, curVal) => {},
    'name': (prev, curVal) => {}
}}>
</JSXForm>
```

### 跨表单监听

```
// 获取到需要监听表单的JSXForm ref实例
// 单个表单组件监听
this.JSXFormRef.watch('key', callback)
// 多个表单组件监听
this.JSXFormRef.watch({
    'param': (prev, curVal) => {},
    'name': (prev, curVal) => {}
})
```