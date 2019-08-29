<template>
    <transition name='playList'>
        <div class="playList-wrapper" v-show='playListShow' @click.stop='hide'>
            <div class="playList"  @click.stop>
                <h2 class="playList-header">
                    <i class="iconfont modeIcon" :class='playModeIcon' @click='changePlayMode'></i>
                    <span class="title">{{playModeText}}</span>
                    <i class="iconfont icon-clear" @click='confirm'></i>
                </h2>
                <v-scroll class='playListScroll' ref='scroll'>
                    <transition-group tag='ul' name='playListItem'>
                        <li class="item" v-for='(item,index) of playList' :key='item.songid' ref='playListItem'
                            @click='selectItem(item,index)'>
                            <span class="item-playIcon">
                                <i class="iconfont" :class='playIcon(item)'></i>
                            </span>
                            <span class="item-text">{{item.songname}}</span>
                            <i class="iconfont"
                            :class='getFavoriteIcon(item)'
                            @click.stop='toggleFavorite(item)'></i>
                            <i class="iconfont icon-delete" @click.stop='deleteItem(item)'></i>
                        </li>
                    </transition-group>
                </v-scroll>
                <div class="playList-add" @click='addPlayList'>
                    <i class="iconfont icon-add"></i>
                    <span class="add-text">添加歌曲到队列</span>
                </div>
                <div class="playList-close" @click='hide'>关闭</div>
            </div>

            <v-addPlayList ref='addPlayList'></v-addPlayList>
            <v-confirm :text='text' ref='confirm' @clear='clear'></v-confirm>
        </div>
    </transition>
</template>

<script>
import Scroll from 'common/scroll/scroll'
import Confirm from 'common/confirm/confirm'
import AddPlayList from './components/addPlayList'
/* import {mapGetters} from 'vuex' */
import {playMode} from 'js/config'
import {playerMixin} from 'js/mixin'
import { mapActions } from 'vuex';

export default {
    mixins:[playerMixin],
    data() {
        return {
            playListShow: false,
            text:'是否清空播放列表'
        }
    },
    computed: {
       /*  playModeIcon() {
            return this.playMode === playMode.sequence? 'icon-sequence' : this.playMode === playMode.random ? 'icon-random' : 'icon-loop';
        }, */
        playModeText() {
            return this.playMode === playMode.sequence? '顺序播放' : this.playMode === playMode.random ? '随机播放' : '循环播放';
        },
       /*  ...mapGetters([
            'playMode'
        ]) */
    },
    methods: {
        show() {
            this.playListShow = true;

            setTimeout(() => {
                this.$refs.scroll.refresh();
                setTimeout(() => {
                    this._scrollToElement(this.curSong); //列表显示时，将播放歌曲滚动到显示区域的头部
                })
            },20)
        },
        hide() {
            this.playListShow = false;
        },
        /* changePlayMode() {

        } */
        confirm() {  //是否当前播放列表弹出框
            this.$refs.confirm.show();
        },
        clear() {  //弹出框清除列表
            this.clearPlayList(); 
            this.hide(); //清空后隐藏列表
        },
        playIcon(item) { //如果播放的歌曲和当前id相等，则返回playIcon图标
            return item.songid === this.curSong.songid ? 'icon-play' : '';
        },
        _scrollToElement(song) {
            let index = this.playList.findIndex(item => {
                return item.songid === song.songid;
            });
            this.$refs.scroll.scrollToElement(this.$refs.playListItem[index],300)
        },
        selectItem(item,index) { //点击列表中个歌曲
            if(this.playMode === playMode.random) { //如果是随机模式,就要获取点击歌曲在随机列表中的下标
                  index = this.playList.findIndex(song => {
                      return song.songid === item.songid 
                  })
            }
            this.setCurIndex(index);  //切换坐标，就是切换歌曲
            this.setPlaying(true);
        },
        deleteItem(item) {   //删除某一项列表
            this.deleteSong(item);
            if(!this.playList.length) {
                this.hide();
            }
        },
        addPlayList() {  //显示添加歌曲
            this.$refs.addPlayList.show();
        },
        ...mapActions([
            'deleteSong',
            'clearPlayList'
        ])
    },
    watch: {
        curSong(newSong,oldSong) {
            if(!this.playListShow || newSong.songid === oldSong.songid) {
                return;
            }
            this._scrollToElement(newSong); //列表显示时，将播放歌曲滚动到显示区域的头部
        }
    },
    components: {
        'v-scroll': Scroll,
        'v-confirm': Confirm,
        'v-addPlayList': AddPlayList
    }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable';
@import '~styles/mixin';

.playList-enter-active,
.playList-leave-active
    transition: all .3s
    .playList
        transition: all .3s
.playList-enter,
.playList-leave-to
    opacity: 0
    .playList
        transform: translate3d(0,100%,0) 

.playListItem-enter-active,
.playListItem-leave-active
    transition: all .3s
.playListItem-enter,
.playListItem-leave-to
    height: 0 !important

.playList-wrapper
    fixed();
    background: $color-background-d
    .playList
        position: absolute
        bottom: 0
        width: 100%
        color: $color-text-d
        background: $color-highlight-background
        font-size: $font-size-small
        .playList-header
            margin: 0 .4rem
            padding: .4rem 0
            flex-center()
            .modeIcon
                padding-right: .2rem
                font-size: .6rem
                color: $color-theme-d
            .title
                flex: 1
                font-size: $font-size-medium
        .playListScroll
            overflow: hidden
            max-height: 4.28rem
            .item
                overflow: hidden
                margin: 0 .4rem
                height: .8rem
                line-height: .8rem
                flex-center()
                .item-playIcon
                    width: .4rem
                    color: $color-theme-d
                    flex: 0 0 .4rem
                .item-text
                    flex: 1
                    no-wrap()
                .icon-not-favorite
                .icon-delete
                    color: $color-theme
                    padding-left: .3rem
        .playList-add
            width: 2.8rem
            margin: .4rem auto
            padding: .16rem 
            border: .02rem solid $color-text-l
            border-radius: 1rem
            color: $color-text-l
            flex-center()
            .icon-add
                font-size: .2rem
                padding-right: .1rem
        .playList-close
            height: 1rem
            line-height: 1rem
            background: $color-background
            text-align: center
            font-size: $font-size-medium-x 
            color: $color-text-l
</style>
