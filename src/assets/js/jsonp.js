import Jsonp from 'jsonp';

export default (url,data,option) => {
    url += (url.indexOf('?')<0 ? '?' : '') + params(data); 

    return new Promise((resolve,reject) => {
        Jsonp(url,option,(err,data) => {
            if(!err) {
                resolve(data);
            } else {
                reject(err);
            }
        })
    })
}

const params = (data) => {
    let ret = [];

    for(let key in data) {
        let val = data[key] !== undefined ? data[key] : '';
        ret.push([key,val]);
    }

    return ret.map(val => val.join('=')).join('&');
}