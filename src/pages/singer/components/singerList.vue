<template>
    <v-scroll class="singerList" v-if='singerList.length>0'
              :probeType='3'
              :listenScroll='true'
              :click='false'
              @scroll='scroll'
              ref='scroll'>
    <!-- scroll插件只作用于第一个元素 -->
        <ul>
            <li class="list-group" v-for='list of singerList'
                :key='list.title'
                ref='listGroup'>
                <h3 class="list-group-title">{{list.title}}</h3>
                <ul>
                    <li class="list-group-item" v-for='item of list.items'
                        :key='item.mid'
                        @click='goSingerDetail(item)'>
                        <img v-lazy="item.avatar" class="avatar">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>

        <ul class="scroll-bar" 
            v-if='scrollBarData'
            @touchstart.prevent='onScrollBarTouchStart'
            @touchmove.stop.prevent='onScrollBarTouchMove'>
            <li class="bar-item" 
                v-for='(title,index) of scrollBarData'
                :key='index'
                :class="{'curbar':index === curIndex}"
                :data-index='index'>{{title}}</li>
        </ul>

        <div class="fixed-list" ref='fixedList'>
            <h3 class='fixed-title'>{{fixedText}}</h3>
        </div>

        
    </v-scroll>
</template>

<script>
/* 大致思路：bar可以控制页面的滚动，页面的滚动获取curIndex,curIndex就可以控制bar的高亮 */


import Scroll from 'common/scroll/scroll'
import {getDataIndex,prefixStyle} from 'js/dom'
import {mapMutations} from 'vuex'
import {playListMixin} from 'js/mixin'

const BAR_HEIGHT = 0.36;  //bar每行的高度
const transform = prefixStyle('transform');//兼容性

export default {
    mixins:[playListMixin],
    data() {
        return {
            curIndex: 0,
            scrollY: 0,
            diff: -1   //每个group的下限，与滚动之间的距离
        }
    },
    created(){
        this.touch = {};
        this.scrollBarList_height = BAR_HEIGHT * parseFloat(document.documentElement.style.fontSize);
        this.scroll_title_height =  0.6*parseFloat(document.documentElement.style.fontSize);
        this.groupHeightArr = []; //存放每一组的高度
    },
    props: {
        singerList: {
            type: Array,
            default: []
        }
    },
    methods: {
        onScrollBarTouchStart(e) {
            let barItemIndex = parseInt(getDataIndex(e.target,'index')); //通过事件捕获，获取当前子元素的data-index值
            
            let firstTouch = e.touches[0];
            this.touch.y1 = firstTouch.pageY;  
            this.touch.initIndex = barItemIndex;
           
            this._scrollToElement(barItemIndex);
        },
        onScrollBarTouchMove(e) {
            this.touch.y2 = e.touches[0].pageY;  //移动的位置
            let moveIndex = (this.touch.y2 - this.touch.y1) / this.scrollBarList_height;//移动了几个barList
            let lastIndex = this.touch.initIndex+moveIndex;
            this._scrollToElement(lastIndex);
        },
         _scrollToElement(index) {
            this.$refs.scroll.scrollToElement(this.$refs.listGroup[index],0);
        },
        scroll(pos) {
            this.scrollY = pos.y;
        },
        _getGroupHeight() { //获取每个组的高度
            let list = this.$refs.listGroup;
            let h = 0;
            this.groupHeightArr.push(h);
            for(let i = 0; i < list.length-1; i++){
                h += list[i].offsetHeight;
                this.groupHeightArr.push(h);
            }
        },
        goSingerDetail(singer) {
            this.$router.push({
                path:`/singer/${singer.mid}`
            })
            this.setSinger(singer); //将歌手信息提交到vuex
        },
        changeListBottom(playList) { //混入，当播放列表有值时增加底部的padding
            const bottom = playList.length > 0 ? '1.2rem' : 0;
            setTimeout(() => {
                this.$refs.scroll.$el.style.bottom = bottom;
                this.$refs.scroll.refresh();
            },1000)
        },
        ...mapMutations({
            setSinger:'SET_SINGER'
        })
    },
    watch: {
        singerList() {  //获取到数据，就把高度存入数组
            setTimeout(() => {  //dom加载完毕，再执行
                this._getGroupHeight();
            },20)
        },
        scrollY(newY){  //根据高度计算curIndex
            if(newY > 0) {
                this.$refs.fixedList.style.opacity = 0;
            }else {
                this.$refs.fixedList.style.opacity = 1;
            }
            let arr = this.groupHeightArr;
            for(let i =0; i<arr.length-1; i++) {
                let h1 = arr[i];
                let h2 = arr[i+1];
                if(Math.abs(newY) >= h1 && Math.abs(newY) <h2) { //'大于等于'至关重要,如果没有等于，点击bar跳转，curIndex始终少一位
                    this.curIndex = i;
                    this.diff = h2 + newY; //每个group的下限，与滚动之间的距离：h2是正数，newY是负整数，所以能算出之间的距离
                } else if (Math.abs(newY) > h2){  
                    this.curIndex = i+1;
                    this.$refs.fixedList.style[transform] = `translate3d(0,0,0)`;
                }
            }
        },
        diff(newDiff) {   //原理，滚动距离，与每个group下限        
            let fixedTop = (newDiff>0 && newDiff < this.scroll_title_height) ? newDiff-this.scroll_title_height : 0;
            this.$refs.fixedList.style[transform] = `translate3d(0,${fixedTop}px,0)`;
        }
    },
    computed: {
        scrollBarData() { //滚动条上都是单数
            return this.singerList.map(val => {
                return val.title.substr(0,1);
            })
        },
        fixedText() {
            if(this.scrollY > 0) {
                return '';
            }
            return this.singerList[this.curIndex] ? this.singerList[this.curIndex].title : ''
        }
    },
    components: {
        'v-scroll': Scroll
    }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable';
@import '~styles/mixin';

.singerList
    overflow: hidden
    position: fixed
    width: 100%
    top: 1.76rem
    bottom: 0
    .list-group
        padding-bottom: .4rem
        .list-group-title
            padding-left: .4rem
            height: .6rem
            line-height: .6rem
            color: $color-text-l
            font-size: $font-size-small
            background: $color-highlight-background
        .list-group-item
            font-size: 0
            padding: .4rem .6rem 0
            flex-center()
            .avatar
                width: 1rem
                height: 1rem
                border-radius: 100%
            .name
                flex: 1
                padding-left: .4rem
                font-size: $font-size-medium
                color: $color-text-l
    .scroll-bar
        position: absolute
        top: 50%
        right: 0
        transform:translate3d(0,-50%,0)
        width: .4rem
        padding: .4rem 0
        border-radius: .2rem
        background: $color-background-d
        text-align: center
        color: $color-text-l
        .bar-item
            padding: .04rem 0
            &.curbar
                color: $color-theme
    .fixed-list
        position: absolute
        top: 0
        width: 100%
        .fixed-title
            padding-left: .4rem
            width: 100%
            height: .6rem
            line-height: .6rem
            color: $color-text-l
            font-size: $font-size-small
            background: $color-highlight-background
            box-sizing: border-box
</style>