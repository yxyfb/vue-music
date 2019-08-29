<template>
    <transition name='confirm'>
        <div class="confirm-wrapper" v-show='confirmShow' @click.stop='cancel'>
            <div class="confirm">
                <p class="text">{{text}}</p>
                <div class="confirm-btn">
                    <div class="btn btn-left" @click.stop='cancel'>{{leftText}}</div>
                    <div class="btn btn-right" @click.stop='sure'>{{rightText}}</div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    data() {
        return {
            confirmShow: false
        }
    },
    props: {
        text: {
            type: String,
            default: '是否清空所有搜索历史'
        },
        leftText: {
            type: String,
            default: '取消'
        },
        rightText: {
            type: String,
            default: '清空'
        }
    },
    methods: {
        cancel() {
            this.hide();
        },
        sure() {
            this.hide();
            this.$emit('clear');
        },
        hide() {
            this.confirmShow = false;
        },
        show() {
            this.confirmShow = true;
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable';
@import '~styles/mixin';

@keyframes identifier {
    0% {
        transform:scale(0)
    }
    50% {
        transform:scale(1.1)
    }
    100% {
        transform:scale(1)
    }
}
.confirm-enter-active
    .confirm
        animation identifier .3s 
.confirm-leave-active
    .confirm
        animation identifier .3s  reverse

.confirm-enter-active,
.confirm-leave-active
    transition: opacity .3s
.confirm-enter,
.confirm-leave-to
    opacity: 0

.confirm-wrapper
    fixed()
    background: $color-background-d
    z-index: 100
    flex-center()
    text-align: center
    font-size: $font-size-large
    .confirm
        width: 5.4rem
        background: $color-highlight-background
        border-radius: .2rem
        .text
            padding: .38rem .3rem
            color: $color-text-ll
            border-bottom: .04rem solid $color-background-d
        .confirm-btn
            flex-center()
            .btn
                width: 50%
                padding: .2rem 0
                color: $color-text-l
                line-height: .44rem
                &.btn-left
                    border-right: .04rem solid $color-background-d
</style>
