## 指令
> JSX-Form中的指令是将表单组件的功能逻辑进行抽象，它与具体的展现(View)无关，因此JSX-Form中的指令对于任意组件均能使用。

### v-model
> v-model是用来绑定表单组件与表单数据的指令，当表单组件有value、onChange属性时，即可使用

```
this.state = {
    formData: {
        param: {
            name: ''
        }
    }
}
<JSXForm value={this.state.formData}>
    <Input v-model="param.name" />
</JSXForm>
```

### v-for
> v-for主要用于实现增减表单组件 <br />
v-click、v-show指令里可以传入表达式字符串，但只限于简单表达式，跟vue.js中的指令一样。

```
this.state = {
    formData: {
        paramList: [
            {
                name: ''
            }
        ]
    }
}
<JSXForm value={this.state.formData}>
    <div v-for="(item, index) in paramList">
        <Input v-model="name" />
        <Button className="add-btn" v-click="paramList.push({name: ''})">添加Param</Button>
        <Button className="delete-btn" v-show="paramList.length > 0">删除Param</Button>
    </div>
</JSXForm>
```

### v-packing
> v-packing主要是对表单组件的输入和输出做包装处理，一般用于具有复杂输出的表单组件。

```
this.state = {
    formData: {
        nameList: []
    }
}
const vpacking = {
    value: (curValue) => curValue.join(','),
    result: (curValue) => curValue.split(',')
}
<JSXForm value={formData}>
    <TextArea 
        v-label="名字列表" 
        v-model="nameList"  
        v-packing={vpacking}
        rows="5"></TextArea>
</JSXForm>
```

### watch
> watch 主要负责处理复杂的表单逻辑，例如联动逻辑。

```
this.state = {
    formData: {
        param: {
            name: ''
        }
    }
}
const watch = {
    'param.name': (prev, curr) => {
        // prev 修改前值. curr： 当前值
        // 可以用来处理复杂的联动逻辑
    }
}
<JSXForm 
    value={formData}
    watch={watch}
    onChange={data => this.setState({formData: data})}>
</JSXForm>
```

### v-validate
> v-validate主要是用于表单组件的校验 <br />
每项校验规则可以是以下格式：<br />
- String   例如：required、number、boolean、integer、float
- RegExp 
- Function

```
<Input v-model="param" v-validate={['required', /^[a-zA-Z_]+$/g]} />
```