<template>
    <div class="progress-bar" ref='progressBar' @click='changeProgress'>
         <div class="line">
            <div class="progress" ref='progress'></div>
            <div class="lineBar-wrapper" ref='bar'
                 @touchstart='ontouchstart'
                 @touchmove='ontouchmove'
                 @touchend='ontouchend'>
                <div class="lineBar"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        speed: {
            type: Number,
            default: 0
        }
    },
    created() {
        this.touch = {};  //仅存放数据
    },
    methods: {
        changeProgress(e){ //点击进度条
            const speed = (e.pageX - this.$refs.progressBar.offsetLeft) / this.$refs.progressBar.clientWidth;
            this.curProgress(speed*100);  //更新进度条
            this.$emit('touchend',speed);  //更新音乐
        },
        curProgress(newspeed) { //更新进度条
            this.$refs.progress.style.width = newspeed + '%';
            this.$refs.bar.style.left = newspeed + '%';
        },
        ontouchstart(e) {
            this.touch.flag = true;
            this.touch.startX = e.touches[0].pageX;
            this.touch.progressWidth = this.$refs.progress.clientWidth; //当前黄色条子长度
            this.touch.progressBarWidth = this.$refs.progressBar.clientWidth; //灰色进度条长度
        },
        ontouchmove(e) {
            if(this.touch.flag) {
                let touchmove = e.touches[0].pageX - this.touch.startX;
                this.moveWidth = Math.min(this.$refs.progressBar.clientWidth,Math.max(0,this.touch.progressWidth + touchmove));               
                this.curProgress(this.moveWidth / this.touch.progressBarWidth * 100);
                this.$emit('changeTime', this.moveWidth / this.touch.progressBarWidth);
            }
        },
        ontouchend() {
            this.touch.flag = false;
            const speed = this.moveWidth / this.touch.progressBarWidth;  //拖动结束时的比例传出去，由audio控制时间
            this.$emit('touchend',speed);
        }
    },
    watch: {
        speed(newspeed) {
            if(!this.touch.flag) { //只有不是拖动状态，才根据时间，更新进度，相反，是拖动状态时，播放音乐不会更新进度条
                this.curProgress(newspeed);
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable';
@import '~styles/mixin';

.progress-bar
    padding: .2rem 0
    .line
        position: relative
        height: .08rem
        background: $color-dialog-background
        .progress
            position: absolute
            top: 0
            left: 0
            width: 0
            height: 100%
            background: $color-theme
        .lineBar-wrapper
            position: absolute
            top: -0.26rem
            left: 0
            width: .6rem
            height: .6rem
            transform: translateX(-0.3rem)
            .lineBar
                position: relative
                top: .14rem
                left: .14rem
                width: .32rem
                height: .32rem
                border: .06rem solid #fff
                border-radius: 50%
                box-sizing:border-box
                background: $color-theme
</style>

