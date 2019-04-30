
## 升级内容

### 指令解析

~~~
@ path /example2.0/Performance.jsx
@ param title 解析优化
@ param desc 在JSXForm1.x中，指令的解析过程在表单组件的render方法中，每次render都会递归解析一次，对性能影响较大，在JSXFrom2.x中，解析过程放在了webpack层，这样只会在webpack打包时对指令进行解析。
~~~

> 在JSXForm2.x中，指令的解析过程放在了webpack层，避免每次render时调用解析过程。

### 更新范围

> JSXForm1.x中，表单的更新依赖接入组件的render，只有接入组件的state更新后，表单组件的内容才会进行更新，当表单组件过多时，会导致render性能消耗很大。<br />
而在JSXForm2.x中，v-model指令会将表单组件包裹在FormItem组件中，当表单数据更新时，只会更新数据变化对应的FormItem组件。

~~~
@ path /example2.0/UpdateTest.jsx
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
                <FormItem v-model="name" v-label="name" label="name"/>
                <Input v-model="os" v-label="os1" />
                <FormItem v-model="os" v-label="name" label="os2" />
                <Button type="primary" onClick={this.modifyForm}>修改name</Button>
                <Button type="primary" onClick={() => {
                    _self.setValue('os', Math.floor(Math.random() * 100))
                }}>修改os</Button>
            </JSXForm>
        </div>
    }
}
```
~~~