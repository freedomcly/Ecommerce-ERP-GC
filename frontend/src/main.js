import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import 'normalize.css/normalize.css'

import App from './App'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'

import _ from 'lodash' // eslint-disable-line
import VueLazyload from 'vue-lazyload'

import Print from './utils/print'
Vue.use(Print)

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueLazyload)

Vue.use(VueAxios, axios)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
