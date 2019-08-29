<template>
    <div class="player" v-if='playList.length>0'>
        <!-- 大播放器 -->
        <transition name='max'
                    @enter='enter'
                    @after-enter='afterEnter'
                    @leave='leave'
                    @after-leave='afterLeave'>
            <div class="maxPlayer" v-show='fullScreen'>
                <div class="maxPlayer-bgImg">
                    <img :src="curSong.image" class="bgImg">
                </div>
                <div class="maxPlayer-header">
                    <i class="iconfont icon-back" @click='goMinPlayer'></i>
                    <h1 class="maxPlayer-title">{{curSong.songname}}</h1>
                    <h3 class="maxPlayer-name">{{curSong.singer}}</h3>
                </div>
                <div class="maxPlayer-middle"
                     @touchstart.prevent='touchstart'
                     @touchmove.prevent='touchmove'
                     @touchend='touchend'>
                    <!-- 中间大图 -->
                    <div class="middle-l" ref='middle_l'>
                        <div class="cd-wrapper" ref='cdWrapper'>
                            <div class="cd" :class='imgRotate'><!-- 旋转类名 -->
                                <img :src="curSong.image" class="cd-Img">
                            </div>
                        </div>
                        <div class="play-lyric-wrapper">
                            <div class="play-lyric" v-if='curLineText'>{{curLineText}}</div>
                        </div>
                    </div>
                    <!-- 歌词 -->
                    <v-scroll class="middle-r" ref='scroll'
                              :data='curSongLyric && curSongLyric.lines'>
                        <div class="lyric-wrapper">
                            <ul class="lyric" v-if='curSongLyric'>
                                <li ref='lyricing'
                                    class="lyric-list" 
                                    v-for='(line,index) of curSongLyric.lines'
                                    :key='index'
                                    :class='{"activeLyric": curLineNum === index}'>{{line.txt}}</li>
                            </ul>
                        </div>
                    </v-scroll>
                </div>
                <div class="maxPlayer-footer">
                    <!-- 切换Bar -->
                    <div class="dot-wrapper">
                        <span class="dot" :class="{'active': currentDot === 'cd'}"></span>
                        <span class="dot" :class="{'active': currentDot === 'lyric'}"></span>
                    </div>
                    <!-- 进度条 -->
                    <div class="progress-wrapper">
                        <span class="start-time time">{{_getTime(curTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <v-progressBar :speed='speed' @touchend='progressTouchend' @changeTime='changeTime'></v-progressBar>
                        </div>
                        <span class="end-time time">{{_getTime(curSong.duration)}}</span>
                    </div>
                    <!-- 媒体按钮 -->
                    <div class="maxPlayer-btn">
                        <div class="icon i-left" @click='changePlayMode'>
                            <i class="iconfont" :class='playModeIcon'></i>
                        </div>
                        <div class="icon i-left" :class='errorCls' @click='prev'>
                            <i class="iconfont icon-prev"></i>
                        </div>
                        <div class="icon i-center" @click='togglePlaying'>
                            <i class="iconfont" :class='playingIcon'></i>
                        </div>
                        <div class="icon i-right" :class='errorCls' @click='next'>
                            <i class="iconfont icon-next"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="iconfont"
                               :class='getFavoriteIcon(curSong)'
                               @click='toggleFavorite(curSong)'></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!-- 小播放器 -->
        <div class="minPlayer" v-show='!fullScreen' @click='goMaxPlayer'>
            <div class="minPlayer-bgImg">
                <div class="cd-wrapper">
                    <div class="cd" :class='imgRotate'>
                        <img :src="curSong.image" class="cd-Img">
                    </div>
                </div>
            </div>
            <div class="minPlayer-desc">
                <h3 class="name">{{curSong.songname}}</h3>
                <p class="singer">{{curSong.singer}}</p>
            </div>
            <div class="icon">
                <v-progressCircle :speed='speed'>
                    <i class="iconfont" :class='playingIcon' @click.stop='togglePlaying'></i>
                </v-progressCircle>
            </div>
            <div class="icon">
                <div class="iconfont icon-playlist" @click.stop='goPlayList'></div>
            </div>
        </div>

        <!-- 播放 -->
        <audio ref='audio'
               :src='playUrl'
               @timeupdate="timeUpDate"
               @play='ready'
               @ended='playEnd'
               @error="playError"></audio>
        
        <v-playList ref='playList'></v-playList>
    </div>
</template>

<script>
import Scroll from 'common/scroll/scroll'
import ProgressBar from './components/progress-bar';
import ProgressCircle from './components/progress-circle'
import PlayList from 'pages/playList/playList'
import {mapGetters,mapMutations,mapActions} from 'vuex';
import {getSongVkey} from 'api/getSongVkey';
import animations from 'create-keyframe-animation'  //引入JS实现CSS3动画效果包
import {playMode} from 'js/config'   //播放模式标志位 
/*import {shuffle} from 'js/util'  //洗牌  */
import {prefixStyle} from 'js/dom'
import {getLyric} from 'api/getLyric'
import Lyric from 'lyric-parser'        //歌词格式转化器
import {playerMixin} from 'js/mixin'

const transform = prefixStyle('transform');
const transitionDuration = prefixStyle('transitionDuration');

export default {
    mixins:[playerMixin],
    data() {
        return {
            playUrl: '',  //播放地址
            canplay: true ,  //播放标志位
            curTime: 0 ,   //当前时间
            currentDot: 'cd',  //当前显示cd页面，还是歌词页面
            curSongLyric: null, //歌曲歌词
            curLineNum:0,   //当前高亮歌词下标
            curLineText:'' //单曲高亮歌词
        }
    },
    created() {
        this.fontSize = parseFloat(document.documentElement.style.fontSize);
        this.touch = {};
    },
    computed: {  
        playingIcon() { //播放按钮图标
            return this.playing ? 'icon-pause' : 'icon-play';
        },

       /*  playModeIcon() { //播放模式按钮图标
            return this.playMode === playMode.sequence ? 'icon-sequence' : this.playMode === playMode.random ? 'icon-random' : 'icon-loop' ;
        }, */

        speed() {
            return (this.curTime / this.curSong.duration) * 100;//当前时间占所有时间的百分比
        },

        errorCls() {  //this,canplay为false时，为上下切换按钮为灰色
            return this.canplay ? '' : 'errorClass';
        },

        imgRotate() { //根据不同的class名来实现转圈图的暂停
            return this.playing ? 'play' : 'play pause';
        },

        //动态获取到当前数据，数据的改变会触发Dom的刷新
        ...mapGetters([
            'playing',
            'fullScreen',
            /* 'sequenceList', */
            /* 'playList', */
            'curIndex',
            /* 'curSong', */
            /* 'playMode' */
        ])
    },
    watch: {
         //计算当前播放歌曲的地址，优点，不用一次全获取，播放那一首，就获取哪一首的KEY值
        curSong(newSong,oldSong) {  //当前歌曲变化时，就会触发获取歌曲Vkey
            if(!newSong.songid) { //容错处理
                return;
            }
              
            //切换播放模式时，当前歌曲更换下标，也不会重新获取，从头播放
            if(newSong.songid === oldSong.songid) {  
                return;
            }
            
            getSongVkey(this.curSong.songmid).then(res => {
                if(res) {
                    let vkey = res.items[0].vkey;
                   if(!vkey) {
                       return;
                   }
                    this.playUrl = `http://dl.stream.qqmusic.qq.com/C400${this.curSong.songmid}.m4a?guid=6711929420&uin=0&fromtag=38&vkey=${vkey}`;
                   
                    //每次获取之前，就要重置歌词
                    this.initLyric();
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        this.$refs.audio.play();//获取地址就播放
                        this.setPlaying(true); //切换播放状态为true                      
                    },500)
                }
            });
            this._getCurSongLyric(); //异步获取歌词
        },
        playing(newPlaying) {  //监控播放状态，来确定是否是播放，还是暂停
            const audio = this.$refs.audio;
            if(this.playUrl) {  //因为地址是异步获取，所以要判断是否有地址，才能进行播放暂停
                newPlaying ? audio.play() : audio.pause();
            }
        }
    },
    methods: {
        /* ----------------歌词数据获取函数---------------------------- */
        initLyric() {
            this.curSongLyric = null;
            this.curLineNum = 0 ;
            this.curLineText = '';
        },
        _getCurSongLyric() {
            getLyric(this.curSong.songmid).then(lyric => {
                if(lyric) {
                    this.curSongLyric = new Lyric(lyric,this._lyricCallback);
                    if(this.playing) {
                        this.curSongLyric.play();
                    }
                }
            }).catch(err => {
                if(err) {  //如果歌词获取错误，就重置歌词获取
                    this.initLyric();
                }
            })
        },
        _lyricCallback({lineNum,txt}) {
            if(!lineNum) {
                return;
            }
            if(!this.$refs.scroll) {
                return;
            }

            this.curLineNum = lineNum; //当前歌词的index；
            if(lineNum > 5) { //当前播放歌词下标大于5时，让scroll滚动
                let curLineEl = this.$refs.lyricing[lineNum - 5];
                this.$refs.scroll.scrollToElement(curLineEl,1000);
            } else {
                 this.$refs.scroll.scrollTo(0,0,1000);
            }

            this.curLineText = txt ; //获取当前高亮歌词
        },

        /* --------------------------切换播放器区-------------------------------------- */
        goMinPlayer() {  //切换小播放器
            this.setFullScreen(false);
        },
        goMaxPlayer() {
            this.setFullScreen(true);
        },

        /* --------------------------播放器按钮区-------------------------------------- */
        ready() {   //正在播放时
            this.canplay = true;

            //只有播放成功的歌曲，才存入播放过的列表中
            this.savePlayingSong(this.curSong);
        },
        togglePlaying() {  //切换播放状态，播放or暂停
            this.setPlaying(!this.playing);

            if(this.curSongLyric) {  //如果歌词存在，使用API停止或播放歌词
                this.curSongLyric.togglePlay();
            }
        },
        prev() {  //上一首，下一首的切换都是根据playList列表,而不是sequenceList顺序列表来的
            if(!this.canplay) {
                return;
            }

            if(this.playList.length === 1) {
                this.loop();
                return;
            }

            let prevIndex = this.curIndex - 1 < 0 ? this.playList.length - 1 : this.curIndex - 1;
            this.setCurIndex(prevIndex);

            this.canplay = false;
        },
        next() {
            if(!this.canplay) {
                return;
            }

            if(this.playList.length === 1) {
                this.loop();
                return;
            }

            let nextIndex = this.curIndex + 1 > this.playList.length - 1 ? 0 : this.curIndex + 1;
            this.setCurIndex(nextIndex);

            this.canplay = false;
        },
        loop() {  //循环，播放进度变为0，并播放
            const audio =  this.$refs.audio; 
            audio.currentTime = 0 ;
            audio.play();

            if(!this.playing) {  //如果为暂停，切换时，就变为播放
                this.togglePlaying(true);
            }
            if(this.curSongLyric) {  //当触发循环播放时，歌词重置位置
                this.curSongLyric.seek(0);
            }
        },
        playEnd() { //一首歌结束时，播放下一首
            // 循环播放放在这里，就是可以上下切换歌曲，如果是自动播放完毕并是循环模式，就循环，人性化
            if(this.playMode === playMode.loop) { //如果为循环播放模式，就循环播放
                this.loop();
                return;
            }

            this.next();
        },
        playError() {// 播放出错，更新播放标志位为true，可以切换上下首，
           //一开始默认canplay为false,页面一播放，就位true,点击下一首，是true就执行，不是就不执行，执行后，设为了false,当歌曲成功播放又为true
           //如果播放失败，一直是false，是false，就不能切换上下首歌曲，所以，失败时，这里手动切换为true，可执行上下首播放
            this.canplay = true;
        },
       /*  changePlayMode() {  //改变播放模式
            const mode = (this.playMode+1) % 3;
            this.setPlayMode(mode);
           
            let list = null;
            if(this.playMode === playMode.random) { //随机列表
                list = shuffle(this.sequenceList);
            } else {  //顺序列表
                list = this.sequenceList;
            }

            this.resetCurIndex(list);  //更新当前播放歌曲下标
            this.setPlayList(list);
        },
        resetCurIndex(list) {  //当更换随机列表时，需要更新当前的播放歌曲的下标，使播放歌曲不变
            let index = list.findIndex((item) => {
                return item.songid === this.curSong.songid; //返回列表中与当前播放歌曲id相同歌曲的下标
            });
            this.setCurIndex(index);
        }, */
        goPlayList() {  //点击播放列表图标
            this.$refs.playList.show();
        },

        /* --------------------------播放器进度条区-------------------------------------- */
        timeUpDate() { //播放位置事件
             const audio = this.$refs.audio;
             if(!audio) {
                 return;
             }
             this.curTime = audio.currentTime;
        },
        _getTime(time) { //转化事件
            let m = parseInt(time/60);
            let s = Math.floor(time%60);
            s = s < 10 ? '0'+s : s;
            return m + ':' + s ;
        },
        progressTouchend(speed){ //根据拖动结束的进度条，更新当前播放进度
            if(speed > 0) {
                this.$refs.audio.currentTime = this.curSong.duration * speed;
                
                if(this.curSongLyric) {  //当更新播放进度时，歌词更新位置,毫秒单位
                    this.curSongLyric.seek(this.$refs.audio.currentTime*1000);
                }
            }
            if(!this.playing) {  //如果是暂停，就播放
                this.setPlaying(true);
            }
        },
        changeTime(speed) { //拖动过程中当前时间的视图更新
            if(speed > 0) {
                this.curTime = this.curSong.duration * speed
            }
        },

        /* ----------------------播放器小图移动到大图，小变大，最开始播放器不存在，当点击歌曲时，由小变大-------------------------------------- */
        enter(el,done) {  //小到大
            const {x,y,imgScale} = this._getPosition();
            let animation = {
                0: {
                    transform: `translate3d(-${x}px,${y}px,0) scale(${imgScale})`  //大图初始位置,初始大小（相对于最终的位置，大小）
                },
                50: {
                    transform: `translate3d(0,0,0) scale(1.1)`
                },
                100: {
                    transform: `translate3d(0,0,0) scale(1)`
                }
            };
            this._inAnimation('in',animation,done); //进入动画
        },
        afterEnter() {
            this._outAnimation('in'); //移出动画
        },
        leave(el,done) { //大到小
            const {x,y,imgScale} = this._getPosition();
            let animation = {
                0: {
                    transform: `translate3d(0,0,0) scale(1)`  
                },
                100: {
                    transform: `translate3d(-${x}px,${y}px,0) scale(${imgScale})`
                }
            };
            this._inAnimation('out',animation,done); //进入动画
        },
        afterLeave() {
            this._outAnimation('out');
        },
        _inAnimation(name,animation,done) { //create-keyframe-animation包，自带npm 
            animations.registerAnimation({ //插件自带api，绑定动画
                name: name,
                animation,
                presets: {
                    duration: 400,
                    easing: 'linear'
                }
            });
            // 绑定动画元素，done--到下一步afterEnter，enter()里自带的参数
            animations.runAnimation(this.$refs.cdWrapper, name ,done);//执行动画
        },
        _outAnimation(name) {//动画完成后清除动画
            animations.runAnimation(name);
            this.$refs.cdWrapper.style.animation = ''; //动画完成后清除动画
        },
        _getPosition() {  //获取大到小的平移位置，大小比例
            const minWidth = 0.8 * this.fontSize;    
            const minHeight = 0.8 * this.fontSize;
            const minLeft = 0.8 * this.fontSize;
            const minBottom = 0.4 * this.fontSize;
            const maxTop = 1.7 * this.fontSize;
            const maxHeight = 6 * this.fontSize;
            const imgScale = minHeight / maxHeight ; //缩放比例
            const x = window.innerWidth / 2 - minLeft -minWidth / 2 ;  //中心点到中心的位置
            const y = window.innerHeight - ( maxHeight / 2 + maxTop + minBottom + minHeight / 2)
            return {x,y,imgScale}
        },

        /* ----------------------切换歌词区域------------------------------------- */
        touchstart(e) {
            this.touch.flag = true;
            const touch = e.touches[0];
            this.touch.startX = touch.pageX;
            this.touch.startY = touch.pageY;
        },
        touchmove(e) {
            if(!this.touch.flag) {
                return;
            }

            const touch = e.touches[0];
            let moveX = touch.pageX - this.touch.startX;//如果moveX>0,向右滑动，moveX<0,向左滑动
            let moveY = touch.pageY - this.touch.startY;

             if(Math.abs(moveX) < Math.abs(moveY)) {  //人性化处理，如果纵向滑动距离大于水平距离，则返回
                this.touch.flag = false ;
                return;
             }

            const lyricLeft = this.currentDot === 'cd' ? 0 : -1*window.innerWidth; //歌词页面停留位置
            //如果当前是cd页面，歌词页面向左移动不能小于-1*window.innerWidth
            //如果当前是歌词页面，歌词页面向右移动不能大于0
            let lyricMoveX = Math.min(0,Math.max(-1*window.innerWidth,moveX+lyricLeft));
            this.$refs.scroll.$el.style[transform] = `translate3d(${lyricMoveX}px,0,0)`;

            //过渡效果
            this.touch.percent = Math.abs(lyricMoveX) / window.innerWidth *100 ; //移动距离所占百分比
            this.$refs.scroll.$el.style[transitionDuration] = 0;
            this.$refs.middle_l.style.opacity = 1 - this.touch.percent/100;
            this.$refs.middle_l.style[transitionDuration] = 0;
        },
        touchend() {
            //未解决，只是点击时，touchstart和touchend会触发click事件，让cd页面显示，
            //所以加个判断，如果移动位移为0，则返回事件
            if(this.touch.percent === 0) {
                this.touch.flag = false;
                return ;
            }


            let moveX;
            let opacity; 
            const scroll = this.$refs.scroll.$el;
            const middle_l = this.$refs.middle_l;

            if(this.currentDot === 'cd') {  //向左滑动，页面在cd页面，位移是0%,所以大于于10%位移时，才切换到cd页
                if(this.touch.percent > 10) {
                    moveX = -1*window.innerWidth; 
                    opacity = 0;
                    this.currentDot ='lyric';
                } else {
                    moveX = 0;
                    opacity = 1;
                }
            } else if (this.currentDot === 'lyric') { //向右滑
                if(this.touch.percent < 90) {//页面已经在歌词页面，位移是100%,所以小于90%位移时，才切换到cd页，也就是移动的10%的长度，才触发
                    moveX = 0; 
                    opacity = 1;
                    this.currentDot ='cd';
                } else {
                    moveX = -1*window.innerWidth;
                    opacity = 0;
                }
            }
 
            scroll.style[transform] = `translate3d(${moveX}px,0,0)`;
            scroll.style[transitionDuration] = `300ms`;
            middle_l.style.opacity = opacity;
            middle_l.style[transitionDuration] = `300ms`;

           //重置按钮标志位
            this.touch.flag = false;
            this.touch.percent = 0;
        },

        /* --------------------------VUEX设置数据区-------------------------------------- */
        ...mapMutations({
            setFullScreen: 'SET_FULL_SCREEN',
           /*  setPlaying: 'SET_PLAYING', */
            /* setCurIndex: 'SET_CUR_INDEX',
            setPlayMode: 'SET_PLAY_MODE',
            setPlayList: 'SET_PLAY_LIST' */
        }),
        ...mapActions([
            'savePlayingSong'
        ])
    },
    components: {
        'v-progressBar': ProgressBar,
        'v-progressCircle': ProgressCircle,
        'v-scroll': Scroll,
        'v-playList': PlayList
    }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable';
@import '~styles/mixin';

/* 结合play和pause两个class,来定义图片的旋转 */
@keyframes rotate  
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)

.maxPlayer
    fixed()
    background: $color-background
    &.max-enter-active,
    &.max-leave-active
        transition: all .4s
        .maxPlayer-header,
        .maxPlayer-footer
            transition: all .4s
    &.max-enter,
    &.max-leave-to
        opacity: 0
        .maxPlayer-header
            transform: translate3d(0,-100%,0)
        .maxPlayer-footer
            transform: translate3d(0,100%,0) 
    .maxPlayer-bgImg
        absolute()
        opacity: .6
        z-index: -1
        filter: blur(20px)
        .bgImg
            width: 100%
            height: 100%
    .maxPlayer-header
        width: 100%
        .iconfont
            position: absolute
            width: .88rem
            height: .88rem
            line-height: .88rem
            text-align:center
            color: $color-theme
            font-size: $font-size-large-x
            transform: rotate(-90deg)
        .maxPlayer-title
            height: .88rem
            line-height: .88rem
            text-align: center
            font-size: $font-size-large
            color: $color-text
        .maxPlayer-name
            height: .4rem
            line-height: .4rem
            text-align: center
            margin-bottom: .5rem
    .maxPlayer-middle
        position: absolute
        top: 1.7rem
        bottom: 3.4rem
        width: 100%
        .middle-l
            .cd-wrapper
                position: relative
                width: 6rem
                height: 6rem
                margin: 0 auto
                box-sizing: border-box
                z-index:1
                .cd
                    width: 100%
                    height: 100%
                    border-radius: 50%
                    &.play /* CSS3动画播放 */
                        animation: rotate 20s linear infinite
                    &.pause     /* CSS3动画暂停 */
                        animation-play-state: paused
                    .cd-Img
                        position: absolute
                        width: 100%
                        height: 100%
                        box-sizing: border-box
                        border: .2rem solid hsla(0,0%,100%,.1)
                        border-radius: 50%
            .play-lyric-wrapper
                overflow: hidden
                width: 80%
                margin: .6rem auto 0
                text-align: center
                color: $color-text-l
        .middle-r
            absolute()
            left: 100%
            width: 100%
            height: 100%
            overflow: hidden
            transform: translate3d(0,0,0)
            .lyric-wrapper
                .lyric
                    text-align: center
                    color: $color-text-l
                    .lyric-list
                        line-height: .64rem
                        &.activeLyric
                            color: $color-text
    .maxPlayer-footer
        position: absolute
        bottom: 1rem
        width: 100%
        .dot-wrapper
            font-size: 0
            text-align:center
            .dot
                display: inline-block
                width: .16rem
                height: .16rem
                background: $color-text-l
                border-radius: 50%
                margin: 0 .1rem
                &.active
                    width: .4rem
                    border-radius: 100px
                    background: $color-text-ll
        .progress-wrapper
            width: 80%
            height: 1rem
            margin: 0 auto
            flex-between()
            .time
                flex: 0 0 .7rem
                width: .7rem
                height: .6rem
                line-height: .6rem
                font-size: $font-size-small
                &.start-time            
                    text-align: left
                &.end-time
                    text-align: right
            .progress-bar-wrapper
                flex: 1
    .maxPlayer-btn  
        flex-center()
        .icon
            flex: 1
            font-size: .6rem
            color: $color-theme
            &.i-left
                text-align: right
            &.i-center
                text-align: center
                padding: 0 .4rem
                font-size: .8rem
            &.i-right
                text-align: left
            &.errorClass
                color: $color-theme-d
.minPlayer
    position: fixed
    bottom: 0
    width: 100%
    height: 1.2rem
    background: $color-highlight-background
    flex-center()
    .minPlayer-bgImg
        width: .8rem
        height: .8rem
        flex: 0 0 .8rem
        padding: 0 .2rem 0 .4rem
        .cd-wrapper
            position: relative
            width: .8rem
            height: .8rem
            margin: 0 auto
            .cd
                width: 100%
                height: 100%
                border-radius: 50%
                &.play /* CSS3动画播放 */
                    animation: rotate 20s linear infinite
                &.pause     /* CSS3动画暂停 */
                    animation-play-state: paused
                .cd-Img
                    position: absolute
                    width: 100%
                    height: 100%
                    border-radius: 50%
    .minPlayer-desc
        flex: 1
        line-height: .4rem
        .name
            name: $color-text
        .singer
            font-size: $font-size-small
            color: $color-text-l
    .icon
        width: .6rem
        flex: 0 0 .6rem
        padding: 0 .2rem
        color: rgba(255,205,49,.5)
        .icon-playlist
            font-size: .6rem
        .icon-play,
        .icon-pause
            position: absolute
            top: 0
            left: 0
            font-size: .64rem

</style>
