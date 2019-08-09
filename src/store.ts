import Vue from 'vue';
import Vuex from 'vuex';
import AirtableService from '@/services/airtable.service';
import { Page, Testimonial, Video, Release, PageType, Meta, Photo, Post, Link, Splash } from './models/dtos';

Vue.use(Vuex);

const service = new AirtableService();

export interface WebSiteState {
  loading: boolean;

  pages: Page[];
  testimonials: Testimonial[];
  videos: Video[];
  releases: Release[];
  photos: Photo[];
  posts: Post[];
  links: Link[];
  splashes: Splash[];

  meta: Meta[];
}

export const defaultState: WebSiteState = {
  pages: [],
  testimonials: [],
  videos: [],
  releases: [],
  photos: [],
  posts: [],
  links: [],
  splashes: [],
  meta: [],
  loading: false,
}
const idsToObjs = (entry: any, objName: string, state: any) => {
  const idKey = `${objName}Ids`,
    stateKey = `${objName}s`,
    obj: any = {};

  obj[stateKey] = (entry[idKey] || []).map((ti: string) => state[stateKey].find((t: { id: string }) => t.id === ti));

  return obj;
};
const makeGetter = (entryName: string) => {
  return (entry: any, state: WebSiteState) => idsToObjs(entry, entryName, state);
};
const testimonials = makeGetter('testimonial'),
  videos = makeGetter('video'),
  releases = makeGetter('release'),
  links = makeGetter('link');

const updates: any = {
  'pages': service.pages,
  'meta': service.meta,
  'splashes': service.splashes,
  'testimonials': service.testimonials,
  'links': service.links,
  'videos': service.videos,
  'releases': service.releases,
  'photos': service.photos,
  'posts': service.posts
};

const has = (obj: any, key: string) => obj[key] && Array.isArray(obj[key]) && obj[key].length > 0;

export default new Vuex.Store<WebSiteState>({
  state: defaultState,
  getters: {
    meta: (state) => {
      const meta = state.meta && state.meta.length > 0 ? state.meta[0] : <Meta>{};
      return <Meta>{
        ...meta,
        footerLinks: (meta.footerLinkIds || []).map((li) => state.links.find((l) => l.id === li))
      };
    },
    pages: (state) => {
      return state.pages.map((p) => {
        return {
          ...p,
          ...testimonials(p, state),
          ...links(p, state),
          shouldShow: p.type === PageType.Text || 
            p.type === PageType.Contact ||
            (p.type === PageType.Videos   && has(state, 'videos')) ||
            (p.type === PageType.Releases && has(state, 'releases')) ||
            (p.type === PageType.Posts    && has(state, 'posts')) ||
            (p.type === PageType.Photos   && has(state, 'photos')),
          splash: (p.splashId ? state.splashes.find((s) => s.id === p.splashId) : null)
        };
      }).filter(p => p.shouldShow)
        .sort((a, b) => a.sort - b.sort);
    },
    videos: (state) => {
      return state.videos.map((v) => {
        return {
          ...v,
          ...releases(v, state)
        }
      }).sort((a, b) => a.date < b.date ? 1 : -1);
    },
    releases: (state) => {
      return state.releases.map((r) => {
        return {
          ...r,
          ...testimonials(r, state),
          ...videos(r, state),
        }
      }).sort((a, b) => a.date < b.date ? 1 : -1);
    },
    photos: (state) => state.photos,
    posts: (state) => state.posts,
    testimonials: (state) => state.testimonials,
    links: (state) => state.links,
    loading: (state) => state.loading
  },
  mutations: {
    loading(state) {
      state.loading = true;
    },
    loaded(state) {
      state.loading = false;
    },
    pages(state, pages: Page[]) {
      state.pages = [...pages];
    },
    testimonials(state, testimonials: Testimonial[]) {
      state.testimonials = [...testimonials];
    },
    videos(state, videos: Video[]) {
      state.videos = [...videos];
    },
    releases(state, releases: Release[]) {
      state.releases = [...releases];
    },
    meta(state, meta: Meta[]) {
      state.meta = [...meta];
    },
    photos(state, photos: Photo[]) {
      state.photos = [...photos];
    },
    posts(state, posts: Post[]) {
      state.posts = [...posts];
    },
    links(state, links: Link[]) {
      state.links = [...links];
    },
    splashes(state, splashes: Splash[]) {
      state.splashes = [...splashes];
    }
  },
  actions: {
    async loadData(store, overwrite: boolean = false) {
      !overwrite && this.commit('loading');
      for (var k of Object.keys(updates)) {
        this.commit(k, await updates[k].call(service, overwrite));
      }
      !overwrite && this.commit('loaded');
    }
  }
})
