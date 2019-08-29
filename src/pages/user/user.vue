<template>
   <transition name='user'>
        <div class="user">
            <div class="user-header">
                <div class="backIcon" @click='back'>
                    <i class="iconfont icon-back"></i>
                </div>
                <v-playTab :items='items' :curIndex='curIndex' @changeTabCurIndex='changeTabCurIndex'></v-playTab>
            </div>
            <div class="play-wrapper" ref='playBtn'>
                <div class="play" @click='randomPlay'>
                    <i class="iconfont icon-play"></i>
                    <span class="play-text">随机播放全部</span>
                </div>
            </div>
            
            <div class="user-content" ref='userContent'>
                <v-scroll ref='listenScroll' class='listenList-scroll' v-show='curIndex === 1'>
                    <v-songList :songs='playingSongs' @playMusic='playMusic'></v-songList>
                </v-scroll>
                <v-scroll ref='likeScroll' class='like-scroll' v-show='curIndex === 0'>
                    <v-songList :songs='likeList' @playMusic='playMusic'></v-songList>
                </v-scroll>
            </div>
        </div>
   </transition>
</template>

<script>
import playTab from 'common/playTab/playTab'
import songList from 'common/songList/songList'
import Scroll from 'common/scroll/scroll'
import {mapGetters,mapActions} from 'vuex'
import {playListMixin} from 'js/mixin'

export default {
    mixins:[playListMixin],
    data() {
        return {
            items: ['我喜欢的','最近听的'],
            curIndex: 0
        }
    },
    computed: {
        ...mapGetters([
            'playingSongs',
            'likeList'
        ])
    },
    methods: {
        back() {
            this.$router.back();
        },
        changeTabCurIndex(index) {
            this.curIndex = index;
        },
        playMusic(song) {
            this.insertSong(song);
        },
        randomPlay() {
            if(this.curIndex === 1) {
                this.randomPlayAll(this.playingSongs)
            }else {
                this.randomPlayAll(this.likeList)
            }
        },
        changeListBottom(list) {
            const bottom = list.length > 0? '1.2rem' : 0;
            this.$refs.userContent.style.bottom = bottom;
            this.$refs.listenScroll.refresh();
        },
        ...mapActions([
            'insertSong',
            'randomPlayAll'
        ])
    },
    watch: {
        curIndex(newIndex) {
            setTimeout(() => {
                if(newIndex === 1) {
                    this.$refs.listenScroll.refresh();
                } else {
                    this.$refs.likeScroll.refresh();
                }
            },20)
        }
    },
    components: {
        'v-playTab': playTab,
        'v-songList': songList,
        'v-scroll': Scroll
    }    
}
</script>

<style lang="stylus" scoped>
@import '~styles/mixin';
@import '~styles/variable';

.user-enter-active,
.user-leave-active
    transition: all .3s
.user-enter,
.user-leave-to
    transform: translate3d(100%,0,0)

.user
    overflow: hidden
    fixed()
    background: $color-background
    .user-header
        position: relative
        margin: .2rem 0 .6rem 0
        .backIcon
            position: absolute
            top: 0
            left: 0
            width: .64rem
            height: .64rem
            flex-center()
            font-size: .44rem
            color: $color-theme
    .play-wrapper
        .play
            width: 2.7rem
            margin: 0 auto
            padding: .14rem 0 
            color: $color-text-l
            border: .02rem solid $color-text-l
            border-radius: 2rem
            flex-center()
            .play-text
                padding-left: .1rem
                font-size: $font-size-small
    .user-content
        position: absolute
        top: 2.04rem
        bottom: 0
        width: 100%
        .listenList-scroll,
        .like-scroll
            overflow: hidden
            position: absolute
            height: 100%
            width: 100%
</style>
