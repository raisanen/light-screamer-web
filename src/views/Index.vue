<template>
  <div class="main">
    <Navigation :class="{loading: initializing}"/>
    <main class="content" v-if="currentPage" :class="{loading: initializing || loading}">
        <SplashComponent v-if="currentPage.splashItem" :splash="currentPage.splashItem"/>
        <router-view/>
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

import { Page, Meta, AirtableEntryWithMetaTags, AirtableTestimonial, AirtableSplash  } from '@/models/airtable-record';

import Box from '@/components/Box.vue';
import DynamicStyle from '@/components/DynamicStyle.vue';
import Navigation from '@/components/Navigation.vue';

const SplashComponent = () => import(/* webpackChunkName: "component-splash" */ '@/components/Splash.vue');
const Footer = () => import(/* webpackChunkName: "component-footer" */ '@/components/Footer.vue');
const Lightbox = () => import(/* webpackChunkName: "component-lightbox" */ '@/components/Lightbox.vue');

@Component({
  components: {
    DynamicStyle,
    Footer,
    Lightbox,
    Navigation,
    SplashComponent
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

  private setTitleAndMeta() {
    const metaTitle = this.meta ? this.meta.title : 'Light Screamer',
      pageTitle = this.currentPage ? this.currentPage.title : '';

    document.title = `${metaTitle} - ${pageTitle}`;
  
    const setMetaTag = (name: string, content: string) => {
      if (content === '') {
        return;
      }
      document.querySelector(`meta[name=${name}]`).setAttribute('content', content);
    };

    const setMeta = (...from: AirtableEntryWithMetaTags[]) => {
      const description = (from || []).map((f) => f && f.metaDescription ? f.metaDescription : '').filter(d => !!d).join(' ').trim(),
        keywords = (from || []).map((f) => f && f.metaKeywords ? f.metaKeywords : '').filter(d => !!d).join(', ').trim();
      setMetaTag('description', description);
      setMetaTag('keywords', keywords);
    };

    if (this.meta || this.currentPage) {
      setMeta(this.meta, this.currentPage);
    }
  }

  beforeMount() {
    this.$store.dispatch('initialize').then(() => this.setTitleAndMeta());
    this.$router.afterEach(() => this.setTitleAndMeta());
  }
}
</script>
<style lang="scss">
  @import '../scss/main';
</style>
