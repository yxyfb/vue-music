import storage from './storage'

const SEARCH_KEY = '_historySearch_';
const MAX_NUM = 20 ;
const PLAYING_SONG_KEY = '_playingSong_';
const PLAYING_MAX_NUM = 100 ;

function insertArr(arr,val,fn,maxNum) {
    let index = arr.findIndex(fn);//判断数组是否包含新传进来的数据，如果包含就返回对应的index
    if(index === 0) {  //就在第一个位置
        return;
    }
    if(index > 0) {
        arr.splice(index,1);
    }
    arr.unshift(val);  //不管包含不包含，只要不在第一个位置，都要将数据添加到第一个位置

    if(maxNum && arr.length > maxNum) { //如果超过了存储数据个数，就删除最后一个
        arr.pop();
    }
}

//搜索历史存入缓存
export const saveSearch = (searchText) => {
    let ret = storage.get(SEARCH_KEY,[]);   //先获取缓存
    insertArr(ret,searchText,(item) => {
        return item === searchText;   //item为ret中每一个
    },MAX_NUM);
    storage.set(SEARCH_KEY,ret);
    return ret;
}

//页面刷新，vuex就获取到搜索历史的缓存列表
export const getSearchList = () => {
    return storage.get(SEARCH_KEY,[]);
}

//删除某个缓存记录;
export const deleteOne = (searchText) => {
    let ret = storage.get(SEARCH_KEY);
    ret = ret.filter(val => val !== searchText);
    storage.set(SEARCH_KEY,ret);
    return ret;
}

//清空搜索记录
export const deleteAll = () => {
    storage.remove(SEARCH_KEY);
    return [];
}

//给播放过的列表添加音乐
export const saveSong = (song) => {
    let ret = storage.get(PLAYING_SONG_KEY,[]);
    insertArr(ret,song,(item) => {
        return song.songid === item.songid
    },PLAYING_MAX_NUM);
    storage.set(PLAYING_SONG_KEY,ret);
    return ret;
}

//页面刷新，vuex就获取到播放过的列表
export const getPlayingSongs = () => {
    return storage.get(PLAYING_SONG_KEY,[]);
}

const LIKE_KEY = '_likeSongs_';
const LIKE_NUM = 50;
// 收藏喜欢的歌曲
export const saveLike = (song) => {
    let ret = storage.get(LIKE_KEY,[]);
    insertArr(ret,song,(item) => {
        return item.songid === song.songid;
    },LIKE_NUM);
    storage.set(LIKE_KEY,ret);
    return ret;
}
//删除喜欢的歌曲
export const deleteLike = (song) => {
    let ret = storage.get(LIKE_KEY,[]);
    ret = ret.filter(item =>  item.songid !== song.songid);
    storage.set(LIKE_KEY,ret);
    return ret;
}

export const getLikeList = () => {
    return storage.get(LIKE_KEY,[]);
}
