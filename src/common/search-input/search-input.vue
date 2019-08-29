<template>
    <div class="search-input">
        <i class="iconfont icon-search"></i>
        <input type="text" :placeholder="placeholder" class='input' v-model="inputText" ref='input'>
        <i class="iconfont icon-dismiss" v-show='inputText' @click='clear'></i>
    </div>
</template>

<script>
import {debounce} from 'js/util';

export default {
    data() {
        return {
            inputText: ''
        }
    },
    created(){
        this.$watch('inputText',debounce((newInputText) => { //与wacth监听一个道理，监听值的改变触发事件
                this.$emit('changeInputText',newInputText)
            }) 
        )
    },
    props: {
        placeholder: {
            type: String,
            default: '搜索歌曲、歌手'
        }
    },
    methods: {
        clear() {
            this.inputText = ''
        },
        setInputText(text) {  //外部设置input框的值
            this.inputText = text;
        },
        blur() { //失焦，手机键盘消失
            this.$refs.input.blur();
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable';
@import '~styles/mixin';

.search-input
    flex-center()
    margin: 0 .4rem
    padding: 0 .12rem
    height: .8rem
    background: $color-highlight-background
    border-radius: .1rem
    .iconfont
        color: $color-background
        &.icon-search
            font-size: .48rem
        &.icon-dismiss
            font-size: .32rem
    .input
        flex: 1
        margin: 0 .12rem
        background: $color-highlight-background
        color: $color-text
</style>

