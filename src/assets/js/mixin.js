import {mapGetters,mapActions,mapMutations} from 'vuex'

//当播放列表有值时，所有页面得到滚动列表下面都出现一个padding-bottom= 60px,避免被小播放器遮住
export const playListMixin = {
    computed: {
        ...mapGetters([
            'playList'
        ])
    },
    mounted() {//切换页面时，如果已经存在播放列表，执行到mounted和activated时，也要触发scroll刷新
        if(this.playList.length > 0) {
            this.changeListBottom(this.playList);
        }
    },
    activated() {
        if(this.playList.length > 0) {
            this.changeListBottom(this.playList);
        }
    },
    watch: {
        playList(newList) {
            this.changeListBottom(newList);
        }
    },
    methods: {
        changeListBottom(list) {
            throw new Error ('组件里面没有定义changeListBottom')
        }
    }
};


/*--------------------player和playList中公共JS功能------------------------ */
import {playMode} from 'js/config'
import {shuffle} from 'js/util'

export const playerMixin = {
    computed: {
        playModeIcon() { //播放模式按钮图标
            return this.playMode === playMode.sequence ? 'icon-sequence' : this.playMode === playMode.random ? 'icon-random' : 'icon-loop' ;
        },
        ...mapGetters([
            'playMode',
            'sequenceList',
            'curSong',
            'playList',
            'likeList'
        ])
    },
    methods: {
        changePlayMode() {  //改变播放模式
            const mode = (this.playMode+1) % 3;
            this.setPlayMode(mode);
           
            let list = null;
            if(this.playMode === playMode.random) { //随机列表
                list = shuffle(this.sequenceList);
            } else {  //顺序列表
                list = this.sequenceList;
            }

            this.resetCurIndex(list);  //更新当前播放歌曲下标
            this.setPlayList(list);
        },
        resetCurIndex(list) {  //当更换随机列表时，需要更新当前的播放歌曲的下标，使播放歌曲不变
            let index = list.findIndex((item) => {
                return item.songid === this.curSong.songid; //返回列表中与当前播放歌曲id相同歌曲的下标
            });
            this.setCurIndex(index);
        },
        /* --收藏红心-- */
        getFavoriteIcon(curSong) {
            if(this.isFavoriteSong(curSong)) { //已经包含，则红心亮
                return 'icon-favorite';
            } 
            return 'icon-not-favorite'; //红心熄灭
            
        },
        toggleFavorite(curSong) {
            if(this.isFavoriteSong(curSong)) { //已经包含，则取消收藏
                this.deleteLikeSong(curSong);
            } else {
                this.saveLikeList(curSong); //存入收藏列表
            }
        },
        isFavoriteSong(curSong) {  //收藏歌曲列表是否已经包含收藏的歌曲
            let index = this.likeList.findIndex((item) => {
                return item.songid === curSong.songid;
            });
            return index > -1;
        },
        ...mapMutations({
            setCurIndex: 'SET_CUR_INDEX',
            setPlayMode: 'SET_PLAY_MODE',
            setPlayList: 'SET_PLAY_LIST',
            setPlaying: 'SET_PLAYING',
        }),
        ...mapActions([
            'saveLikeList',
            'deleteLikeSong'
        ])
    }
};



/* --------------------addPlayList与search中的公共JS功能----------------------- */
export const searchMixin = {
    data() {
        return {
            listShow: false,
            inputText:''
        }
    },
    methods: {
        changeInputText(newText) {
            this.listShow = newText ? true : false;
            this.inputText = newText;
        },
        beforeScrollStart() { //滚动前，手机键盘失焦
            this.$refs.input.blur();
        },
        setInputText(text) { //点击热门搜索或搜索历史，给input款赋值
            this.$refs.input.setInputText(text)
        },
        joinHistory() { //点击了搜索列表里面的信息，就会存储到本地列表
            this.saveHistorySearch(this.inputText);//通过vuex存入缓存
        },
        ...mapActions([
            'saveHistorySearch'     
        ])
    },
    computed: {
        ...mapGetters([
            'historySearch'
        ])
    }
}


