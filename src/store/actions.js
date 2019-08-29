/* 通常异步操作和对mutations封装，写在actions里面 */
import * as types from './mutation-types'
import {playMode} from 'js/config'
import {shuffle} from 'js/util'  //洗牌
import {saveSearch,deleteOne,deleteAll,saveSong,saveLike,deleteLike} from 'js/cache'

function hasIndex(arr,song) { //返回列表中相同歌曲的下标
    return arr.findIndex(item => {
        return item.songid === song.songid
    })
}

//点击歌曲时，设置播放列表，显示顺序列表，全屏，播放
export const selectMusic = ({commit,state},{list,index}) => {
    commit(types.SET_SEQUENCE_LIST,list);
    if(state.mode === playMode.random) {
        let randomList = shuffle(list);
        commit(types.SET_PLAY_LIST,randomList);
        index = hasIndex(randomList,list[index]);
    } else {
        commit(types.SET_PLAY_LIST,list);
    }
    commit(types.SET_CUR_INDEX,index);
    commit(types.SET_PLAYING,true);
    commit(types.SET_FULL_SCREEN,true);
}

//点击全部随机播放
export const randomPlayAll = ({commit,state},list) => {
    commit(types.SET_PLAY_MODE,playMode.random)
    commit(types.SET_SEQUENCE_LIST,list);
    let newList = shuffle(list);
    commit(types.SET_PLAY_LIST,newList);
    commit(types.SET_CUR_INDEX,0);//播放随机列表的第一个
    commit(types.SET_PLAYING,true);
    commit(types.SET_FULL_SCREEN,true);
}


//在当前播放列表中，插入一首歌
export const insertSong = ({commit,state},song) => {
    /* 播放列表 */
    let playList = state.playList.slice(); //获取当前播放列表副本
    let curIndex = state.curIndex; //获取当前播放歌曲下标
    let curSong = playList[curIndex] ; //获取当前歌曲
    let playListIndex = hasIndex(playList,song); //播放列表是否已经含有添加的歌曲
    curIndex++;   //因为是插入的歌曲，所以下标加1
    playList.splice(curIndex,0,song); //将点击歌曲放入播放列表数组   ------重点
    if(playListIndex > -1) {  //大于-1，说明列表已包含点击个歌曲
        if(curIndex > playListIndex) { //在播放歌曲前面，删掉，并当前播放下标减1
            playList.splice(playListIndex,1);
            curIndex--;
        } else {  //在播放歌曲后面，删掉，并当前播放下标不变
            playList.splice(playListIndex+1,1); //因为增加了一个，所以删除的下标要加1
        }
    }

    //为什么单独把sequenceList重新获取，因为playList的顺序模式值是sequenceList赋予了，想改变playList，就要改变sequenceList
    let sequenceList = state.sequenceList.slice(); //获取顺序播放列表
    let curSIndex = hasIndex(sequenceList,curSong) + 1;//顺序列表sequenceList,插入的位置
    let sequenceListIndex = hasIndex(sequenceList,song); //顺序列表中是否已经包含插入的歌曲，返回下标
    sequenceList.splice(curSIndex,0,song);//将点击歌曲放入顺序列表数组   ------重点
    if(sequenceListIndex > -1) {
        if(curSIndex > sequenceListIndex) { //在播放歌曲前面，删掉
            sequenceList.splice(sequenceListIndex,1);
            //curSIndex--;   不用减了，因为sequenceList不会直接使用，只是给playList赋值
        } else {  //在播放歌曲后面，删掉，并当前播放下标不变
            sequenceList.splice(sequenceListIndex+1,1);//因为增加了一个，所以删除的下标要加1
        }
    }


    commit(types.SET_PLAY_LIST,playList);
    commit(types.SET_SEQUENCE_LIST,sequenceList);
    commit(types.SET_CUR_INDEX,curIndex);
    commit(types.SET_PLAYING,true);
    commit(types.SET_FULL_SCREEN,true);
}

//在当前播放列表中，删除一首歌
export const deleteSong = ({commit,state},song) => {
    let playList = state.playList.slice();
    let sequenceList = state.sequenceList.slice();
    let curIndex = state.curIndex;

    let sIndex = hasIndex(sequenceList,song); //顺序列表中要删除的下标
    sequenceList.splice(sIndex,1);

    let pIndex = hasIndex(playList,song); //获取随机列表中要删除的下标
    playList.splice(pIndex,1);
    if(curIndex > pIndex || curIndex === playList.length) {
        curIndex--;
    }

    commit(types.SET_PLAY_LIST,playList);
    commit(types.SET_SEQUENCE_LIST,sequenceList);
    commit(types.SET_CUR_INDEX,curIndex);
    commit(types.SET_PLAYING,true);
}

//清空播放列表
export const clearPlayList = ({commit}) => {
    commit(types.SET_PLAY_LIST,[]);
    commit(types.SET_SEQUENCE_LIST,[]);
    commit(types.SET_CUR_INDEX,-1);
    commit(types.SET_PLAYING,false);
}

//存入缓存
export const saveHistorySearch = ({commit},searchText) => {
    commit(types.SET_HISTORY_SEARCH,saveSearch(searchText));
}

//删除搜索历史中某个选项
export const deleteOneHistory = ({commit},searchText) => {
    commit(types.SET_HISTORY_SEARCH,deleteOne(searchText));
}

//删除搜索历史中某个选项
export const deleteAllHistory = ({commit}) => {
    commit(types.SET_HISTORY_SEARCH,deleteAll());
}

//将播放过的歌曲存入播放历史
export const savePlayingSong = ({commit},song) => {
    commit(types.SET_PLAYING_SONGS,saveSong(song))
}

//将喜欢的歌曲收取放入收藏列表
export const saveLikeList = ({commit},song) => {
    commit(types.SET_LIKE_LIST,saveLike(song))
}
//将喜欢的歌曲删除
export const deleteLikeSong = ({commit},song) => {
    commit(types.SET_LIKE_LIST,deleteLike(song))
}