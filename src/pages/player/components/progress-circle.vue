<template>
    <div class="progress-circle">
        <svg viewBox='0 0 100 100' version='1.1' xmlns="http://www.w3.org/2000/svg" class='svg'>
            <circle class='circle circle-bg' cx='50' cy='50' r='50' fill='transparent' />  <!-- 一个圆，内部填充色为透明 -->
             <!-- dasharray描边，dashoffset可控制描边结束位置以开始位置的距离  -->
            <circle class='circle circle-line' cx='50' cy='50' r='50' fill='transparent'
                    :stroke-dasharray='dasharray'
                    :stroke-dashoffset='dashoffset' /> 
        </svg>
        <slot></slot>
    </div>
</template>

<script>
/* 大值原理：黄色进度条描边，利用stroke-dashoffset属性可控制描边结束位置距开始位置的距离 */
export default {
    data() {
        return {
            dasharray:Math.PI * 100   //圆地周长，直径*π
        }
    },
    props: {
        speed: {  //当前时间所占百分比
            type: Number,
            default: 0
        }
    },
    computed: {
        dashoffset() {  //灰色条长度 ，灰色越短，黄色进度条越长
            return this.dasharray - this.dasharray*(this.speed/100);
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable';

.progress-circle
    position: relative
    .svg
        width: .65rem
        height: .65rem
        circle
            stroke-width: .16rem
            transform-origin: center
            &.circle-bg
                transform: scale(0.9) 
                stroke: $color-theme-d
            &.circle-line
                transform: scale(0.9) rotate(-90deg)
                stroke: $color-theme

</style>
