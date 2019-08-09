import Vue from 'vue';
import Vuex from 'vuex';
import AirtableService from '@/services/airtable.service';
import { Page, Testimonial, Video, Release, PageType, Meta, Photo, Post, Link, Splash, AirtableTestimonialEntry } from './models/dtos';

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
  loading: false,
  meta: []
}
const idsToObjs = (entry: any, objName: string, state: any) => {
  const idKey = `${objName}Ids`,
    stateKey = `${objName}s`,
    obj: any = {};

  obj[stateKey] = (entry[idKey] || []).map((ti: string) => state[stateKey].find((t: {id: string}) => t.id === ti)); 

  return obj;
};
const makeGetter = (entryName: string) => {
  return (entry: any, state: WebSiteState) => idsToObjs(entry, entryName, state);
}
const testimonials = makeGetter('testimonial'),
  videos = makeGetter('video'),
  releases = makeGetter('release'),
  links = makeGetter('link');

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
          shouldShow: p.type === PageType.Text || p.type === PageType.Contact ||
            (p.type === PageType.Videos && state.videos && state.videos.length > 0) ||
            (p.type === PageType.Releases && state.releases && state.releases.length > 0) ||
            (p.type === PageType.Posts && state.posts && state.posts.length > 0) ||
            (p.type === PageType.Photos && state.photos && state.photos.length > 0),
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
    updatePages(state, pages: Page[]) {
      state.pages = [...pages];
    },
    updateTestimonials(state, testimonials: Testimonial[]) {
      state.testimonials = [...testimonials];
    },
    updateVideos(state, videos: Video[]) {
      state.videos = [...videos];
    },
    updateReleases(state, releases: Release[]) {
      state.releases = [...releases];
    },
    updateMeta(state, meta: Meta[]) {
      state.meta = [...meta];
    },
    updatePhotos(state, photos: Photo[]) {
      state.photos = [...photos];
    },
    updatePosts(state, posts: Post[]) {
      state.posts = [...posts];
    },
    updateLinks(state, links: Link[]) {
      state.links = [...links];
    },
    updateSplashes(state, splashes: Splash[]) {
      state.splashes = [...splashes];
    }
  },
  actions: {
    async loadData() {
      this.commit('loading');
      this.commit('updatePages', await service.pages());
      this.commit('updateTestimonials', await service.testimonials());
      this.commit('updateSplashes', await service.splashes());
      this.commit('updateVideos', await service.videos());
      this.commit('updateReleases', await service.releases());
      this.commit('updatePhotos', await service.photos());
      this.commit('updatePosts', await service.posts());
      this.commit('updateLinks', await service.links());
      this.commit('updateMeta', await service.meta());
      this.commit('loaded');
    }
  }
})
