import '@babel/polyfill' //低版本浏览器兼容ES6
import 'styles/index.styl'  //所有基础css样式

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'   //引入vuex

import fastClick from 'fastclick'  //解决手机端点击延迟300毫秒问题
fastClick.attach(document.body);

import VueLazyload from 'vue-lazyload'   //图片懒加载
Vue.use(VueLazyload, {
  preLoad: 1.3,   //1.就是到了才加载，1点几甚至更高就是还没到就开始加载
  error: require('./assets/styles/img/error.png'),       //错误的时候图片
  loading: require('./assets/styles/img/default.png'),  //加载中的图片
  attempt: 1          //尝试加载几次
})

import VueAwesomeSwiper from 'vue-awesome-swiper' //轮播图插件引用
import 'swiper/dist/css/swiper.css'  //轮播图插件的CSS样式2.6.0版本后都需要
Vue.use(VueAwesomeSwiper)  //使用轮播图插件

import './assets/js/rem'  //引入rem 


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
