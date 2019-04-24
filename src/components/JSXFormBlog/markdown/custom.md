## 自定义指令

> 自定义指令必须以v-d-开头，自定义指令主要是用于抽象具体业务场景中的一些重复简单的逻辑。例如下面两个自定义指令：

### v-d-options

> 在Select表单组件中，需要重复编写Options，显得不是那么方便，为此我们抽象出v-d-options指令。

```
import JSXForm from 'react_jsx_form'
JSXForm.directive('v-d-options', (Element, value) => {
    const [list = [], ReactElement] = value
    return <Element>
        {
            list.map(item => {
                let label = item, value = item
                if(item instanceof Object){
                    label = item.label || ''
                    value = item.value || ''
                }
                return <ReactElement key={value} value={value}>{label}</ReactElement>
            })
        }
    </Element>
})
```

使用v-d-options指令。

```
const osList = ['iOS', 'Android', '服务端', 'Wap端', 'Web', 'Mac'] 
<Select v-model="os" 
    v-label="操作系统" 
    v-validate={['required']} 
    v-d-options={[osList, Option]}>
</Select>
```

### v-d-total
> 在表单中，经常会使用到v-model、v-label、v-validate指令，重复输入这些指令也显得不是那么方便，为此我们可以抽象出v-d-total指令。

```
import JSXForm from 'react_jsx_form'
JSXForm.directive('v-d-total', (Element, value) => {
    const [model, label, ...validate] = value
    const props = {
        'v-model': model,
        'v-label': label,
        'v-validate': validate
    } 
    return <Element {...props} />
})
```

使用v-d-total指令

```
const osList = ['iOS', 'Android', '服务端', 'Wap端', 'Web', 'Mac'] 
<Select v-d-total={['os', '操作系统', 'required']} v-d-options={osList}></Select>
```

### 重写实例

有了上面的两个指令后，我们再重复实现开头的栗子。

~~~
@ path /example/CustomDir.jsx
@ param title 自定义指令
@ param desc 使用v-d-options、v-d-total指令来实现一个简单表单。

```
<JSXForm value={formData} onChange={data => this.setState({formData: data})}>
    <Input v-d-total={['param', 'param', 'required']} />
    <Select v-d-total={['os', '操作系统']} v-d-options={[osList, Option]}></Select>
    <RadioGroup v-d-total={['type', '类型']} v-d-options={[typeList, Radio]}>
    </RadioGroup>
    <TextArea v-d-total={['desc', '描述']} rows="3"></TextArea>
    <Button className="submit-btn" type="primary">提交</Button>
</JSXForm>
```
~~~

