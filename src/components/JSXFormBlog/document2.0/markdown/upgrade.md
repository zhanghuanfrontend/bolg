
## 升级内容

JSXForm2.0主要提供以下内容：

+ 性能优化
+ 在线解析
+ 统一上下文
+ 自动组装数据
+ 监听数据变化

### 性能优化

> 在JSXFrom1.x中，指令的解析在表单组件的render过程中，表单每render一次，就会执行递归的解析逻辑，会给页面带来一些性能问题，除此之外，表单组件的更新也依赖于JSXForm的render过程，在表单内容比较多的时候，render一次的代价也变得较高。

JSXForm2.x的主要目标就是优化JSXFrom带来的性能问题，从以下两个方向入手：

+ 指令的解析放在webpack层
+ 表单组件局部更新

从目前来看，JSXForm2.x的性能比1.x提升60% ~ 70%：

![性能优化](/static/images/permance.png)

具体内容请挪步：[性能优化](/?page=performance)

### 在线解析指令

> 除了可以在webpack loader中解析指令，JSXForm2.x也提供了浏览器端的解析。使用方式如下：

```
import JSXFormLoader from 'react_jsx_form/dist/browser.min.js'
// code为要解析的代码
// parse方法输出的是React.createElement的字符串
const parseCode = JSXFormLoader.parse(code)
if(parseCode){
    // dependence为要解析代码中的依赖
    // parseReact方法将React.createElement字符串进行执行，返回Virtual DOM
    const ReactEle = JSXFormLoader.parseReact(parseCode, dependence)
}
```
> 在浏览器中解析指令不仅存在性能问题，使用起来也更麻烦，所以推荐使用webpack loader进行解析。

如果你想了解指令解析结果，请挪步：[在线编辑](/?page=editing)

### 统一上下文

> 在JSXForm1.x中，指令的解析在render过程中，是在React JSX解析之后，为了避免React将JSXFrom的变量进行解析，所以不得不设定JSXFrom中的所有变量为字符串类型，这边便形成了JSXForm、React两套不通用的上下文。

JSXForm2.x中，由于是在webpack层解析指令，所以JSXFrom、React两套上下文可以互通。React可以直接使用JSXForm中的变量。

具体内容请挪步：[统一上下文](/?page=context)

### 自动组装数据

> 在JSXForm1.x中，JSXForm表单组件是一个完全受控组件，必须要传入value、onChange属性。

JSXForm2.x中，value不再是一个必传属性，当value不传入时，JSXForm会根据表单组件及v-model属性自动组装表单数据，value只是用来传入初始值，当然你也可以使用v-init单独对某个表单组件传入初始值。

~~~
@ path /example2.0/dataPacking/Base.jsx
@ param title 组装表单数据
@ param desc 可以使用v-init指令初始表单组件的值
```
export default class Base extends React.Component {
    constructor() {
        super()
        this.state = {
            outputData: {}
        }
    }
    render() {
        return <div className="data-packing-base">
            <JSXForm onChange={(valid, data) => this.setState({outputData: data})}>
                <Input v-model="name" v-label="name" />
                <Input v-model="type" v-init="date" v-label="type" />
                <div v-for="item in list">
                    <Input v-label="param" v-model="item.param" />
                </div>
            </JSXForm>
            <span>表单输出结果：</span>
            <pre>
                <code>{JSON.stringify(this.state.outputData)}</code>
            </pre>
        </div>
    }
}
```
~~~

具体内容请挪步：[自动组装数据](/?page=context)

### 监听数据变化

> 表单组件往往是含有很复杂逻辑的，处理表单逻辑很大一部分是需要依赖监听数据变化的能力，在JSXForm1.x中，只提供一个watch属性，在整个表单组件层进行监听，其监听能力是有限的。

JSXForm2.x提供了多个维度的数据监听能力：

+ 同表单单个组件监听
+ 同表单整体监听
+ 跨表单单个组件监听
+ 跨表单整体监听

具体内容请挪步：[数据监听](/?page=context)