import jsonp from 'js/jsonp'
import {recommendParams,ERR_OK} from './config'

export const getRankDetail = (id) => {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';
    const data = Object.assign({},recommendParams,{
        g_tk: 1928093487,
        topid: id,
        needNewCode: 1,
        uin: 0,
        tpl: 3,
        page: 'detail',
        type: 'top',
        platform: 'h5',
    });
    
    return jsonp(url,data,{
        param:'jsonpCallback'
    }).then(res => {
        if(res.code === ERR_OK) {
            return res;
        }

        throw new Error('没有获取到排行榜详情页数据')
    }).catch(err => {
        if(err) {
            console.log('获取排行榜详情页数据错误'+ err)
        }
    })
}