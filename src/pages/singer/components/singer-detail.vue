<template>
    <transition name='slider' appear>
        <div class="singer-detail">
            <v-detail :title='title'
                    :bgImage='bgImage'
                    :songs='songs'>
            </v-detail>
        </div>
    </transition>
</template>

<script>
import Detail from 'common/detail/detail'
import {mapGetters} from 'vuex'
import {getSongs} from 'api/getSongs'
import {createSong} from 'js/song'   //重复添加对象，用实例化简化书写

export default {
    name:'singer-detail',
    data() {
        return {
            songs: []
        }
    },
    created() {
        setTimeout(() => {
            this._getData();
        },20)
    },
    methods: {
        _getData() {
            if(!this.singer.mid) {  //如果不存在，就返回singer页面
                this.$router.push({
                    path:'/singer'
                })
            }

            getSongs(this.singer.mid).then(res => {
                if(res) { 
                    this.songs = this._initData(res.list);  //将杂乱的数据整理在赋值
                }
            });
        },
        _initData(data) {
            let ret = []; 
            data.forEach(item => {
                let {musicData} = item;  //ES6写法，从item中获取musicData
                //第一个是可以播放歌曲的id,第二个是歌曲播放ID，最后一个是歌曲图片ID
                if(musicData.songid && musicData.songmid && musicData.albummid){
                    ret.push(createSong(musicData));
                }
            });console.log(ret);
            return ret;
        }
    },
    computed: {
        title() {
            return this.singer.name;
        },
        bgImage() {
            return this.singer.avatar;
        },
        ...mapGetters([
            'singer'  //歌手信息
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

.slider-enter-active,
.slider-leave-active
    transition: all .3s
.slider-enter,
.slider-leave-to
    transform: translate3d(100%,0,0) !important

.singer-detail
    overflow: hidden
    fixed()
    background: $color-background
</style>
