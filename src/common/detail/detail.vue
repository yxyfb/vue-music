<template>
    <div class="detail">
        <div class="detail-header">
            <i class="iconfont icon-back" @click='back'></i>
            <h1 class="detail-title">{{title}}</h1>
        </div>
        <div class="detail-bgImg" :style='bgImg' ref='bgImage'>
            <div class="filter"></div>
            <div class="play-wrapper" ref='playBtn'>
                <div class="play" @click='randomPlay'>
                    <i class="iconfont icon-play"></i>
                    <span class="play-text">随机播放全部</span>
                </div>
            </div>
        </div>

        <div class="layer" ref='layer'></div>

        <v-scroll class="songList-wrapper"
                  :data='songs'
                  :listenScroll='true'
                  :probeType='3'
                  @scroll="scroll"
                  ref='scroll'>
            <v-songList :songs='songs' @playMusic='playMusic' :iconShow='iconShow'></v-songList>
        </v-scroll>
        <div class="loading-wrapper" v-show='!songs.length'>
            <v-loading></v-loading>
        </div>
    </div>
</template>

<script>
//主要原理，根据图片高度动态设置scroll距离顶部的高度

import SongList from 'common/songList/songList'
import Scroll from 'common/scroll/scroll'
import Loading from 'common/loading/loading'
import {prefixStyle} from 'js/dom'
import {mapActions,mapMutations} from 'vuex'
import {playListMixin} from 'js/mixin'

const transform = prefixStyle('transform');//兼容性

export default {
    mixins:[playListMixin],
    data() {
        return {
            scrollY: 0 
        }
    },
    mounted() {
        this.headerH = 0.88 * parseFloat(document.documentElement.style.fontSize);
        this.$refs.scroll.$el.style.top = this.$refs.bgImage.clientHeight+'px';
        this.MaxLayerHeight = -1*(this.$refs.bgImage.clientHeight - this.headerH);  //遮罩层滚动的最大距离
    },
    props: {
        bgImage: {
            type: String,
            default:''
        },
        title: {
            type: String,
            default: ''
        },
        songs: {
            type: Array,
            default:() => []
        },
        iconShow: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        back() {
            this.$router.back();
        },
        scroll(pos) { //scroll组件触发的事件，获取滚动高度
            this.scrollY = pos.y;
        },
        playMusic(song,index) {
            this.selectMusic({ //vuex中acrions,一次提交多个数据
                list: this.songs,  //歌曲列表
                index: index       //正在播放歌曲下标
            })
        },
        changeListBottom(playList) { //混入，当播放列表有值时增加底部的padding
            const bottom = playList.length > 0 ? '1.2rem' : 0;
            this.$refs.scroll.$el.style.bottom = bottom;
            this.$refs.scroll.refresh();
        },
        randomPlay() {  //随机播放全部
            this.randomPlayAll(this.songs);
        },
        ...mapActions([
            'selectMusic',
            'randomPlayAll'
        ])
    },
    watch: {
        scrollY(newY) {
            const maxLayerH = Math.max(this.MaxLayerHeight,newY); //获取遮罩层的位移
            this.$refs.layer.style[transform] = `translate3d(0,${maxLayerH}px,0)`;

            if(newY <= this.MaxLayerHeight){  //图层高度缩小，层级高于layer，低于header
                this.$refs.bgImage.style.paddingTop = 0;
                this.$refs.bgImage.style.height = 0.88 + 'rem';
                this.$refs.bgImage.style.zIndex = 9;  
                this.$refs.playBtn.style.display = 'none';
            } else {
                this.$refs.bgImage.style.paddingTop = 70 + '%';
                this.$refs.bgImage.style.height =0;
                this.$refs.bgImage.style.zIndex = 0;  
                this.$refs.playBtn.style.display = 'block';
            }
            
            if(newY > 0) {
                let scaleNum = 1 + Math.abs(newY / this.$refs.bgImage.clientHeight);
                this.$refs.bgImage.style[transform] = `scale(${scaleNum})`
            }
        }
    },
    computed: {
        bgImg() {
            return `background-image:url('${this.bgImage}')`;
        }
    },
    components: {
        'v-songList': SongList,
        'v-scroll': Scroll,
        'v-loading': Loading
    }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable';
@import '~styles/mixin';

.detail
    absolute()
    .detail-header
        position: absolute
        top: 0
        width: 100%
        height: .88rem
        z-index:10
        .iconfont
            position: absolute
            width: .88rem
            height: .88rem
            line-height: .88rem
            text-align:center
            color: $color-theme
            font-size: $font-size-large-x
        .detail-title
            height: .88rem
            line-height: .88rem
            text-align: center
            font-size: $font-size-large
            color: $color-text
    .detail-bgImg
        position: relative
        top: 0
        width: 100%
        height: 0
        padding-top: 70%
        background-size: 100%
        transform-origin: center 0
        .play-wrapper
            position: absolute
            width: 100%
            bottom: .4rem
            .play
                width: 2.7rem
                margin: 0 auto
                padding: .14rem 0 
                color: $color-theme
                border: .02rem solid $color-theme
                border-radius: 2rem
                flex-center()
                .play-text
                    padding-left: .1rem
                    font-size: $font-size-small
        .filter
            absolute()
            background: rgba(7,17,27,.4)
    .songList-wrapper
        position: absolute
        bottom: 0
        width: 100%
    .layer
        position: relative
        height: 100%
        background: $color-background
        transform: translate3d(0, 0, 0);
    .loading-wrapper
        position: absolute
        top: 5.26rem
        bottom: 0
        width: 100%
        background: $color-background
</style>

