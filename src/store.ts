import Vue from 'vue';
import Vuex from 'vuex';
import AirtableService from '@/services/airtable.service';
import { Page, Testimonial, Video, Release, Meta, Photo, Post, Link, Splash } from './models/dtos';
import SocializerService, { InstagramPost } from './services/instagram.service';
import moment from 'moment';

Vue.use(Vuex);

const service = new AirtableService(),
  socializer = new SocializerService();

export interface WebSiteState {
  pages: Page[];
  testimonials: Testimonial[];
  videos: Video[];
  releases: Release[];
  photos: Photo[];
  instagramImages: InstagramPost[];
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
  instagramImages: [],
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
  'posts': service.posts,
  'instagram': socializer.get
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
    photos: (state) => {
      return [
        ...state.photos,
        ...state.instagramImages.filter(i => i.type === 'image').map((i) => {
          return <Photo>{
            id: i.id,
            date: moment.utc(i.posted),
            dateString:  moment.utc(i.posted).format('YYYY-MM-DD'),
            description: i.message
              .replace(/#(\S+)/g,'<a href="https://instagram.com/explore/tags/$1/" rel="noreferrer" target="_blank">#$1</a>')
              .replace(/@(\S+)/g,'<a href="https://instagram.com/$1" rel="noreferrer" target="_blank">@$1</a>'),
            imageUrl: i.imageLargeUrl,
            thumbnailSmallUrl: i.imageSmallUrl,
            thumbnailLargeUrl: i.imageLargeUrl,
            postLink: i.postLink,
            title: i.postByUser,
            type: 'instagram'
          }
        })
      ].sort((a, b) => a.date < b.date ? 1 : -1);
    },
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
    instagram(state, posts: InstagramPost[]) {
      console.log(posts);
      state.instagramImages = [...posts];
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
          this.commit(table, await allUpdates[table].call(table === 'instagram' ? socializer : service, overwrite));
        }
        !overwrite && this.commit('loading', false);
      }
    }
  }
})
