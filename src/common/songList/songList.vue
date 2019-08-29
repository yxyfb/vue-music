<template>
    <ul class="songList">
        <li class="song" v-for='(song,index) of songs'
            :key='index'
            @click='playMusic(song,index)'>
            <div class="songIcon" v-if='iconShow'>
                <i class="icon"
                   :class='getIconCls(index)'>{{getIconText(index)}}</i>
            </div>
            <div class="songDesc">
                <h3 class="songDesc-name">{{song.songname}}</h3>
                <p class="songDesc-singer">{{song.singer}}·{{song.albumname}}</p>
            </div>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        songs: {
            type: Array,
            default: () => []
        },
        iconShow: {  //歌曲图标是否显示
            type: Boolean,
            default: false
        }
    },
    methods: {
        playMusic(song,index) {
            this.$emit('playMusic',song,index);
        },
        getIconCls(index) {
            if(index <=2 ) {
                return `icon${index}`;
            }
        },
        getIconText(index) {
            if(index > 2) {
                return index;
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable';
@import '~styles/mixin';

.songList
    padding: .4rem .6rem
    .song
        height: 1.28rem
        flex-center()
        .songIcon
            display: flex
            flex-direction: column
            justify-content: center
            width: 1.28rem
            height: 1.28rem
            .icon
                display:block
                width: .5rem
                height: .48rem
                font-size: $font-size-large
                color: $color-theme
                background-size: 100%
                text-align: center
                &.icon0
                    bg-image('img/first') 
                &.icon1
                    bg-image('img/second')  
                &.icon2
                    bg-image('img/third')                   
        .songDesc
            flex: 1
            line-height: .4rem
            no-wrap()
            .songDesc-name
                color: $color-text
                no-wrap()
            .songDesc-singer
                margin-top: .08rem
                color: $color-text-l
                no-wrap()

</style>

