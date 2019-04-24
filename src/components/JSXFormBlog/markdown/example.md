## JSX-Form
### 代码演示
~~~
@ path /example/Base.jsx
@ param title 一个简单例子
@ param desc 常见的简单表单
```
this.state = {
    formData: {
        os: 'web',
        param: '',
        desc: '',
        type: 'string'
    }
}
<JSXForm 
    value={this.state.formData} 
    onChange={data => this.setState({formData: data})}>
    <Input v-model="param" v-label="param" v-validate={['required', /^[a-zA-Z_]+$/g]} />
    <Select v-model="os" v-label="操作系统" v-validate={['required']}>
        {
            osList.map(item => <Option key={item} value={item}>{item}</Option>)
        }
    </Select>
    <RadioGroup v-label="类型" v-model="type">
        {
            typeList.map(item => <Radio key={item} value={item}>{item}</Radio>)
        }
    </RadioGroup>
    <TextArea v-label="描述" v-model="desc" rows="3"></TextArea>
    <Button className="submit-btn" onClick={this.submitFormData} type="primary">提交</Button>
</JSXForm>
```
~~~

~~~
@ path /example/Dynamic.jsx
@ param title 动态表单
@ param desc 通过v-for指令，来实现动态增减表单组件的功能。
```
this.state = {
    formData: {
        paramList: [
            {
                name: '',
                type: 'string',
                desc: ''
            }
        ]
    }
}
<JSXForm value={formData} onChange={(data) => {
    this.setState({formData: data})
}}>
    <div className="param-item" v-for="(item, index) in paramList">
        <div className="param-rows">
            <Select v-model="item.name" v-label-class="param-select" v-label="param">
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
        <div className="add-btn" v-click="paramList.push({name: '', type: 'integer', desc: ''})" v-show="index === paramList.length - 1">+</div>
        <div className="delete-btn" v-show="paramList.length > 1" v-click="paramList.splice(index, 1)">
            <Icon theme="filled" type="delete" />
        </div>
    </div>
</JSXForm>
```
~~~

~~~
@ path /example/Packing.jsx
@ param title 复杂输入表单
@ param desc 如果表单组件并非只是简单的输入输出，则需要对表单的输入输出值进行包装处理。
```
this.state = {
    formData: {
        styles: {
            border: 'solid 1px #ddd',
            padding: '10px',
            color: '#000'
        }
    }
}
const vpacking = {
    value: (curValue) => {
        const keys = Object.keys(curValue)
        let valueStr = ''
        keys.forEach((key, idx) => {
            if(key !== '__next_line__'){
                const displayValue = typeof curValue[key] === 'undefined' ? '' : `=${curValue[key]}`
                valueStr += `${idx === 0 ? '' : '\n'}${key}${displayValue}`
            }
        })
        if(curValue.__next_line__){
            valueStr += '\n'
        }
        return valueStr
    },
    result: (curValue) => {
        const newValue = {}
        const styles = curValue.split('\n')
        styles.forEach((style, idx) => {
            if(style){
                let key = style
                let value = undefined
                if(style.includes('=')){
                    key = style.split('=')[0]
                    value = style.split('=')[1]
                }
                newValue[key] = value
            }
        })
        if(!styles[styles.length - 1]){
            newValue.__next_line__ = true
        } 
        return newValue
    }
}
<JSXForm value={this.state.formData} onChange={(data) => {
    this.setState({formData: data})
}}>
    <TextArea 
        v-label="样式表" 
        v-model="styles"  
        v-packing={vpacking}
        rows="5"></TextArea>
    <div className="results-area" style={formData.styles}>
        这里是样式结果
    </div>
</JSXForm>
```
~~~

~~~
@ path /example/Linkage.jsx
@ param title 联动表单
@ param desc 使用watch，在表单组件的值修改后调用相应注册函数，在注册的函数里实现相应的联动逻辑功能。不过watch只是希望实现简单的逻辑，对于复杂的表单逻辑，最好使用原始的React来处理。


```
this.state = {
    formData: {
        game: {
            a: '',
            b: '',
            c: '',
            cheat: false
        },
        results: ''
    }
}
countResult = () => {
    const {formData} = this.state
    let results = ''
    const keys = ['a', 'b', 'c']
    const names = {
        a: '自己',
        b: '路人甲',
        c: '土匪丁'
    }
    if(formData.game.a === '主角无敌'){
        results += '自己 赢了 所有\n'
    }
    keys.forEach((key, idx) => {
        const other = keys.filter(curkey => curkey !== key)
        other.forEach(subKey => {
            if((formData.game[key] + 1) % 4 === formData.game[subKey]){
                results += `${names[key]} 赢了 ${names[subKey]}；`
            }
        })
    })
    results = results || '这局平局'
    this.setState({formData: {...formData, results,}})
}
const gameList = [
    {name: '棒棒', key: 0},
    {name: '虎', key: 1},
    {name: '鸡', key: 2},
    {name: '虫', key: 3},
]
const watch = {
    'game.a': (prev, curr) => {
        const {formData} = this.state
        const value = [0, 1, 2, 3]
        const bValue = Math.floor(Math.random() * 4)
        const cValue = Math.floor(Math.random() * 4)
        let aValue = curr
        if(formData.game.cheat){
            const newValue = value.filter(item => {
                return item !== bValue && item !== cValue && item !== (bValue + 1) % 4 && item !== (cValue + 1) % 4
            })
            aValue = newValue[0] || '主角无敌'
        }
        this.setState({
            formData: {
                ...formData,
                game: {
                    ...formData.game,
                    a: aValue,
                    b: bValue,
                    c: cValue
                }
            }
        }, this.countResult)
    }
}
const gameOptions = gameList.map(item => <Option key={item.key} value={item.key}>{item.name}</Option>)
<JSXForm 
    value={formData}
    watch={watch}
    onChange={data => this.setState({formData: data})}>
    <Select v-model="game.a" v-label="自己">
        {gameOptions}
    </Select>
    <Select v-model="game.b" v-label="路人甲" disabled>
        {gameOptions}
    </Select>
    <Select v-model="game.c" v-label="土匪丁" disabled>
        {gameOptions}
    </Select>
    <Select v-model="game.cheat" v-label="是否作弊">
        <Option value={true}>主角光环</Option>
        <Option value={false}>公平、公正、公开</Option>
    </Select>
    <div>结果：{formData.results}</div>
</JSXForm>
```
~~~