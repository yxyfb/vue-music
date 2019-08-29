<template>
    <transition name='topSlider'>
        <div class="topSlider" v-show='topSliderShow' @click.stop='hide'>
            <slot></slot>
        </div>
    </transition>
</template>

<script>
export default {
    data() {
        return {
            topSliderShow: false
        }
    },
    methods: {
        hide() {
            this.topSliderShow = false;
        },
        show() {
            this.topSliderShow = true;

            this.timer && clearTimeout(this.timer);
            this.timer=setTimeout(() => {
                this.hide();
            },2000)
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~styles/mixin';

.topSlider-enter-active,
.topSlider-leave-active
    transition: all .3s
.topSlider-enter,
.topSlider-leave-to
    transform : translate3d(0,-100%,0)

.topSlider 
    position: fixed
    top: 0
    width: 100%
    padding: .36rem 0
    z-index: 500
    background: #666
    flex-center()
</style>
