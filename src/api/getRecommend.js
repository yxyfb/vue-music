import jsonp from 'js/jsonp'

import {
  ERR_OK,
  recommendParams
} from './config'

export const getRecommendSlider = () => {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
  const data = Object.assign({}, recommendParams, {
    _: 1566955876469,
    g_tk: 5381,
    uin: 392584117,
    format: "json",
    notice: 0,
    platform: "h5",
    needNewCode: 1
  });

  return jsonp(url, data, {
    param: 'jsonpCallback'
  }).then(res => {
    if (res.code === ERR_OK) {
      return res.data.slider;
    }
    throw new Error('没有获取到录播图数据');
  }).catch(err => {
    if (err) {
      const res = [{
        id: 21308,
        linkUrl: "javascript:;",
        picUrl: require('styles/img/404.png')
      }]
      console.log('轮播图数据获取失败' + err);
      return res
    }
  })
};
