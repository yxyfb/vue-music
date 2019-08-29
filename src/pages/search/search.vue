<template>
    <div class="search">
        <div class="search-input-wrapper">
            <v-searchInput @changeInputText='changeInputText' ref='input'></v-searchInput>
        </div>
        <v-scroll ref='scroll' class='scroll' :data='scrollData'>
            <div>
                <div class="hot-search-wrapper">
                    <v-hotSearch @setInputText='setInputText'></v-hotSearch>
                </div>
                <div class="search-history-wrapper">
                    <v-searchHistory @selectItem='setInputText'></v-searchHistory>
                </div>
            </div>
        </v-scroll>
        <div class="search-list-wrapper" v-show='listShow' ref='searchListWrapper'>
            <v-searchList :inputText='inputText' @beforeScrollStart='beforeScrollStart'
                          @joinHistory='joinHistory'></v-searchList>
        </div>
    </div>
</template>

<script>
import SearchInput from 'common/search-input/search-input'
import SearchList from 'common/search-list/search-list'
import HotSearch from './components/hotSearch'
import SearchHistory from './components/searchHistory'
import Scroll from 'common/scroll/scroll'
import {mapActions,mapGetters} from 'vuex'
import {playListMixin,searchMixin} from 'js/mixin'

export default {
    mixins:[playListMixin,searchMixin],
   /*  data() {
        return {
            listShow: false,
            inputText:''
        }
    }, */
    methods: {
       /*  changeInputText(newText) {
            this.listShow = newText ? true : false;
            this.inputText = newText;
        },
        beforeScrollStart() { //滚动前，手机键盘失焦
            this.$refs.input.blur();
        },
        setInputText(text) { //点击热门搜索或搜索历史，给input款赋值
            this.$refs.input.setInputText(text)
        },
        joinHistory() { //点击了搜索列表里面的信息，就会存储到本地列表
            this.saveHistorySearch(this.inputText);//通过vuex存入缓存
        }, */
        changeListBottom(list) {
            const bottom = list.length > 0 ? '1.2rem' : 0;
            this.$refs.scroll.$el.style.bottom = bottom;
            this.$refs.searchListWrapper.style.bottom = bottom; //然搜索列表也增加一个底边距离
            this.$refs.scroll.refresh();
        },
       /*  ...mapActions([
            'saveHistorySearch'     
        ]) */
    },
    computed: {
        scrollData() {
            return this.historySearch;
        },
       /*  ...mapGetters([
            'historySearch'
        ]) */
    },
    components: {
        'v-searchInput': SearchInput,
        'v-searchList': SearchList,
        'v-hotSearch': HotSearch,
        'v-scroll': Scroll,
        'v-searchHistory': SearchHistory
    }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable';
@import '~styles/mixin';

.search
    position: absolute
    top: 1.76rem
    bottom: 0
    width: 100%
    overflow: hidden
    background: $color-background
    color: $color-text-l
    .search-input-wrapper
        margin: .4rem 0
    .scroll
        position: absolute
        top: 1.8rem
        bottom: 0
        width: 100%
        overflow: hidden
        .hot-search-wrapper
            margin-bottom: .4rem
    .search-list-wrapper
        position: absolute
        top: 1.7rem
        bottom: 0
        width: 100%
</style>

