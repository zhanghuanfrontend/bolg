## 什么是JSXForm

### 背景

表单问题，不管是在 jQuery 时代，还是 Angular/React 时代，都永远是前端工程师们的痛，但是这又是没办法的事情，业务需求多种多样，对于中后台业务而言，表单页面和报表页面基本上是中后台业务的核心展现形式，但是，React的表单复杂而又难以维护。

下面我们尝试实现下面的表单：

![简单表单](/static/images/form.png)

### React原始代码实现。
```
export default class Example extends React.Component {
    constructor(){
        super()
        this.state = {
            formData: {
                name: '',
                type: ''
            }
        }
    }
    render() {
        const { formData } = this.state
        return <div className="base-form-area">
            <div className="form-item">
                <span>名称：</span>
                <Input value={formData.name} onChange={event => {
                    this.setState({
                        formData: {
                            ...formData, 
                            name: event.target.value
                        }
                    })
                }} />
            </div>
            <div className="form-item">
                <span>类型：</span>
                <Input value={formData.type} onChange={event => {
                    this.setState({
                        formData: {
                            ...formData, 
                            type: event.target.value
                        }
                    })
                }} />
            </div>
        </div>
    }
}
```

> 看着这样的代码，是否有种人生很难的苦痛，这还只是功能最简单的表单，没有校验功能，也不存在任何控制、联动逻辑，其代码量已经非常大了。<br />
除此之外，React原始代码实现的表单，数据和逻辑没有内敛，表单状态和数据散落在组件各个地方，导致表单复用和维护都比较困难。

### Antd Form实现

```
@Form.create()
export default class Editor extends React.Component {
    render() {
        const { getFieldDecorator } = this.props.form;
        return <div className="base-form-area">
            <Form>
                <Form.Item label="名称">
                    {
                        getFieldDecorator('name', {
                            rules: [{required: true, message: '请输入名称'}],
                        })(
                            <Input />
                        )
                    }
                </Form.Item>
                <Form.Item label="类型">
                    {
                        getFieldDecorator('type', {
                            rules: [{required: true, message: '请输入类型'}],
                        })(
                            <Input />
                        )
                    }
                </Form.Item>
            </Form>
        </div>
    }
}
```

> Antd Form语法复杂、代码量也比较大，且Antd Form还存在性能问题，当表单组件比较多的时间，页面会卡顿。

## JSXForm是什么

> JSXForm借鉴vuejs的指令语法，在React中将表单的逻辑抽象成指令，通过指令来实现表单的功能。

JSXForm有以下优点：

- 语法简单，书写代码量小
- 局部刷新、延迟统一更新，性能比React原始表单要好
- 自动拼装数据，无需传入表单Data
- 状态和数据内聚，便于复用和维护
- 只抽象表单逻辑，与View层解耦
- 可以兼容React原始表单和Antd Form

我们用JSXForm的语法实现上面的简单表单：

```
export default class Editor extends React.Component {
    render() {
        return <div className="base-form-area">
            <JSXForm labelWidth={50}>
                <Input v-model="name" v-label="名称" />
                <Input v-total={['type', '类型', 'required']}/>
            </JSXForm>
        </div>
    }
}
```