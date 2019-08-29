import jsonp from 'js/jsonp'
import {recommendParams,ERR_OK} from './config'

export const getRank = () => {
    const url ='https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';
    const data = Object.assign({},recommendParams,{
        g_tk: 1928093487,
        uin: 0,
        needNewCode: 1,
        platform: 'h5'
    });

    return jsonp(url,data,{
        param: 'jsonpCallback'
    }).then(res => {
        if(res.code === ERR_OK) {
            return res.data.topList;
        }

        throw new Error('没有获取到排行榜数据');
    }).catch(err => {
        if(err) {
            console.log('获取排行数据错误' + err);
        }
    })
}