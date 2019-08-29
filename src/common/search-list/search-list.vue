<template>
    <v-scroll class="listScroll"
              :data='list'
              :pullUp='true'
              :beforeScroll='true'
              @scrollEnd='scrollEnd'
              @beforeScrollStart='beforeScrollStart'>
        <ul class='search-list'>
            <li class="item" v-for='(item,index) of list' :key='index'
                @click='selectItem(item)'>
                <i class="iconfont" :class='getIconCls(item)'></i>
                <div class="item-name">{{getName(item)}}</div>
            </li>
            <li class="item" v-show='flag'>
                <v-loading></v-loading>
            </li>
            <li class="item" v-show='!flag'>
                没有更多的数据
            </li>
        </ul>
    </v-scroll>
</template>

<script>
import Scroll from 'common/scroll/scroll'
import Loading from 'common/loading/loading'
import {getSearchList} from 'api/getSearchList'
import {createSong,getsingerName} from 'js/song'
import Singer from 'js/singer'
import {mapMutations,mapActions} from 'vuex'

const TYPE_SINGER = 'singer'
const PAGENUM = 20;  //每页获取的数据个数

export default {
    data() {
        return {
            list: [],
            page: null,
            zhida: true,
            text: '',
            flag: false  //获取数据标志位
        }
    },
    props: {
        inputText: {
            type: String,
            default: ''
        },
        showSinger: { //是否开启搜索歌手页面
            type: Boolean,
            default: true
        }
    },
    watch: {
        inputText(text) {
            this.getData(text);
            this.text = text;
        }
    },
    methods: {
        getData(text) {
            this.page = 1 ; //每次获取数据，都是从第一页开始获取
            
            this.flag = true;  //标志位，可以请求
            getSearchList(text,this.zhida,this.page,PAGENUM).then(res => {
                if(res) {console.log(res)
                    this.list = this.initData(res);console.log(this.list);
                    this._noData(res);//标志位，是否还可以获取
                }
            })
        },
        initData(data) {
            let ret = [];
            if(this.showSinger) {  //开启获取歌手名字
                if(data.zhida && data.zhida.singerid) {
                    ret.push({...data.zhida,...{type:TYPE_SINGER}});//将data.zhida对象，和新添加个type属性，放入ret数组第一个
                }
                if(data.song) { //如果歌曲列表存在
                    ret = ret.concat(data.song.list);
                }

            } else { //没有开启获取歌手名字
                if(data.song) { //如果歌曲列表存在
                    ret = data.song.list;
                }
            }

            return ret;
        },
        getIconCls(item) { //获取歌手和歌曲的icon
            if(item.type === TYPE_SINGER) {  //歌手才有type
                return 'icon-mine';
            } else {
                return 'icon-music';
            }
        },
        getName(item) {
            if(item.type === TYPE_SINGER) {  //歌手才有type
                return item.singername;
            } else {
                return item.songname+'-'+getsingerName(item.singer);
            }
        },
        selectItem(item) { //点击列表选项
            if(item.type === TYPE_SINGER) {
                const singer = new Singer({
                    mid: item.singermid,
                    name: item.singername
                });
                this.$router.push({    //路由跳转页面
                    path:`/search/${singer.mid}`
                });
                this.setSinger(singer);//存入vuex，触发歌手详情页展示
            } else {
                if(item.songmid && item.albummid) { //插入当前歌单并播放
                    this.insertSong(createSong(item));
                }
            }

            //只要点击了，都会存入搜索历史中
            this.$emit('joinHistory');
        },
        scrollEnd() { //滚动停止并到达位置触发，增加数据
            if(this.flag === false) {  //如果标志位false，则不再获取数据
                return;
            }
            this.page++;
            getSearchList(this.text,this.zhida,this.page,PAGENUM).then(res => {
                if(res) {
                    let newList = this.initData(res);
                    if(newList.length > PAGENUM) { //再次获取如果大于20，则说明又获取到了歌手，则删除
                        newList = newList.slice(1); 
                    } 
                    this.list = this.list.concat(newList);
                    this._noData(res);//标志位，是否还可以获取
                }
            })
        },
        _noData(data) { //没有数据时
            let songs = data.song;
            //如果列表数据不存在或列表歌曲数量大于总数
            if(!songs.list.length || this.list.length >= songs.totalnum) {
                this.flag = false;
            }
        },
        beforeScrollStart() { //开始滚动前，失焦
            this.$emit('beforeScrollStart');
        },
        ...mapMutations({
            setSinger: 'SET_SINGER'
        }),
        ...mapActions([
            'insertSong'
        ])
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

.listScroll
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .search-list
        margin: 0 .6rem
        color: $color-text-d
        .item
            flex-center()
            padding-bottom: .4rem
            .iconfont
                padding-right: .32rem
            .item-name
                flex: 1
</style>