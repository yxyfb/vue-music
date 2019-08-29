export const singer = state => state.singer;
export const playing = state => state.playing;
export const fullScreen = state => state.fullScreen;
export const sequenceList = state => state.sequenceList;
export const playList = state => state.playList;
export const playMode = state => state.playMode;
export const curIndex = state => state.curIndex;
export const curSong = (state) => {
    return state.playList[state.curIndex] || {} ;
}
/* 歌单信息 */
export const songSheet = state => state.songSheet;
/* 排行榜信息 */
export const topList = state => state.topList;
/* 搜索历史 */
export const historySearch = state => state.historySearch;
/* 播放历史 */
export const playingSongs = state => state.playingSongs;
/* 收藏列表 */
export const likeList = state => state.likeList;