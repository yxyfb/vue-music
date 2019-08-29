import axios from 'axios'
import {ERR_OK,recommendParams} from './config'
import {Base64} from 'js-base64'  //解析base64加密

export const getLyric = (mid) => {
    const url = '/api/getLyric';
    const data = Object.assign({},recommendParams,{
        g_tk: 1928093487,
        songmid: mid,
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0,
        categoryId: 10000000,
        pcachetime: +new Date()
    });

    return axios.get(url,{
        params: data
    }).then(res => {
        res = res.data;
        if(typeof res === 'string') {
            let pattern = /^\w+\(({[^()]+})\)$/;
            let matchs = res.match(pattern);
            if(matchs) {
                res = JSON.parse(matchs[1]);
                if(res.code === ERR_OK) {
                    let lyric = Base64.decode(res.lyric);
                    return lyric;
                }
            }
        }else {
            throw new Error('获取歌词数据失败');
        }
    })
}