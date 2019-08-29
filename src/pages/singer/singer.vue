<template>
    <div class="singer">
        <v-singerList :singerList='singerList'></v-singerList>

        <router-view></router-view>
    </div>
</template>

<script>
import singerList from './components/singerList'
import {getSinger} from 'api/getSinger'
import Singer from 'js/singer'   //实例化

const HOT_TITLE = '热门';
const HOT_NUMBER = 10;

export default {
    name:'singer',
      data() {
        return {
            singerList:[]
        }
    },
    created() {
        this._getData();
    },
    methods: {
        _getData() { //获取数据
            getSinger().then(res => {
                this.singerList = this._initData(res.list);console.log(this.singerList);
            })
        },
        _initData(data) { //整理数据
            let map = {
                hot:{
                    title: HOT_TITLE,
                    items: []
                }
            };
             //1.先分组
            data.forEach((item,index) => {
                //前10个的热门歌手数据放入
                if(index < HOT_NUMBER) {
                    map.hot.items.push(new Singer({  //这里实例化，是复用，简写的目的
                        mid: item.Fsinger_mid,
                        name: item.Fsinger_name,
                    }))
                }
                //根据每个歌手的Findex值(ABC..)，分组
                const key = item.Findex;
                if(!map[key]) {
                    map[key] = {
                        title: key,
                        items:[]
                    }
                }
                map[key].items.push(new Singer({
                    mid: item.Fsinger_mid,
                    name: item.Fsinger_name,
                }))
            });
            
            //2.在排序
            let hot = [];  //存热门
            let ret = [];  //存A-Z
            for(let key in map) {
                let val = map[key];
                if(val.title.match(/[a-zA-Z]/)) {  //str.match(pattern)  返回布尔值
                    ret.push(val);
                } else if (val.title === HOT_TITLE) {
                    hot.push(val);
                }
            }
            ret.sort((a,b) => {
                return a.title.charCodeAt(a) - b.title.charCodeAt(b) ;  //根据Unicode编码，排序，a-b为升序
            })

            return hot.concat(ret);
        }
    },
    components: {
        'v-singerList': singerList
    }
}
</script>

<style lang="stylus" scoped>
@import '~styles/mixin';

.singer
    overflow: hidden
    absoluteTop()
</style>
