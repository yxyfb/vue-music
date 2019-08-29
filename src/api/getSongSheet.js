import axios from 'axios'
import {ERR_OK,recommendParams} from './config'

export const getSongSheet = (id) => {
    const url ='/api/getSongSheet';
    const data = Object.assign({},recommendParams,{
        g_tk: 1663279238,
        disstid: id,
        type: 1,
        json: 1,
        utf8: 1,
        onlysong: 0,
        hostUin: 0,
        needNewCode: 0,
        new_format: 1,
        loginUin: 0,
        hostUin: 0,
        platform: 'yqq.json',
        needNewCode: 0
    });

    return axios.get(url,{
        params:data
    }).then(res => {
        res = res.data;
        if(typeof res === 'string'){
            let pattern = /^\w+\(({.+})\)/;  //  .号匹配任意字符
            let matchs = res.match(pattern);
            if(matchs){
                res = JSON.parse(matchs[1]); 
                if(res.code === ERR_OK) {
                    return Promise.resolve(res.cdlist[0])
                }
            }
        }
    })
};