<template>
    <ul class="playTab">
        <li class="item" 
            :class='{"active":curIndex === index}'
            v-for='(item,index) of items'
            :key='index'
            @click='changeTabCurIndex(index)'>{{item}}</li>
    </ul>
</template>

<script>
export default {
    props: {
        items :{
            type: Array,
            default: () => []
        },
        curIndex: {
            type: Number,
            default: 0
        }
    },
    methods: {
        changeTabCurIndex(index) {
            this.$emit('changeTabCurIndex',index);
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable';
@import '~styles/mixin';

.playTab
    width: 4.8rem
    margin: 0 auto
    background: $color-background
    border: .02rem solid $color-highlight-background
    border-radius: .2rem
    flex-center()
    .item
        flex: 1
        height: .6rem
        line-height: .6rem
        text-align: center
        font-size: $font-size-medium
        color: $color-text-d
        &.active
            background: $color-highlight-background
            color: $color-text-ll
</style>



