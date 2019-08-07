import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  scrollBehavior: (to) => {
    return to.hash ? { selector: to.hash, offset: { x: 0, y: 80 } } : { x: 0, y: 0 };
  },
  routes: [
    {
      path: '/:slug?',
      name: 'home',
      component: Home
    }
  ]
})
