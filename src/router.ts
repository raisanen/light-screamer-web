import Vue from 'vue';
import Router from 'vue-router';

const IndexPage = () => import(/* webpackChunkName: "page-index" */ '@/views/Index.vue');
const TextPage = () => import(/* webpackChunkName: "page-text" */ '@/views/pages/Text.vue');
const ListPage = () => import(/* webpackChunkName: "page-list" */ '@/views/pages/List.vue');
const EventListPage = () => import(/* webpackChunkName: "page-event-list" */ '@/views/pages/EventList.vue');

import store from './store';

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  scrollBehavior: (to) => {
    return to.hash ? { selector: to.hash, offset: { x: 0, y: 0 } } : { x: 0, y: 0 };
  },
  routes: [
    {
      path: '/',
      component: IndexPage, 
      meta: { requires: [ ]},
      children: [
        { name: 'home', path: '', component: TextPage },
        { name: 'about', path: 'about', component: TextPage },
        { name: 'shows', path: 'shows', component: EventListPage, meta: { requires: ['events'] } },
        { name: 'news', path: 'news', component: ListPage, meta: { requires: ['posts'] } },
        { name: 'releases', path: 'releases', component: ListPage, meta: { requires: ['releases', 'videos'] } },
        { name: 'videos', path: 'videos', component: ListPage, meta: { requires: ['videos', 'instagram', 'releases'] } },
        { name: 'photos', path: 'photos', component: ListPage, meta: { requires: ['photos', 'instagram'] } },
        { name: 'contact', path: 'contact', component: TextPage },
      ]
    }
  ]
});

router.beforeEach((to, _, next) => {
  const wantedData = to.matched
    .filter((record) => record.meta && record.meta.requires)
    .map((record) => record.meta.requires)
    .reduce((p, c) => [...p, ...c], []),
    wantedPage = to.name || 'home';

  store.commit('currentPage', wantedPage);
  store.dispatch('loadData', { update: wantedData });

  next();
});

export default router;
