import Vue from 'vue';
import Router from 'vue-router';

import IndexPage from '@/views/Index.vue';

const PhotosPage = () => import(/* webpackChunkName: "page-photos"*/ '@/views/pages/Photos.vue');
const PostsPage = () => import(/* webpackChunkName: "page-posts"*/ '@/views/pages/Posts.vue');
const ReleasesPage = () => import(/* webpackChunkName: "page-releases"*/ '@/views/pages/Releases.vue');
const TextPage = () => import(/* webpackChunkName: "page-text"*/ '@/views/pages/Text.vue');
const VideosPage = () => import(/* webpackChunkName: "page-videos"*/ '@/views/pages/Videos.vue');

import store from './store';

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  scrollBehavior: (to) => {
    return to.hash ? { selector: to.hash, offset: { x: 0, y: 80 } } : { x: 0, y: 0 };
  },
  routes: [
    {
      path: '/',
      component: IndexPage, 
      meta: { requires: [ 'links', 'splashes', 'testimonials' ]},
      children: [
        { name: 'home', path: '', component: TextPage },
        { name: 'about', path: 'about', component: TextPage },
        { name: 'news', path: 'news', component: PostsPage, meta: { requires: ['posts']} },
        { name: 'releases', path: 'releases', component: ReleasesPage, meta: { requires: ['releases', 'videos']}  },
        { name: 'videos', path: 'videos', component: VideosPage, meta: { requires: ['videos', 'releases']} },
        { name: 'photos', path: 'photos', component: PhotosPage, meta: { requires: ['photos', 'instagram']} },
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
