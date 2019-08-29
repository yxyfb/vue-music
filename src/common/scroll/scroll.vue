<template>
    <div ref="wrapper">
        <slot></slot>
    </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
    props: {
        probeType: {   //有时候我们需要知道滚动的位置,为2时，会实时派发滚动事件
            type: Number,
            default: 0
        },
        click: {  //阻止原生click事件
            type: Boolean,
            default: true
        },
        listenScroll: { //是否开启   滚动就触发事件
            type: Boolean,
            default:false
        },
        data: {
            type: [Array,Object,String]
        },
        pullUp: {//是否开启   上拉刷新
            type: Boolean,
            default: false
        },
        beforeScroll: {   //是否开启开始滚动，就触发
            type: Boolean,
            default: false
        }
    },
    created() {
        setTimeout(() => {
            this._initSroll();
        },20)
    },
    methods: {
        _initSroll() {
            if(!this.$refs.wrapper) {
                return;
            }

            this.scroll = new BScroll(this.$refs.wrapper,{
                probeType: this.probeType,
                click: this.click
            })

            if(this.listenScroll) {//scroll触发的时机取决于probeType
                this.scroll.on('scroll',(pos) => {
                    this.$emit('scroll',pos);
                })
            }

            if(this.pullUp) {//开启上拉刷新
                this.scroll.on('scrollEnd',() => {
                    if(this.scroll.y < this.scroll.maxScrollY+50){
                        this.$emit('scrollEnd');
                    }
                })
            }

            if(this.beforeScroll) {//一开始滚动，就触发
                this.scroll.on('beforeScrollStart',() => {
                    this.$emit('beforeScrollStart');
                })
            }
        },
        refresh() { //刷新better-scroll
            this.scroll && this.scroll.refresh();
        },
        scrollTo() {//将传递进来的参数，用在this.scroll上，arguments是有值的，它的值就是我们传递进去的参数，是类数组结构
            this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments);
        },
        scrollToElement() {
            this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments);
        }
    },
    watch: {
        data() {  //只要数据变化，就刷新scroll
            setTimeout(() => {
                this.refresh();
            },20);
        }
    }
}
</script>

<style lang="stylus" scoped>

</style>
