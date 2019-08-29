<template>
    <transition-group tag='ul' name='historyList' class='search-historyList'>
        <li class="item" v-for='item of historySearch' :key='item'
            @click='selectItem(item)'>
            <span class="item-text">{{item}}</span>
            <span class="iconfont icon-delete" @click.stop='removeItemHistory(item)'></span>
        </li>
    </transition-group>
</template>

<script>
export default {
    props: {
        historySearch: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        selectItem(item) {
            this.$emit('selectItem',item)
        },
        removeItemHistory(item) { 
            this.$emit('removeItemHistory',item)
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable';
@import '~styles/mixin';

.historyList-enter-active,
.historyList-leave-active
    transition: all .3s
.historyList-enter,
.historyList-leave-to
    height: 0 !important

.search-historyList
    .item
        overflow: hidden
        height: .8rem
        line-height: .8rem
        flex-center()
        .item-text
            flex: 1
            font-size: $font-size-medium-x
        .iconfont
            padding-right: .02rem
            font-size: $font-size-small
</style>
