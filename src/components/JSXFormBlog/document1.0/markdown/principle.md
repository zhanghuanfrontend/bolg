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

### 指令表达式

> 在指令里，可以传入简单的字符串表达式，表达式里可以包含JSX-Form的一些中间变量。

JSX-Form在解析指令时，首先会找出指令中存在的变量，例如指令**v-show="item.name === 'test'"**。

>如果item变量是**v-for="item in list"**的中间变量，则**v-show**指令会被替换成**list.1.name === 'test'** <br/>
这样指令表达式里，就只存在formData的key列表。<br />
接着借用**new Function来执行该字符串**

```
// 执行指令字符串
export const execDirective = (directiveStr, formData) => {
    if(!directiveStr || !formData){
        return false
    }
    // 将变量名和值提取出来
    const keys = Object.keys(formData)
    const hasKeyList = []
    const keyVariable = []
    keys.forEach(key => {
        // 匹配出该变量的RegExp
        const reg = new RegExp(`(^|(?<=\\s))${key}(\\b|$)`)
        if(reg.test(directiveStr)){
            hasKeyList.push(key)
            keyVariable.push(formData[key])
        }
    })
    // 将param.1.name  替换成 param[1].name
    // 替换掉数字键值
    const numberKey = /\.(\d+)/g
    const execDir = directiveStr.replace(numberKey, '[$1]')
    const execFn = new Function(...hasKeyList, `return ${execDir}`)
    let results = false
    try {
        results = execFn(...keyVariable)
    }catch(err) {
        console.log(err)
    }
    return results
}
```