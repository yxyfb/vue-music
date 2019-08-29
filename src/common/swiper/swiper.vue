<template>
    <swiper :options="swiperOption" ref="mySwiper">
        <!-- slides -->
        <slot></slot>
        <!-- Optional controls -->
        <div class="swiper-pagination"  slot="pagination"></div>
  </swiper>
</template>

<script>
export default {
    props: {
        pagination: {
            type:String,
            default: '.swiper-pagination'
        },
        loop: {
            type: Boolean,
            default: true
        },
        autoplay: {
            type: Boolean,
            default: false
        }
    },
    created() {
        this._initSwiper();
    },
    methods: {
        _initSwiper() {
            this.swiperOption = {
                direction: 'horizontal', // 垂直切换选项
                loop: this.loop, // 循环模式选项  
                autoHeight:true,
                setWrapperSize :true, 
                autoplay: this.autoplay,           
                // 如果需要分页器
                pagination: {
                    el: this.pagination
                }
            }     
        }
    }
}
</script>

<style lang="stylus">
@import '~styles/variable';

.swiper-pagination-bullet
    width: .16rem
    height: .16rem
    background: $color-text-l
    border-radius: 100%
    &.swiper-pagination-bullet-active
        width: .4rem
        border-radius: .1rem
</style>
