import Vue from 'vue';
import Vuex from 'vuex';

import moment from 'moment';

import AirtableService from '@/services/airtable.service';
import SocializerService from '@/services/instagram.service';

import { Page, Testimonial, Video, Release, Meta, Photo, Post, Link, Splash, AirtableEntry, Entity, EntityWithTestimonials, AirtableEntryWithTestimonials, AirtableEntryWithLinks, EntityWithLinks, EntityWithVideos, AirtableEntryWithVideos, EntityWithReleases, AirtableEntryWithReleases, AirtableEntryWithDate, EntityWithDate, AirtableImageItem, Thumbnails, AirtableImageSource, EntityWithImage, AirtableEntryWithImages } from '@/models/airtable-record';
import { InstagramPost, instagramItemToVideo, instagramItemToPhoto } from '@/models/socializer-dtos';

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

  lightboxImage: AirtableImageItem;
  currentPage: string;
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
  currentPage: null
};

export const testimonials = (item: AirtableEntryWithTestimonials, state: WebSiteState): EntityWithTestimonials => {
  return <EntityWithTestimonials>{
    testimonialItems: (item.testimonials || []).map((ti) => state.testimonials.find((t) => t.id === ti))
  };
},
  links = (item: AirtableEntryWithLinks, state: WebSiteState): EntityWithLinks => {
    return <EntityWithLinks>{
      linkItems: (item.links || []).map((li) => state.links.find((l) => l.id === li))
    };
  },
  videos = (item: AirtableEntryWithVideos, state: WebSiteState): EntityWithVideos => {
    return <EntityWithVideos>{
      videoItems: (item.videos || []).map((li) => state.videos.find((l) => l.id === li))
    };
  },
  releases = (item: AirtableEntryWithReleases, state: WebSiteState): EntityWithReleases => {
    return <EntityWithReleases>{
      releaseItems: (item.releases || []).map((li) => state.releases.find((l) => l.id === li))
    };
  };

const sortByDate = (a: {date: string}, b: {date: string}) => a.date < b.date ? 1 : -1;

export default new Vuex.Store<WebSiteState>({
  state: defaultState,
  getters: {
    currentPage: (state, getters) => getters.pages.find((p: Page) => p.slug === state.currentPage),
    lightboxImage: (state) => state.lightboxImage,
    initializing: (state) => state.initializing,
    meta: (state) => {
      const meta = state.meta && state.meta.length > 0 ? state.meta[0] : <Meta>{};
      return <Meta>{
        ...meta,
        ...links(meta, state)
      };
    },
    pages: (state) => {
      return state.pages.filter((p) => p.active).map((p) => {
        const splashes = (p.splash || []).map((pi) => state.splashes.find((s) => s.id === pi));
        return {
          ...p,
          ...testimonials(p, state),
          ...links(p, state),
          splashItem: splashes.length > 0 ? splashes[0] : null
        };
      }).sort((a, b) => a.sort - b.sort);
    },
    videos: (state) => {
      return [
        ...state.videos.map((v) => {
          return {
            ...v,
            ...releases(v, state)
          }
        }).sort(sortByDate),
        ...state.instagramImages.filter(i => i.type === 'video').map(instagramItemToVideo).sort(sortByDate)
      ];
    },
    releases: (state) => {
      return state.releases.map((r) => {
        return {
          ...r,
          ...testimonials(r, state),
          ...videos(r, state),
          trackList: (r.tracks || '').split("\n").map(t => t.trim().replace(/^\d+\.\s+/, '')).filter(t => t !== '')
        }
      }).sort(sortByDate);
    },
    photos: (state) => {
      return [
        ...state.photos,
        ...state.instagramImages.filter(i => i.type === 'image').map(instagramItemToPhoto)
      ].sort(sortByDate);
    },
    posts: (state) => state.posts,
    testimonials: (state) => state.testimonials,
    links: (state) => state.links,
    loading: (state) => state.loading
  },
  mutations: {
    currentPage(state, name: string) {
      state.currentPage = name;
    },
    lightbox(state, image: AirtableImageItem) {
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
      this.commit('pages', await service.fetch('pages'));
      this.commit('meta', await service.fetch('meta'));
      this.commit('initializing', false);
    },
    async loadData(_, payload: { update: string[]; }) {
      const tablesToUpdate = [... payload.update];

      if (tablesToUpdate.length > 0) {
        this.commit('loading', true);
        for (var table of tablesToUpdate) {
          if (table === 'instagram') {
            this.commit(table, await socializer.render());
          } else {
            this.commit(table, await service.fetch(table));
          }
        }
        this.commit('loading', false);
      }
    }
  }
})
