import Jsonp from 'js/jsonp.js';
import {ERR_OK,recommendParams} from './config.js'

export const getSinger = () => {
    const url ='https://c.y.qq.com/v8/fcg-bin/v8.fcg';
    const data = Object.assign({},recommendParams,{
        g_tk: 1928093487,
        channel: 'singer',
        page: 'list',
        key: 'all_all_all',
        pagesize: 100,
        pagenum: 1,
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq'  
    });

    return Jsonp(url,data,{
        param: 'jsonpCallback'
    }).then(res => {
        if(res.code === ERR_OK){
            return res.data
        }
        throw new Error('没有获取到数据！');
    }).catch(err => {
        if(err) {
            console.log('歌手列表获取错误' + err);
        }
    })
}