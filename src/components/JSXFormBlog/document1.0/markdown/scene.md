## 使用场景

### 已存在表单

> 在项目中，往往会对已存在表单进行修改和维护，如果想接入json-form和fc-form，你需要将之前存在的表单、已经新增的表单全部转换成抽象组件对应的格式，这种情况下，接入抽象组件将是一件很痛苦的事。json-form和fc-form都具有要么都接入、要么都不接入的极端选择。而在jsx-form里，你可以优雅的修改新增的部分表单。

```
<JSXForm 
    value={formData}>
    <div>
        ...   // 这里是已有部分表单
    </div>
    <Input v-model="param.name" />
</JSXForm>
```
> JSX-Form只对含有指令的表单进行解析处理，没有指令的表单将正常显示。

### 复杂逻辑

> 其实抽象表单组件的初衷往往只是想把项目中出现次数多、结构简单、代码重复的简单表单进行最大化的简化抽象，含有复杂逻辑的表单往往用得不多，但是抽象表单组件为了能实现这些逻辑，往往也会因此而实现很多语法、规则复杂的部分，使得在处理复杂逻辑时，抽象表单组件不仅没有得到简化，反而增加了学习、接入成本。也牺牲了代码的灵活性。<br />
因此JSX-Form处理复杂逻辑的方法是不进行处理，JSX-Form的目标是简化结构简单的表单，至于复杂的逻辑，使用React本身可能会更好。

```
<JSXForm 
    value={formData}>
    <div>
        ...  // 复杂的实现逻辑，用React本身实现更灵活
    </div>
</JSXForm>
```

### 与View层解耦

> JSX-Form只是提供了一些指令，这些指令将表单组件的功能逻辑进行抽象，并不要求挂载指令的组件本身。因此，你可以使用任意的表单组件。相比于json-form、fc-form，你可以不必将自定义组件封装成固定格式才能使用相应的功能。

在json-form里，使用antd组件库

```
import JsonForm from 'json_transform_form'
JsonForm.createCustomComp([
    {
        type: 'antd-input',
        render: () => {
            return <Input /> 
        }
    }
]);
```

### 可以自由嵌套

> JSX-Form组件本身也可以看成一个表单组件，因此可以自由嵌套，这样在需要细粒度拆分表单组件时，实现会很方便。

```
<JSXForm 
    value={formData}>
    <JSXForm v-model="param">
        <Input v-model="name" />
    </JSXForm>
</JSXForm>
```

因此，JSX-Form具有以下优势：

- 只是逻辑层抽象，剥离View层
- 可以部分接入JSX-Form
- 只是处理结构简单表单，复杂逻辑由更灵活的React实现
- 本身可以看成一个表单组件，可以自由嵌套
