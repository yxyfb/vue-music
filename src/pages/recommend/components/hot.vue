<template>
    <div class="hot">
        <h2 class="hot-title">热门歌单推荐</h2>
        <ul class="hot-content" v-if='lists.length>0'>
            <li class="hot-item" 
                v-for='list of lists'
                :key='list.dissid'
                @click='goSongSheet(list)'>
                <div class="item-pic">
                    <img v-lazy="list.imgurl">
                </div>
                <div class="item-info">
                    <h3 class="item-title">{{list.creator.name}}</h3>
                    <p class="item-text">{{list.dissname}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import {getRecommendHot} from 'api/getRecommendHot'
import {mapMutations} from 'vuex'

export default {
    data() {
        return {
            lists:[]
        }
    },
    created() {
        this._getData();
    },
    methods: {
        _getData() {
            getRecommendHot().then(res => {
                if(res) {
                    this.lists = res;
                }
            });
        },
        goSongSheet(item) {  //跳转歌单
            this.setSongsheet(item); //将歌单数据存入vuex

            this.$router.push({
                path:`/recommend/${item.dissid}`
            });
        },
        ...mapMutations({
            setSongsheet:'SET_SONG_SHEET'
        })
    }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable';
@import '~styles/mixin';
.hot
    width: 100%
    height: 100%
    .hot-title
        height: 1.3rem
        line-height: 1.3rem
        text-align: center
        color: $color-theme
    .hot-content
        width: 100%
        .hot-item
            padding: 0 .4rem .4rem
            flex-center()
            .item-pic
                width: 1.2rem
                height: 1.2rem
                padding-right: .4rem
                img 
                    width: 100%
            .item-info
                overflow: hidden
                flex: 1
                height: 1rem
                line-height: .4rem
                .item-title
                    margin-bottom: .2rem
                    no-wrap()
                .item-text
                    color: $color-text-l
                    no-wrap()

</style>
