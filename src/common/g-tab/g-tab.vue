<template>
    <ul class="g-tab">
        <router-link tag='li' class='g-tab-item' to='/recommend'>
            <span class="g-tab-text">推荐</span>
        </router-link>
        <router-link tag='li' class='g-tab-item' to='/singer'>
            <span class="g-tab-text">歌手</span>
        </router-link>
        <router-link tag='li' class='g-tab-item' to='/rank'>
            <span class="g-tab-text">排行</span>
        </router-link>
        <router-link tag='li' class='g-tab-item' to='/search'>
            <span class="g-tab-text">搜索</span>
        </router-link>
    </ul>
</template>

<script>
export default {
    
}
</script>

<style lang="stylus" scoped>
@import '~styles/mixin';
@import '~styles/variable';

.g-tab
    flex-center()
    .g-tab-item
        flex: 1
        line-height: .88rem
        color: $color-text-l
        text-align:center  
        &.router-link-active
            color: $color-theme
            .g-tab-text
                padding-bottom: .1rem
                border-bottom: .04rem solid $color-theme
</style>
