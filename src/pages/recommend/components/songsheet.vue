<template>
    <div class="songsheet">
        <v-detail :bgImage='songSheet.imgurl'
                  :title='songSheet.dissname'
                  :songs='songs'>
        </v-detail>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Detail from 'common/detail/detail'
import {getSongSheet} from 'api/getSongSheet'
import {createSongSheet} from 'js/song'

export default {
    data() {
        return {
            songs: []
        }
    },
    computed: {
        ...mapGetters([
            'songSheet'
        ])
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            if(!this.songSheet.dissid) { //如果没获取到歌单id，则返回推荐页面
                this.$router.push({
                    path:'/recommend'
                });
                return;
            }

            getSongSheet(this.songSheet.dissid).then(res => {
                if(res) {
                    this.songs = this.initData(res.songlist);
                    console.log(this.songs);
                }
            })
        },
        initData(lists) {
            let ret = [];
            lists.forEach(musicData => {
                if(musicData.mid && musicData.id) {
                    ret.push(createSongSheet(musicData));
                }
            })
            return ret;
        }
    },
    components: {
        'v-detail': Detail
    }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable';
@import '~styles/mixin';

.songsheet
    fixed()
    background: $color-background
</style>

