## 自动组装数据

> 在JSXForm1.x中，JSXForm表单组件是一个完全受控组件，必须要传入value、onChange属性。

JSXForm2.x中，value不再是一个必传属性，当value不传入时，JSXForm会根据表单组件及v-model属性自动组装表单数据，value只是用来传入初始值，当然你也可以使用v-init单独对某个表单组件传入初始值。

~~~
@ path /example2.0/dataPacking/Base.jsx
@ param title 组装表单数据
@ param desc 可以使用v-init指令初始表单组件的值
```
export default class Base extends React.Component {
    constructor() {
        super()
        this.state = {
            outputData: {}
        }
    }
    render() {
        return <div className="data-packing-base">
            <JSXForm onChange={(valid, data) => this.setState({outputData: data})}>
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

当同时使用value和v-init时。v-init的初始值将覆盖value的。

~~~
@ path /example2.0/dataPacking/InitData.jsx
@ param title 组装表单数据
@ param desc 同时使用value和v-init时。v-init的初始值将覆盖value的
```
export default class Base extends React.Component {
    constructor() {
        super()
        this.state = {
            outputData: {}
        }
    }
    render() {
        return <div className="data-packing-base">
            <JSXForm onChange={(valid, data) => this.setState({outputData: data})}>
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