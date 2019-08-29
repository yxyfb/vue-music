import * as types from './mutation-types'

const mutations = {
    [types.SET_SINGER](state,singer) {
        state.singer = singer;
    },
    [types.SET_PLAYING](state,playing) {
        state.playing = playing;
    },
    [types.SET_FULL_SCREEN](state,fullScreen) {
        state.fullScreen = fullScreen;
    },
    [types.SET_SEQUENCE_LIST](state,sequenceList) {
        state.sequenceList = sequenceList;
    },
    [types.SET_PLAY_LIST](state,playList) {
        state.playList = playList;
    },
    [types.SET_PLAY_MODE](state,playMode) {
        state.playMode = playMode;
    },
    [types.SET_CUR_INDEX](state,curIndex) {
        state.curIndex = curIndex;
    },
    /* 歌单信息 */
    [types.SET_SONG_SHEET](state,songSheet) {
        state.songSheet = songSheet;
    },
    /* 排行榜详情 */
    [types.SET_TOP_LIST](state,topList) {
        state.topList = topList;
    },
    /* 搜索历史 */
    [types.SET_HISTORY_SEARCH](state,historySearch) {
        state.historySearch = historySearch;
    },
    /* 播放历史 */
    [types.SET_PLAYING_SONGS](state,playingSongs) {
        state.playingSongs = playingSongs;
    },
    /* 收藏列表 */
    [types.SET_LIKE_LIST](state,likeList) {
        state.likeList = likeList;
    }
}

export default mutations;