<template>
    <div class="rank-wrapper" ref='rankWrapper'>
        <v-scroll class='scroll' :data='topList' ref='scroll'>
            <ul class="rank" v-show='topList.length>0'>
                <li class="rank-item" v-for='list of topList' :key='list.id'
                    @click='goRankDetail(list)'>
                    <div class="rank-pic">
                        <img :src="list.picUrl">
                    </div>
                    <ul class="rank-songs">
                        <li class="song-desc" v-for='(song,index) of list.songList' :key='index'>
                            <span>{{index}}</span>
                            <span class='song-name'>{{song.songname}} - {{song.singername}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
        </v-scroll>

        <div class="loading-wrapper" v-show='topList.length===0'>
            <v-loading></v-loading>
        </div>

        <router-view></router-view>
    </div>
</template>

<script>
import Scroll from 'common/scroll/scroll'
import {getRank} from 'api/getRank'
import Loading from 'common/loading/loading'
import {playListMixin} from 'js/mixin'
import {mapMutations} from 'vuex'

export default {
    mixins:[playListMixin],
    data() {
        return {
            topList: []
        }
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            getRank().then(topList => {
                if(topList) {
                    this.topList = topList;console.log(topList)
                }
            });
        },
        goRankDetail(item) { //跳转到排行榜详情页
            this.$router.push({
                path:`/rank/${item.id}`
            });

            this.setTopList(item); //将点击得到排行榜信息存入vuex
        },
        changeListBottom(playList) { //混入，当播放列表有值时增加底部的padding
            const bottom = playList.length > 0 ? '1.2rem' : 0;
            this.$refs.rankWrapper.style.bottom = bottom;
            this.$refs.scroll.refresh();
        },
        ...mapMutations({
            setTopList:'SET_TOP_LIST'
        })
    },
    components: {
        'v-scroll': Scroll,
        'v-loading': Loading
    }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable';
@import '~styles/mixin';

.rank-wrapper
    position: absolute
    top: 1.76rem
    bottom: 0
    width: 100%
    overflow: hidden
    .scroll
        absolute()
        .rank
            padding-bottom: .4rem
            .rank-item
                flex-center()
                margin: 0 .4rem
                padding-top: .4rem
                .rank-pic
                    flex: 0 0 2rem
                    width: 2rem
                    height: 2rem
                    img
                        width: 100%
                        height: 100%
                .rank-songs
                    overflow: hidden
                    padding: 0 .4rem
                    flex: 1
                    display: flex
                    flex-direction: column
                    justify-content: center
                    height: 2rem
                    font-size: $font-size-small
                    color: $color-text-l
                    background: $color-highlight-background
                    .song-desc
                        line-height: .52rem
                        no-wrap()
    .loading-wrapper
        absolute()
</style>
