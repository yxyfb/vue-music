<template>
    <div class="search-history" v-show='historySearch.length>0'>
        <h2 class="history-title">
            <span class="text">搜索历史</span>
            <span class="iconfont icon-clear" @click='confirm'></span>
        </h2>
        <v-searchHistoryList :historySearch='historySearch'
                             @removeItemHistory='removeItemHistory'
                             @selectItem='selectItem'>
        </v-searchHistoryList>

        <v-confirm ref='confirm' @clear='clear'></v-confirm>
    </div>
</template>

<script>
import searchHistoryList from 'common/search-historyList/search-historyList'
import Confirm from 'common/confirm/confirm'
import {mapGetters,mapActions} from 'vuex'

export default {
    methods: {
        selectItem(item) { //选择某个搜索历史
            this.$emit('selectItem',item);
        },
        removeItemHistory(item) { //删除某个搜索历史
            this.deleteOneHistory(item);
        },
        confirm() { //点击清空弹出弹出框
            this.$refs.confirm.show();
        },
        clear() {  //清空搜索历史
            this.deleteAllHistory();
        },
        ...mapActions([
            'deleteOneHistory',
            'deleteAllHistory'
        ])
    },
    computed: {
        ...mapGetters([
            'historySearch'
        ])
    },
    components: {
        'v-searchHistoryList': searchHistoryList,
        'v-confirm': Confirm
    }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable';
@import '~styles/mixin';

.search-history
    margin: 0 .4rem
    .iconfont
        color: $color-text-d
    .history-title
        margin-bottom: .4rem
        flex-center()
        .text
            flex: 1
</style>

