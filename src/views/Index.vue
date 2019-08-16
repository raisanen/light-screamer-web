<template>
  <div class="main">
    <Navigation :class="{loading: initializing}"/>
    <main class="content" v-if="currentPage" :class="{loading: initializing || loading}">
        <SplashComponent v-if="currentPage.splashItem" :splash="currentPage.splashItem"/>

        <router-view/>

        <Testimonials v-if="currentPage.testimonialItems" :testimonials="currentPage.testimonialItems" :columns="3"/>
    </main>
    <Footer :class="{loading: initializing}"/>
    <Lightbox/>
    <DynamicStyle :stylesheet="dynamicStyle"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter, Mutation, State } from 'vuex-class';

import moment from 'moment';

import { Page, Meta  } from '@/models/airtable-record';

import Box from '@/components/Box.vue';
import DynamicStyle from '@/components/DynamicStyle.vue';
import Navigation from '@/components/Navigation.vue';

const Testimonials = () => import(/* webpackChunkName: "component-testimonials" */ '@/components/Testimonials.vue');
const SplashComponent = () => import(/* webpackChunkName: "component-splash" */ '@/components/Splash.vue');
const Footer = () => import(/* webpackChunkName: "component-footer" */ '@/components/Footer.vue');
const Lightbox = () => import(/* webpackChunkName: "component-lightbox" */ '@/components/Lightbox.vue');

@Component({
  components: {
    DynamicStyle,
    Footer,
    Lightbox,
    Navigation,
    SplashComponent,
    Testimonials,
  },
})
export default class IndexPage extends Vue {
  @Getter protected initializing!: boolean;
  @Getter protected loading!: boolean;

  @Getter protected pages!: Page[];
  @Getter protected meta!: Meta;
  @Getter protected currentPage!: Page;

  protected get dynamicStyle(): string {
    const breakpoint = 700,
      black = (opacity: string = '1.0') => `rgba(20, 20, 20, ${opacity})`,
      img = this.currentPage && this.currentPage.imageThumbnails ? this.currentPage.imageThumbnails : null;

    return !(img) ? '' 
      : `
        @media (min-width: ${breakpoint + 1}px) {
          body { 
            background-image: linear-gradient(${black()}, ${black('0.2')} 20%, ${black('0.2')} 60%, ${black()} 100%),
              url(${img.full.url});
            background-blend-mode: multiply, luminosity;
          }
        }
        @media (max-width: ${breakpoint}px) {
          body { 
            background-image: url(${img.large.url});
          }
        }
      `;
  }

  private setTitle() {
    const metaTitle = this.meta ? this.meta.title : 'Light Screamer',
      pageTitle = this.currentPage ? this.currentPage.title : '';

    document.title = `${metaTitle} - ${pageTitle}`;
  }

  beforeMount() {
    this.$store.dispatch('initialize').then(() => this.setTitle());
    this.$router.afterEach(() => this.setTitle());
  }
}
</script>

<style lang="scss">
  @import '../scss/views/index';
</style>
