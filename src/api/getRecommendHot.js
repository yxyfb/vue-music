import axios from 'axios'
import {
  ERR_OK,
  recommendParams
} from './config'

export const getRecommendHot = () => {
  const url = '/api/getRecommendHot';
  const data = Object.assign({}, recommendParams, {
    picmid: 1,
    rnd: 0.44858327424016187,
    g_tk: 1663279238,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    platform: 'yqq.json',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 19,
  });

  return axios.get(url, {
    params: data
  }).then(res => {
    res = res.data;
    if (res.code === ERR_OK) {
      return res.data.list;
    }
    throw new Error('没有获取到热门歌单数据');
  }).catch(err => {
    if (err) {
      console.log('热门歌单数据获取失败' + err);
    }
  })
}
