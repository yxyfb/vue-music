import jsonp from 'js/jsonp'
import {recommendParams,ERR_OK} from './config'

export const getHotSearch = () => {
    const url ='https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';
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
            return res.data.hotkey
        }

        throw new Error('没有获取到热门搜索数据');
    }).catch(err => {
        if(err) {
            console.log('获取热门搜索数据错误' + err);
        }
    })
}