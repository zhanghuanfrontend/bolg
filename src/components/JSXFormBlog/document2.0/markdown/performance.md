
## 性能优化

> 在JSXFrom1.x中，指令的解析在表单组件的render过程中，表单每render一次，就会执行递归的解析逻辑，会给页面带来一些性能问题，除此之外，表单组件的更新也依赖于JSXForm的render过程，在表单内容比较多的时候，render一次的代价也变得较高。

JSXForm2.x的主要目标就是优化JSXFrom带来的性能问题，从以下三个方向入手：

- 指令的解析放在webpack层
- 表单组件局部更新
- 表单Data延迟统一更新

### 指令解析

> 在JSXForm2.x中，指令的解析过程放在了webpack层，下面测试性能的例子测试了将指令解析过程放到webpack层，减少指令解析过程所带来的性能优化。

~~~
@ path /example2.0/performance/index.jsx
@ param title 解析优化
@ param desc 上面折线图，横轴表示渲染的表单组件的个数，纵轴表单表单render一次的时间(DidUpdate-WillUpdate，单位ms)。
~~~

> 实现原理是：自动添加表单中表单组件的个数，每添加一次表单组件数量，就修改最后一个表单组件的值，让表单render一次，统计componentWillUpdate到componentDidUpdate的时间差。<br />
JSXForm2.x平均节省百分比计算公示为：(x2 - x1) / x1，然后再取所有数据的平均值<br />
x2：JSXForm2.x一次render过程中的时间<br />
x1：JSXForm1.x一次render过程中的时间

### 局部更新

> JSXForm1.x中，表单的更新依赖表单的render，只有表单外层组件的state更新后，表单组件的内容才会进行更新，当表单组件过多时，会导致render性能消耗很大。<br />
而在JSXForm2.x中，v-model(v-html)指令会将表单组件包裹在FormItem(FormText)组件中，当表单数据更新时，只会更新数据变化对应的FormItem(FormText)组件。

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

> 局部更新让表单数据更新的范围变得很小，因而带来的性能消耗也要小很多。

### 延迟统一更新

> 在setValue批量修改和表单组件频繁变化时，同样会频繁调用JSXForm的更新函数，但是过于频繁的更新没有意义，而且还会带来性能上的问题，因此，JSXForm表单数据的更新采用延迟统一更新策略。在一定时间范围内，将所有的修改合并后，统一进行更新。因此，多次同步调用setValue，实际上只会执行一次更新。