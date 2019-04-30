## 统一上下文

> 在JSXForm1.x中，由于指令解析放在表单组件render过程中，为了防止JSXForm的中间变量被React解析，因此不得不设定其中间变量采用字符串形式，但是这样会形成JSXForm和React两套上下文，相互之间引用变量变得很麻烦，不得不采用v-bind和v-$动态属性来实现互通。<br />
JSXForm2.x将指令解析放在了webpack层，这样JSXForm和React的上下文便统一起来。

~~~
@ path /example2.0/Context.jsx
@ param title 统一上下文
@ param desc 
~~~