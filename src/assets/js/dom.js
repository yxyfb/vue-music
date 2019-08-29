
//事件捕获，设置子元素的index
export const getDataIndex = (el,name,val) => {
    name = 'data-' + name;
    if(val) {
        return el.setAttribute(name,val);
    }else {
        return el.getAttribute(name);
    }
};


//JS中CSS的兼容
const elStyle = document.createElement('div').style;

let vendor = (() => {
    const allKeys = {
        webkit: 'webkitTransform',
        ms: 'msTransform',
        O: 'OTransform',
        Moz: 'MozTransform',
        standard: 'transform'
    };
    for(let key in allKeys) {
        if(elStyle[allKeys[key]] !== undefined) {
            return key;
        }
    }

    return false ;  //如果都不存在
})()

export const prefixStyle = (style) => {
    if(vendor === false) {
        return false;
    }
    if(vendor === 'standard') {
        return style;
    }

    return vendor+style.charAt(0).toUpperCase()+style.substr(1);
}