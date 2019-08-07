<template>
  <div class="main" :style="backgroundImage" v-if="!loading">
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
        <h1 v-if="currentPage.splash && currentPage.title">
          {{currentPage.title}}
        </h1>
        <div class="box" v-else>
          <h1 :class="{hidden: !!currentPage.splash}">{{currentPage.title}}</h1>
          <p v-if="currentPage.description" v-html="currentPage.description"></p>
          <Links :title="currentPage.linksTitle" :links="currentPage.links" :showLabels="true"/>
        </div>
        <ContentBox v-if="content.length > 0" :content="content"/>
        <ContentBox v-if="currentPage.testimonials" :content="currentPage.testimonials" :columns="3"/>

        <div class="box" v-if="currentPage.splash && (currentPage.description || currentPage.links)">
          <p v-if="currentPage.description" v-html="currentPage.description"></p>
          <Links :title="currentPage.linksTitle" :links="currentPage.links" :showLabels="true"/>
        </div>
    </main>
    <footer>
      <div class="box">
        <p>{{meta ? meta.footerText : ''}}</p>
        <Links :links="links"/>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter, Mutation, State } from 'vuex-class';
import { Page, Release, Video, Meta, Post, Photo, PageType, Link } from '@/models/dtos';
import Navigation from '@/components/Navigation.vue';
import ContentBox, { ValidContent } from '@/components/ContentBox.vue';
import Links from '@/components/Links.vue';

@Component({
  components: {
    ContentBox,
    Links,
    Navigation,
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
  @Getter protected links!: Link[];

  protected get currentPageId(): string {
    return this.$route.params.slug || 'home';
  };

  protected get currentPage(): Page | undefined | null {
    return this.pages ? this.pages.find(p => p.slug === this.currentPageId) : null;
  }

  protected get backgroundImage(): string {
    return this.currentPage ? `background-image: url(${this.currentPage.imageUrl});` : '';
  }

  protected get content(): ValidContent[] {
      switch (this.currentPage ? this.currentPage.type : PageType.Unknown) {
        case PageType.Posts: return this.posts;
        case PageType.Photos: return this.photos;
        case PageType.Releases: return this.releases;
        case PageType.Videos: return this.videos;
        default: return [];
      }
  }

  beforeMount() {
    this.$store.dispatch('loadData');
  }
}
</script>

