<template>
    <div class="rank-detail" v-if='songs'>
        <v-detail :iconShow='true'
                  :bgImage='songs[0].image'
                  :title='topInfo.ListName'
                  :songs='songs'></v-detail>
    </div>
</template>

<script>
import Detail from 'common/detail/detail'
import {getRankDetail} from 'api/getRankDetail'
import {mapGetters} from 'vuex'
import {createSong} from 'js/song'

export default {
    data() {
        return {
            songs: [],
            topInfo: {}
        }
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            if(!this.topList.id) {
                this.$router.push({
                    path:'/rank'
                });
            }
            getRankDetail(this.topList.id).then(res => {
                if(res) {
                    this.topInfo = res.topinfo;
                    this.songs = this.initData(res.songlist);console.log(this.songs)
                }
            })
        },
        initData(arr) {
            let ret = [];
            arr.forEach(musicData => {
                if(musicData.data.songmid && musicData.data.albummid) {
                    ret.push(createSong(musicData.data));
                }
            });
            return ret;
        }
    },
    computed: {
        ...mapGetters([
            'topList'
        ]) 
    },
    components: {
        'v-detail': Detail
    }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable';
@import '~styles/mixin';

.rank-detail
    fixed()
    background: $color-background
</style>

