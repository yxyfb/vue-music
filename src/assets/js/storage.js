/* 本地缓存 */
const loacalStorage = window.localStorage

export default {
    set(key,value) {
        if(value === undefined) {
            return ;
        }
        loacalStorage.setItem(key,JSON.stringify(value));
    },
    get(key,def) {//def默认值
        const value = parseVal(localStorage.getItem(key));
        return value === undefined ? def : value;
    },
    remove(key) {
        localStorage.removeItem(key);
    },
    clear() {
        localStorage.clear();
    }
}

function parseVal(val) {
    if(typeof val !== 'string') {
        return undefined;
    }

    try {
        return JSON.parse(val);
    } catch (err) {
        return val || undefined;
    }
}