import jsonp from '@/assets/js/jsonp'
import {ERR_OK} from './config.js'

export function getSongVkey(songmid) {
    const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
    const data = Object.assign({}, {
        callback: 'musicJsonCallback',
        loginUin: 3051522991,
        format: 'jsonp',
        platform: 'yqq',
        needNewCode: 0,
        cid: 205361747,
        uin: 0,
        guid: 6711929420,
        songmid: songmid,
        filename: `C400${songmid}.m4a`
    })
 
    return jsonp(url,data).then(res => {
        if(res.code === ERR_OK){
            return res.data;
        }
        throw new Error('没有Vkey数据');
    }).catch(err => {
        if(err){
            console.log('获取Vkey失败' + err);
        }
    })
}