<template>
    <div class="loading">
        <img width='24' height='24' src="./loading.gif">
        <span class="loading-text">{{loadingText}}</span>
    </div>
</template>

<script>
export default {
    props: {
        loadingText: {
            type: String,
            default:'正在加载中'
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable';
@import '~styles/mixin';

.loading
    width: 100%
    height: 100%
    flex-center()
    color: $color-text-d
</style>
