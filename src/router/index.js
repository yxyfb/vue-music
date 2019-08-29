import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      redirect:'/recommend'
    },
    {
      path:'/recommend',
      name:'recommend',
      component: () => import('pages/recommend/recommend'),
      children: [
        {
          path:'/recommend/:id',
          name:'songsheet',
          component: () => import('pages/recommend/components/songsheet')
        }
      ]
    },
    {
      path:'/singer',
      name:'singer',
      component: () => import('pages/singer/singer'),
      children: [
        {
          path:'/singer/:id',
          name:'singer-detail',
          component: () => import('pages/singer/components/singer-detail')
        }
      ]
    },
    {
      path:'/rank',
      name:'rank',
      component: () => import('pages/rank/rank'),
      children: [
        {
          path:'/rank/:id',
          name:'rank-detail',
          component: () => import('pages/rank/components/rank-detail')
        }
      ]
    },
    {
      path:'/search',
      name:'search',
      component: () => import('pages/search/search'),
      children: [
        {
          path:'/search/:id',
          component: () => import('pages/singer/components/singer-detail')
        }
      ]
    },
    {
      path:'/user',
      name:'user',
      component: () => import('pages/user/user')
    }
  ]
})