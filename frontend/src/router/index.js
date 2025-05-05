import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

const original = Router.prototype.push
Router.prototype.push = function push (location) {
  return original.call(this, location).catch(err => err)
}
Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    component: Layout,
    name: 'index'
  }, {
    path: '/product',
    component: Layout,
    redirect: '/product/index',
    children: [{
      path: 'index',
      name: 'product',
      component: () => import('@/modules/product/index.vue')
    }, {
      path: 'add',
      name: 'add',
      component: () => import('@/modules/product/add.vue')
    }, {
      path: 'edit',
      name: 'edit',
      component: () => import('@/modules/product/add.vue')
    }]
  }, {
    path: '/product-publish',
    component: Layout,
    redirect: '/product-publish/index',
    children: [{
      path: 'index',
      name: 'product-publish',
      component: () => import('@/modules/product-publish/index.vue')
    }]
  }, {
    path: '/product-online',
    component: Layout,
    redirect: '/product-online/index',
    children: [{
      path: 'index',
      name: 'product-online',
      component: () => import('@/modules/product-online/index.vue')
    }]
  }, {
    path: '/order',
    component: Layout,
    redirect: '/product/index',
    children: [{
      path: 'index',
      name: 'order',
      component: () => import('@/modules/order/index.vue')
    }, {
      path: 'delivery',
      name: 'order-delivery',
      component: () => import('@/modules/order/delivery.vue')
    }, {
      path: 'purchase-list',
      name: 'order-purchase-list',
      component: () => import('@/modules/order/purchase.vue')
    }]
  }, {
    path: '/global',
    component: Layout,
    redirect: '/global/index',
    children: [{
      path: 'index',
      name: 'global',
      component: () => import('@/modules/global/index.vue')
    }]
  }, {
    path: '/keyword',
    component: Layout,
    redirect: '/keyword/descriptions',
    children: [{
      path: 'index',
      name: 'keyword',
      component: () => import('@/modules/keyword/index.vue')
    }, {
      path: 'descriptions',
      name: 'descriptions',
      component: () => import('@/modules/keyword/descriptions.vue')
    }]
  }, {
    path: '/supplier',
    component: Layout,
    redirect: '/supplier/index',
    children: [{
      path: 'index',
      name: 'supplier',
      component: () => import('@/modules/supplier/index.vue')
    }, {
      path: 'add',
      name: 'supplier-add',
      component: () => import('@/modules/supplier/add.vue')
    }, {
      path: 'edit',
      name: 'supplier-edit',
      component: () => import('@/modules/supplier/add.vue')
    }]
  }, {
    path: '/price',
    component: Layout,
    redirect: '/price/index',
    children: [{
      path: 'index',
      name: 'price',
      component: () => import('@/modules/price/index.vue')
    }]
  }, {
    path: '/promotion',
    component: Layout,
    redirect: '/promotion/index',
    children: [{
      path: 'index',
      name: 'promotion',
      component: () => import('@/modules/promotion/index.vue')
    }]
  }, {
    path: '/auth',
    component: Layout,
    redirect: '/auth/index',
    children: [{
      path: 'index',
      name: 'auth',
      component: () => import('@/modules/auth/index.vue')
    }]
  }, {
    path: '/boost',
    component: Layout,
    redirect: '/auth/boost',
    children: [{
      path: 'index',
      name: 'boost',
      component: () => import('@/modules/boost/index.vue')
    }]
  }, {
    path: '/shop',
    component: Layout,
    redirect: '/shop/index',
    children: [{
      path: 'index',
      name: 'shop',
      component: () => import('@/modules/shop/index.vue')
    }]
  }, {
    path: '/data',
    component: Layout,
    redirect: '/data/index',
    children: [{
      path: 'index',
      name: 'data',
      component: () => import('@/modules/data/index.vue')
    }]
  }, {
    path: '/login',
    name: 'login',
    component: () => import('@/modules/user/login.vue')
  }, {
    path: '/register',
    name: 'register',
    component: () => import('@/modules/user/register.vue')
  }, {
    path: '/list',
    name: 'list',
    component: () => import('@/modules/user/list.vue')
  }, {
    path: '/purchase-report',
    name: 'purchase-report',
    component: () => import('@/modules/order/report.vue')
  }]
})
