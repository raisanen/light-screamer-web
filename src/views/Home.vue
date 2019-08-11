<template>
  <div class="main">
    <Navigation :class="{loading: initializing}"/>
    <main class="content" v-if="currentPage" :class="{loading: initializing || loading}">
        <div class="splash" v-if="currentPage.splash">
          <p v-html="currentPage.splash.description"/>
          <a target="_blank" rel="noreferrer"
            :class="`btn solid inverted shiny ${currentPage.splash.classes}`" 
            :href="currentPage.splash.link">
            <i v-if="currentPage.splash.icon" :class="`fa fa-${currentPage.splash.icon}`"></i>
            {{currentPage.splash.label}}
          </a>
        </div>

        <Box :class="{transparent: !(currentPage.description || (currentPage.links && currentPage.links.length > 0))}" 
            :title="currentPage.title" :isTopLevel="true" :description="currentPage.description">
          <template v-slot:post-description v-if="currentPage.links && currentPage.links.length > 0">
            <Links :title="currentPage.linksTitle" :links="currentPage.links" :showLabels="true"/>
          </template>
        </Box>

        <div class="loading-container" :class="{loading: loading}">
          <ContentBoxes :class="(currentPageType === pageType.Photos ? 'photos' : '')" v-if="!loading && content && content.length > 0" :content="content" />
        </div>

        <Testimonials v-if="currentPage.testimonials" :testimonials="currentPage.testimonials" :columns="3"/>
    </main>
    <Footer :class="{loading: initializing}"/>
    <DynamicStyle :stylesheet="dynamicStyle"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter, Mutation, State } from 'vuex-class';

import moment from 'moment';

import { Page, Release, Video, Meta, Post, Photo, PageType, Link } from '@/models/dtos';

import Navigation from '@/components/Navigation.vue';
import ContentBoxes, { ValidContent } from '@/components/ContentBoxes.vue';
import Links from '@/components/Links.vue';
import Testimonials from '@/components/Testimonials.vue';
import Footer from '@/components/Footer.vue';
import Box from '@/components/Box.vue';
import DynamicStyle from '@/components/DynamicStyle.vue';

const UPDATE_TIMEOUT = 5;

@Component({
  components: {
    Box,
    ContentBoxes,
    DynamicStyle,
    Footer,
    Links,
    Navigation,
    Testimonials,
  },
})
export default class Home extends Vue {
  @Getter protected initializing!: boolean;
  @Getter protected loading!: boolean;

  @Getter protected pages!: Page[];
  @Getter protected releases!: Release[];
  @Getter protected videos!: Video[];
  @Getter protected meta!: Meta;
  @Getter protected posts!: Post[];
  @Getter protected photos!: Photo[];

  private tableLoaded: {[key: string]: boolean} = {};
  private lastUpdate: moment.Moment;

  protected pageType = PageType;

  protected get currentPageId(): string {
    return this.$route.params.slug || 'home';
  }

  protected get currentPage(): Page | undefined | null {
    return this.pages ? this.pages.find(p => p.slug === this.currentPageId) : null;
  }

  protected get currentPageType(): PageType {
    return this.currentPage ? this.currentPage.type : PageType.Unknown;
  }

  protected get content(): ValidContent[] {
      switch (this.currentPageType) {
        case PageType.Posts: return this.posts;
        case PageType.Photos: return this.photos;
        case PageType.Releases: return this.releases;
        case PageType.Videos: return this.videos;
        default: return [];
      }
  }

  protected tablesToUpdate(isMount: boolean = true): string[] {
    const tables = [];

    if (isMount) {
      tables.push('links', 'splashes', 'testimonials');
    }
    switch (this.currentPageType) {
      case PageType.Posts:
        tables.push('posts'); break;
      case PageType.Photos:
        tables.push('photos'); break;
      case PageType.Releases:
        tables.push('releases', 'videos');
        break;
      case PageType.Videos:
        tables.push('videos', 'releases');
        break;
    }

    return tables;
  }

  protected get dynamicStyle(): string {
    const breakpoint = 700,
      black = (opacity: string = '1.0') => `rgba(20, 20, 20, ${opacity})`;

    return !this.currentPage ? '' 
      : `
        @media (min-width: ${breakpoint + 1}px) {
          body { 
            background-image: linear-gradient(${black()}, ${black('0.2')} 20%, ${black('0.2')} 60%, ${black()} 100%),
              url(${this.currentPage.imageUrl});
            background-blend-mode: multiply, luminosity;
          }
        }
        @media (max-width: ${breakpoint}px) {
          body { 
            background-image: url(${this.currentPage.imageUrl});
          }
        }
      `;
  }

  private setTitle() {
    const metaTitle = this.meta ? this.meta.title : 'Light Screamer',
      pageTitle = this.currentPage ? this.currentPage.title : '';

    document.title = `${metaTitle} - ${pageTitle}`;
  }

  private reloadData() {
    const tables = Object.keys(this.tableLoaded);
    if (tables.length > 0) {
      this.$store.dispatch('loadData', { update: tables, overwrite: true }).then(() => this.onUpdate());
    }
  }

  private onUpdate() {
    this.setTitle();
    if (this.lastUpdate.isBefore(moment.utc().add(-5, 'minutes'))) {
      this.lastUpdate = moment.utc();
      this.reloadData();
    }
  }

  private loadCurrent(isMount: boolean) {
    const tables = this.tablesToUpdate(isMount).filter((t) => !this.tableLoaded[t]);
    if (tables.length > 0) {
      this.$store.dispatch('loadData', { update: this.tablesToUpdate(isMount) })
        .then(() => {
          tables.forEach((t) => this.tableLoaded[t] = true);
          this.onUpdate();
        });
    }
  }

  beforeMount() {
    this.lastUpdate = moment.utc();
    this.$store.dispatch('initialize').then(() => {
      this.tableLoaded = {
        ...this.tableLoaded,
        ...{pages: true, meta: true}
      };
      this.loadCurrent(true);
    });
    this.$router.afterEach(() => this.loadCurrent(false));
  }
}
</script>

