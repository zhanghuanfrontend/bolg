export const getUrlParam = (key) => {
    const reg = new RegExp(`\\?.*${key}=?(.*?)(?=&|$)`, 'g')
    const url = window.location.href.toString()
    const match = reg.exec(url)
    if(match){
        return match[1] ? match[1] : true
    }
    return undefined
}

// 添加Url参数
export const addUrlParam = (params) => {
    let href = window.location.href.toString()
    const keys = Object.keys(params)
    keys.forEach(key => {
        const value = typeof params[key] === 'undefined' ? '' : `=${params[key]}`
        if(getUrlParam(key)){
            const reg = new RegExp(`${key}=?.*?(?=&|$)`, 'g')
            href = href.replace(reg, (match) => {
                return `${key}${value}`
            })
        }else{
            const paramStr =  `${href.includes('?') ? '&' : '?'}${key}${value}`
            href += paramStr
        }
    })
    window.history.replaceState('', '', href);
}

