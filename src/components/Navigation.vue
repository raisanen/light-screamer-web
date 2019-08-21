<template>
  <nav class="navigation" :class="{'navigation--detached': detached}" v-if="pages">
    <div class="mobile-navigation" :class="{'mobile-navigation--active': showMenu, 'mobile-navigation--detached': mobileDetached}">
      <router-link @click.native="hideMenu()" to="/" class="mobile-navigation__logo" v-if="meta">
        <img v-if="logo" :src="logo.thumbnails.full.url" alt="Light Screamer"/>
      </router-link>
      <div class="mobile-navigation__heading" v-if="meta" >
        <router-link @click.native="hideMenu()" to="/">
          {{meta.title}}
        </router-link>
      </div>
      <button class="mobile-navigation__menu-button" @click="toggleMenu()" aria-label="Menu" role="button">
          <span class="mobile-navigation__icon"></span>
      </button>
    </div>
    <ul :class="{show: showMenu}" role="navigation">
      <li class="menu-link" v-for="page in pages" :key="page.id">
        <router-link  @click.native="hideMenu()" :class="page.slug" :to="`/${page.slug === 'home' ? '' : page.slug}`">
          <span v-if="meta && page.slug === 'home'">
            <ResponsiveImage :image="logo"/>
          </span>
          <span v-else>
            {{page.title}}
          </span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Getter, Mutation, State } from 'vuex-class';
import { Page, Meta, AirtableImageItem } from '@/models/airtable-record';

const ResponsiveImage = () => import(/* webpackChunkName: "component-responsive-img" */ '@/components/ResponsiveImage.vue');

@Component({
  components: {
    ResponsiveImage
  }
})
export default class Navigation extends Vue {
  @Getter protected pages!: Page[];
  @Getter protected meta!: Meta;

  protected showMenu: boolean = false;
  protected detached: boolean = false;
  protected mobileDetached: boolean = false;

  protected get logo(): AirtableImageItem {
    return this.meta && this.meta.imageItem ? this.meta.imageItem : null;
  }

  protected toggleMenu() {
    this.showMenu = !this.showMenu;
  }
  protected hideMenu() {
    this.showMenu = false;
  }

  created() {
    let lastY = 0;
    window.addEventListener('scroll', (ev) => {
      const currY = window.scrollY,
        deltaY = lastY - currY,
        absDelta = Math.abs(deltaY);

      this.detached = (currY > 0);

      if (absDelta > 50) {
        this.mobileDetached = deltaY < 0;
        lastY = currY;
      }
    });
  }
}
</script>

