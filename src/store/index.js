import Vue from 'vue'      //引入vue包
import Vuex from 'vuex'
import * as actions from './actions'    //获取里面所有的方法名
import * as getters from './getters'    //获取里面所有的方法名
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'   //修改日志，方便观察

Vue.use(Vuex)

//严格模式，检测state数据修改是否来自mutation，其它修改就会警告
const debug = process.env.NODE_EVN !== 'production'

export default new Vuex.Store({   //创建存放的仓库
    actions,
    getters,
    state,
    mutations,
    strict:debug,
    plugins:debug ? [createLogger()] : []
})