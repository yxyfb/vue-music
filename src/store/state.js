import {playMode} from 'js/config'
import {getSearchList,getPlayingSongs,getLikeList} from 'js/cache'

const state = {
    singer: {},      //歌手详情  
    playing: false,  //播放状态
    fullScreen: false,  //全屏
    sequenceList: [],  //顺序列表，用作顺序播放和页面展示时，歌曲的排序
    playList: [],      //当前播放列表,循环，随机，顺序，根据播放模式改变
    playMode: playMode.sequence,  //播放模式
    curIndex: -1,  //当前播放歌曲下标 
    //-------歌单信息-----
    songSheet: {},
    //------排行榜详情页信息---
    topList: {},
    //------搜索历史----
    historySearch: getSearchList(),
    //------播放历史----
    playingSongs: getPlayingSongs(),
    //------收藏列表----
    likeList: getLikeList(),

}

export default state; //外部调用，在index中使用