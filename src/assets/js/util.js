
//-----打乱数组函数-------
export const shuffle = (arr) => {
    const _arr = arr.slice();
    const arrLength = _arr.length;
    let i = arrLength;
    let num;

    while(i--) {
        num = Math.floor(Math.random()*arrLength);
        if(i !== num) {
            [_arr[i],_arr[num]] = [_arr[num],_arr[i]];
        }
    }
    return _arr;
}


//---------节流函数---------
export const debounce = (fn,delay=200) => {
    let timer = null;
    return function(...agrs) {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this,agrs)
        }, delay);
    }
}