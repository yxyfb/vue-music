<template>
    <div class="g-header">
        <div class="icon"></div>
        <h1 class="text">Chicken Music</h1>
        <router-link tag='div' class="mineIcon" to='/user'>
            <i class="iconfont icon-mine"></i>
        </router-link>
    </div>
</template>

<script>
export default {
}
</script>

<style lang="stylus" scoped>
@import '~styles/mixin';
@import '~styles/variable';

.g-header
    position: relative
    text-align: center
    font-size: 0
    color: $color-theme
    .icon
        display: inline-block
        width: .6rem
        height: .64rem
        margin-top: .12rem
        vertical-align: top
        bg-image('logo')
        background-size: 100%
    .text
        display: inline-block
        line-height: .88rem
        font-size: $font-size-large
        margin-left: .2rem
    .mineIcon
        position: absolute
        top: 0
        right: 0
        width: .88rem
        height: .88rem
        font-size: .4rem
        flex-center()
</style>
