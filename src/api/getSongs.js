import Jsonp from 'js/jsonp'
import {ERR_OK,recommendParams} from './config'

export const getSongs = (mid) => {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';
    const data = Object.assign({},recommendParams,{
        g_tk: 1928093487,
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq',
        order: 'listen',
        begin: 0,
        num: 80,
        songstatus: 1,
        singermid: mid
    });

    return Jsonp(url,data,{
        param:'jsonpCallback'
    }).then(res => {
        if(res.code === ERR_OK) {
            return res.data
        }
        
        throw new Error('没有获取到歌曲列表数据');
    }).catch(err => {
        if(err) {
            console.log('歌曲列表获取失败' + err)
        }
    })
}