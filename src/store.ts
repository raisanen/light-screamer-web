import Vue from 'vue';
import Vuex from 'vuex';
import AirtableService from '@/services/airtable.service';
import { Page, Testimonial, Video, Release, PageType, Meta, Photo, Post, Link, Splash } from './models/dtos';

Vue.use(Vuex);

const service = new AirtableService();

export interface WebSiteState {
  pages: Page[];
  testimonials: Testimonial[];
  videos: Video[];
  releases: Release[];
  photos: Photo[];
  posts: Post[];
  links: Link[];
  splashes: Splash[];

  meta: Meta[];

  initializing: boolean;
  loading: boolean;

  lightboxImage: string;
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
  initializing: false,

  lightboxImage: null,
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

const allUpdates: any = {
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
    lightboxImage: (state) => state.lightboxImage,
    initializing: (state) => state.initializing,
    meta: (state) => {
      const meta = state.meta && state.meta.length > 0 ? state.meta[0] : <Meta>{};
      return <Meta>{
        ...meta,
        footerLinks: (meta.footerLinkIds || []).map((li) => state.links.find((l) => l.id === li))
      };
    },
    pages: (state) => {
      return state.pages.filter((p) => p.active).map((p) => {
        return {
          ...p,
          ...testimonials(p, state),
          ...links(p, state),
          splash: (p.splashId ? state.splashes.find((s) => s.id === p.splashId) : null)
        };
      }).sort((a, b) => a.sort - b.sort);
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
    lightbox(state, image: string) {
      state.lightboxImage = image || null;
    },
    initializing(state, initializing: boolean) {
      state.initializing = initializing;
    },
    loading(state, loading: boolean) {
      state.loading = loading;
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
      state.posts = [ ...posts ];
    },
    links(state, links: Link[]) {
      state.links = [ ...links ];
    },
    splashes(state, splashes: Splash[]) {
      state.splashes = [ ...splashes ];
    }
  },
  actions: {
    showLightbox(_, payload: string) {
      this.commit('lightbox', payload);
    },
    hideLightbox() {
      this.commit('lightbox', null);
    },
    async initialize() {
      this.commit('initializing', true);
      this.commit('pages', await service.pages());
      this.commit('meta', await service.meta());
      this.commit('initializing', false);
    },
    async loadData(_, payload: { update: string[]; overwrite?: boolean; }) {
      const tablesToUpdate = [... payload.update],
        overwrite = !!payload.overwrite;

      if (tablesToUpdate.length > 0) {
        !overwrite && this.commit('loading', true);

        for (var table of tablesToUpdate) {
          this.commit(table, await allUpdates[table].call(service, overwrite));
        }
        !overwrite && this.commit('loading', false);
      }
    }
  }
})
