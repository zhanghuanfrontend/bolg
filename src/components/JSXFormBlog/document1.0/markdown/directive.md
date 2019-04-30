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

### 动态属性
> 在JSX-Form里，表单的中间变量在React是无法访问的，例如： 

```
<JSXForm>
    <div v-for="(item, index) in list">
        <Input disabled={item.name === 'ban'}>
    </div>
</JSXForm>
```
在上面的代码中，Input组件需要获取表单的中间变量传入到属性中，但是上面的代码会报错，显示**item is not defined**，因为React中是不能获取JSX-Form的中间变量。
动态属性，就是在表单组件的属性前添加**v-$**前缀，JSX-Form解析到前缀后，就会把指令表达式的值返回给属性。

~~~
@ path /example1.0/DynamicAttr.jsx
@ param title 动态属性
@ param desc 通过动态属性，可以获取到JSX-Form中的中间变量，传入到表单组件的属性。上面的表单，输入ban就会让表单组件禁止输入。

```
this.state = {
    formData: {
        list: [{
            name: ''
        }],
    }
}
<JSXForm 
    value={this.state.formData} 
    onChange={data => this.setState({formData: data})}>
    <div v-for="item in list">
        <Input v-$disabled="item.name === 'ban'" v-model="item.name" v-label="名称" />
    </div>
</JSXForm>
```
~~~


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