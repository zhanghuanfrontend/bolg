## 统一上下文

> 在JSXForm1.x中，指令的解析在render过程中，是在React JSX解析之后，为了避免React将JSXFrom的变量进行解析，所以不得不设定JSXFrom中的所有变量为字符串类型，这边便形成了JSXForm、React两套不通用的上下文，不同上下文之间引用变量变得非常麻烦，不得不采用v-bind和v-$动态属性来实现变量互通。


JSXForm2.x中，由于是在webpack层解析指令，所以JSXFrom、React两套上下文可以互通。React可以直接使用JSXForm中的变量。

~~~
@ path /example2.0/Context.jsx
@ param title 统一上下文
@ param desc 在React使用了_self、v-for指令产生的item、index指令。
```
<JSXForm value={formData}>
    <div className="param-item" v-for="(item, index) in paramList" v-init={[
        {
            name: '',
            type: 'string',
            desc: ''
        }
    ]}>
        <div className="param-rows">
            <Select v-model="item.name" v-class="param-select" v-label="param">
                {
                    paramList.map(item => <Option value={item.name}>{item.name}</Option>)
                }
            </Select>
            <Select className="type-select" v-model="item.type">
                {
                    typeList.map(item => <Option value={item}>{item}</Option>)
                }
            </Select>
        </div>
        <TextArea v-model="item.desc" v-label="描述" rows="3"></TextArea>
        <div className="add-btn" onClick={() => {
            const paramList = _self.getValue('paramList')
            paramList.push({name: '', type: 'integer', desc: ''})
            _self.setValue('paramList', paramList)
        }} v-show={index === _self.getValue('paramList').length - 1}>+</div>
        <div className="delete-btn" v-show={_self.getValue('paramList').length > 1} onClick={() => {
            console.log(index)
            const paramList = _self.getValue('paramList')
            paramList.splice(index, 1)
            _self.setValue('paramList', paramList)
        }}>
            <Icon theme="filled" type="delete" />
        </div>
    </div>
</JSXForm>
```
~~~

### JSXForm中的变量

1：_self变量

在JSXForm表单内，_self相当于一个全局变量，其包含以下属性和方法。

* data: 可读属性，当前表单的值
* setValue：修改表单数据，setValue(key, value)，例如：setValue('param.name', 'test')
* getValue：获取表单数据，getValue([key])，传入key则获取key对应数据，不传则获取当前表单数据

2：v-for指令产生的中间变量

```
<JSXForm>
    <div v-for="(item, index) in param.list">
        // 可以直接访问item、index变量
    </div>
</JSXForm>
```

