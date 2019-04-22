## 前言
### vue.js中的表单
```
<Form :model="formData">
    <Form-item label="输入框">
        <Input v-model="formData.input" />
    </Form-item>
</Form>
```
> v-model是vue.js中进行数据双向绑定的指令，它将Model层和View进行绑定。虽然在项目规模比较庞大的情况下，v-mode指令容易带来混乱的数据流动方式，但是在表单里，v-model还是比React来得简洁清晰得多。
### React中的表单

```
this.state = {
    formData: {
        param: {
            name: ""
        }
    }
}
<Input 
    placeholder="Basic usage" 
    value={formData.param.name}
    onChange={event => this.setState({
        formData: {
            ...this.state.formData,
            param: {
                ...this.state.formData.param,
                name: event.target.value
            }
        }
    })}
/>
```
对比可以发现，React表单的修改数据比Vue的v-model要麻烦很多，所以，如果我们在React表单中实现vue的指令，岂不是可以简化表单。
