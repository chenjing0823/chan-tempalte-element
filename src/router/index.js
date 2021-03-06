import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
import Layout from '../views/layout/Layout'

// import HelloWorld from '@/components/HelloWorld.vue'
Vue.use(Router)
/**
 * 参考https://panjiachen.github.io/vue-element-admin-site/zh/
 * hidden: true                   //当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               //当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面 length
 *                                //只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                //若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                //你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noredirect           //当设置 noredirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             //设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin', 'editor']    //设置该路由进入的权限，支持多个权限叠加
    title: 'title'                //设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'              //设置该路由的图标
    noCache: true                 //如果设置为true ,则不会被 <keep-alive> 缓存(默认 false)
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'example',
    alwaysShow: true,
    meta: { title: '示例', icon: 'form' },
    children: [{
      path: 'table',
      name: 'table',
      meta: { title: '基础表单' },
      component: () => import('@/views/example/table')
    }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
