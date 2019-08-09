<template>
  <div class="main" v-if="!loading">
    <Navigation/>
    <main class="content" v-if="currentPage">
        <div class="splash" v-if="currentPage.splash">
          <p v-html="currentPage.splash.description"/>
          <a target="_blank"
            :class="`btn solid inverted ${currentPage.splash.classes}`" 
            :href="currentPage.splash.link">
            <i v-if="currentPage.splash.icon" :class="`fa fa-${currentPage.splash.icon}`"></i>
            {{currentPage.splash.label}}
          </a>
        </div>

        <Box :class="{transparent: !(currentPage.description || (currentPage.links && currentPage.links.length > 0))}" :title="currentPage.title" :isTopLevel="true" :description="currentPage.description">
          <template v-slot:post-description v-if="currentPage.links && currentPage.links.length > 0">
            <Links :title="currentPage.linksTitle" :links="currentPage.links" :showLabels="true"/>
          </template>
        </Box>

        <ContentBoxes :class="(currentPageType === pageType.Photos ? 'photos' : '')" v-if="content.length > 0" :content="content" />

        <Testimonials v-if="currentPage.testimonials" :testimonials="currentPage.testimonials" :columns="3"/>
    </main>
    <Footer/>
    <div v-html="uglyBodyStyleHack"></div>
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

const UPDATE_TIMEOUT = 5;

@Component({
  components: {
    Box,
    ContentBoxes,
    Links,
    Navigation,
    Testimonials,
    Footer
  },
})
export default class Home extends Vue {
  @Getter protected loading!: boolean;
  @Getter protected pages!: Page[];
  @Getter protected releases!: Release[];
  @Getter protected videos!: Video[];
  @Getter protected meta!: Meta;
  @Getter protected posts!: Post[];
  @Getter protected photos!: Photo[];

  private lastUpdate: moment.Moment;

  protected pageType = PageType;

  protected get currentPageId(): string {
    return this.$route.params.slug || 'home';
  };

  protected get currentPage(): Page | undefined | null {
    return this.pages ? this.pages.find(p => p.slug === this.currentPageId) : null;
  }

  protected get currentPageType(): PageType {
    return this.currentPage ? this.currentPage.type : PageType.Unknown;
  }

  protected get backgroundImage(): string {
    return this.currentPage ? `background-image: url(${this.currentPage.imageUrl});` : '';
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

  protected get uglyBodyStyleHack(): string {
    return this.currentPage ? `<style>body { background-image: url(${this.currentPage.imageUrl}), linear-gradient(#282828, #fff, #fff, #121212); background-blend-mode: multiply, normal; }</style>` : '';
  }

  private setBackground() {
    const body = document.querySelector('body');
    body.style.backgroundImage = this.backgroundImage;
    console.log(body.style.backgroundImage);
  }

  private setTitle() {
    const metaTitle = this.meta ? this.meta.title : 'Light Screamer',
      pageTitle = this.currentPage ? this.currentPage.title : '';

    document.title = `${metaTitle} - ${pageTitle}`;
  }

  private reloadData() {
    this.$store.dispatch('loadData', true).then(() => this.onUpdate());
  }

  private onUpdate() {
    this.setTitle();
    this.setBackground();

    if (this.lastUpdate.isBefore(moment.utc().add(-5, 'minutes'))) {
      this.lastUpdate = moment.utc();
      this.reloadData();
    }
  }

  beforeMount() {
    this.lastUpdate = moment.utc();
    this.$store.dispatch('loadData', false).then(() => this.onUpdate());
    this.$router.afterEach(() => this.onUpdate());
  }
}
</script>

