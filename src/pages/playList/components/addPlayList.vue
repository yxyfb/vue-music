<template>
    <div class="addPlayList-wrapper" v-show='addShow' @click.stop>
        <div class="addPlayList">
            <div class="addPlayList-header">
                <h1 class='header'>添加歌曲到列表</h1>
                <div class="closeIcon" @click='hide'>
                    <i class="iconfont icon-close"></i>
                </div>
            </div>
             <!-- 搜索框和搜索列表 -->
            <div class="addPlayList-searchInput">
                <v-searchInput :placeholder='placeholder'
                               @changeInputText='changeInputText' ref='input'>
                </v-searchInput>
            </div>
            <div class="addPlayList-searchList" v-show='listShow' ref='searchListWrapper'>
                <v-searchList :inputText='inputText' @beforeScrollStart='beforeScrollStart'
                            @joinHistory='playSearchMusic' :showSinger='false'></v-searchList>
            </div>

            <!-- tab页面 -->
            <div class="addPlayList-content">
                <div>
                    <v-playTab :items='items' @changeTabCurIndex='changeTabCurIndex' :curIndex='curTabIndex'></v-playTab>
                </div>
                <div class="tab">
                    <v-scroll ref='playScroll' :data='playingSongs' class='play-tab' v-show='curTabIndex === 0'>
                        <div class="songlist-wrapper">
                            <v-songList :songs='playingSongs'
                                        @playMusic='playMusic'></v-songList>
                        </div>
                    </v-scroll>
                    <v-scroll ref='searchScroll' class='search-tab' :data='historySearch' v-show='curTabIndex === 1'>
                        <div class="searchHistoryList-wrapper">
                            <v-searchHistoryList :historySearch='historySearch'
                                                 @selectItem='setInputText'
                                                 @removeItemHistory='removeItemHistory'>
                            </v-searchHistoryList>
                        </div>
                    </v-scroll>
                </div>
            </div>

           
        </div>
        <v-topSlider ref='topSlider'>
            <p>已添加到播放列表</p>
        </v-topSlider>
    </div>
</template>

<script>
import searchInput from 'common/search-input/search-input'
import searchList from 'common/search-list/search-list'
import searchHistoryList from 'common/search-historyList/search-historyList'
import playTab from 'common/playTab/playTab'
import Scroll from 'common/scroll/scroll'
import SongList from 'common/songList/songList'
import topSlider from 'common/topSlider/topSlider'
import {searchMixin} from 'js/mixin'
import {mapActions,mapGetters} from 'vuex'
import {song} from 'js/song'

export default {
    mixins: [searchMixin],
    data() {
        return {
            placeholder: '搜索歌曲',
            addShow: false,
            items:['最近播放','搜索历史'],
            curTabIndex: 0
        }
    },
    computed: {
        ...mapGetters([
            'playingSongs'
        ])
    },
    methods: {
        show() {
            this.addShow = true;

            setTimeout(() => {
                if(this.curTabIndex === 0) {
                    this.$refs.playScroll.refresh();
                } else {
                    this.$refs.searchScroll.refresh();
                }
            },20)
        },
        hide() {
            this.addShow = false;
        },
        changeTabCurIndex(index){
            this.curTabIndex = index;
        },
        removeItemHistory(item) { //删除某个搜索历史
            this.deleteOneHistory(item);
        },
        playSearchMusic() {
            this.joinHistory();//mixin混入
            this.topSliderShow();
        },
        playMusic(song,index) {
           this.insertSong(song);
           this.topSliderShow();
        },
        topSliderShow() {
            this.$refs.topSlider.show(); //播放歌曲成功，弹出提示信息
        },
        ...mapActions([
            'insertSong',
            'deleteOneHistory'
        ])
    },
    components: {
        'v-searchInput': searchInput,
        'v-searchList': searchList,
        'v-playTab': playTab,
        'v-scroll': Scroll,
        'v-songList': SongList,
        'v-searchHistoryList': searchHistoryList,
        'v-topSlider': topSlider
    }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable';
@import '~styles/mixin';

.addPlayList-wrapper
    fixed()
    background: $color-background
    .addPlayList
        absolute()
        .addPlayList-header
            position: relative
            .header
                height: .88rem
                line-height: .88rem
                text-align: center
                font-size: $font-size-large
            .closeIcon
                flex-center()
                position: absolute
                top: 0
                right: .16rem
                height: .88rem
                line-height: .88rem
                width: .88rem
                font-size: .4rem
                color: $color-theme
        .addPlayList-searchInput
            margin: .4rem 0
        .addPlayList-searchList
            position: absolute
            top: 2.48rem
            bottom: 0
            width: 100%
            z-index: 500
        .addPlayList-content
            position: absolute
            top: 2.48rem
            bottom: 0
            width: 100%
            .tab
                overflow: hidden
                position: absolute
                top: 1.04rem
                bottom: 0
                width: 100%
                padding: 0 .6rem 
                color: $color-text-l
                box-sizing: border-box
                .search-tab,
                .play-tab
                    position: relative
                    height: 100%

</style>

