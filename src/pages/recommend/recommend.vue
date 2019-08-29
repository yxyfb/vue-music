<template>
   <div>
        <v-scroll class='scroll' ref='scroll'>
            <div class="recommend">
                <v-swiper v-if='sliders.length>0'>
                    <swiper-slide v-for='slider of sliders'
                                :key='slider.id'>
                        <a :href='slider.linkUrl' class='slider-link'>
                            <img :src="slider.picUrl" class="slider-pic">
                        </a>
                    </swiper-slide>
                </v-swiper>
                <div class="loading-wrapper" v-else>
                    <v-loading></v-loading>
                </div>

                <div class="hot-wrapper">
                    <v-hot></v-hot>
                </div>
            </div>
        </v-scroll>

        <router-view></router-view>
   </div>
</template>

<script>
import Swiper from 'common/swiper/swiper'
import Loading from 'common/loading/loading'
import Hot from './components/hot'
import Scroll from 'common/scroll/scroll'
import {getRecommendSlider} from 'api/getRecommend'
import {playListMixin} from 'js/mixin'

export default {
    mixins:[playListMixin],
    data() {
        return {
            sliders:[]
        }
    },
    created() {
        this._getData();
    },
    methods: {
        _getData() {
            getRecommendSlider().then(res => {
                if(res) {
                    this.sliders = res;
                }
            })
        },
        changeListBottom(playList) { //混入，当播放列表有值时增加底部的padding
            const bottom = playList.length > 0 ? '1.2rem' : 0;
            this.$refs.scroll.$el.style.bottom = bottom;
            this.$refs.scroll.refresh();
        },
    },
    components: {
        'v-swiper': Swiper,
        'v-loading': Loading,
        'v-hot': Hot,
        'v-scroll': Scroll
    }
}
</script>

<style lang="stylus" scoped>
@import '~styles/mixin';

.scroll
    overflow: hidden
    absoluteTop()
    .recommend
        position: relative
        .swiper-container
            height: 3rem
            overflow: hidden
            z-index: -1
            .slider-link
                display:block
                .slider-pic
                    width: 100%
                    height: 3rem
        .loading-wrapper
            position: absolute
            top:0
            width: 100%
            height: 3rem
            z-index: 1
</style>

