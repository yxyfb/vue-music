<template>
    <div class="hot-search">
        <h2 class="hot-title">热门搜索</h2>
        <ul>
            <li class="item" v-for='item of hotkey' :key='item.n'
                @click='setInputText(item.k)'>{{item.k}}</li>
        </ul>
    </div>
</template>

<script>
import {getHotSearch} from 'api/getHotSearch'

export default {
    data() {
        return {
            hotkey: []
        }
    },
    created() {
        this.getData();
    },
    methods: {
        getData() { 
            getHotSearch().then(res => {
                if(res) {
                    this.hotkey = res.slice(0,10);
                }
            })
        },
        setInputText(text) { //点击热门搜索，设置input框值
            this.$emit('setInputText',text);
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable';

.hot-search
    margin: 0 .4rem
    font-size: 0
    .hot-title
        margin-bottom: .4rem
        font-size: $font-size-medium
    .item
        display: inline-block
        font-size: $font-size-medium
        padding: .1rem .2rem
        margin: 0 .4rem .2rem 0
        background: $color-highlight-background
        border-radius: .1rem
        color: $color-text-d
</style>

