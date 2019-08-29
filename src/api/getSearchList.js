import axios from 'axios'
import {recommendParams,ERR_OK} from './config'

export const getSearchList = (text,page=1,zhida,pageNum) => {
    const url = '/api/getSearchList';
    const data = Object.assign({},recommendParams,{
        g_tk: 1928093487,
        zhidaqu: 1,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        remoteplace: 'txt.mqq.all',
        uin: 0,
        needNewCode: 1,
        platform: 'h5',
        catZhida: zhida ? 1:0,  //是否开启搜索歌手名字，开启为1，不开启为0
        perpage:pageNum,   //pageNum一页加载20个数据
        n:pageNum,
        w: text,   //搜索的关键字
        p: page   //搜索数据在第几页
    });

    return axios.get(url,{
        params:data
    }).then(res => {
        res = res.data;
        if(res) {
            const pattern = /^\w+\(({.+})\)$/;
            let matchs = res.match(pattern);
            if(matchs) {
                res = JSON.parse(matchs[1]);
                if(res.code === ERR_OK) {
                    return res.data;
                }
            }
        }

        throw new Error('没有获取到搜索数据');
    }).catch(err => {
        if(err) {
            console.log('获取搜索数据失败' + err);
        }
    })
}