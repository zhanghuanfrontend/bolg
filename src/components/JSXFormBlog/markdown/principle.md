## 实现原理
> JSX-Form在内部将接受到的children进行递归遍历，找出所有v-开头的指令，并进行指令处理。

### v-model指令

> JSX-Form找到含有v-model指令的ReactElement，解析出v-model对应表单数据的值，并将值赋值给ReactElement的props里面的value属性，并且修改ReactElement的onChange方法。

```
const model = element.props['v-model']
// 如果v-model存在
if(model){
    const prev = element.props.value
    const curr = getKeyValue(options.formData, model)
    if(prev !== curr){
        element.props = {
            ...element.props,
            value: getOptionPacking(curr, 'value', element)
        }
        let parent = element.__parent__
        while(parent){
            parent.props = {...parent.props}
            parent = parent.__parent__
        }
    }
    const onChangeFn = element.props.onChange
    if(!onChangeFn || onChangeFn.type !== 'JSX_CHANGE_FN'){
        element.props.onChange = getChangeFn(options.setState, model, element)
    }
}
```