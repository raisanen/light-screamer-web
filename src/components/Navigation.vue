<template>
  <nav id="nav">
    <button class="menu-button" :class="{active: showMenu}" @click="toggleMenu()">
      <span class="icon"></span>      
      <span>Light Screamer</span>
    </button>
    <ul :class="{show: showMenu}">
      <li class="menu-link" v-for="page in pages" :key="page.id">
        <router-link @click.native="toggleMenu()" :class="page.slug" :to="{name: 'home', params: { slug: page.slug }}">
          <span v-if="meta && page.slug === 'home'">
            <img :src="meta.logoUrl"/>
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
import { Page, Meta } from '@/models/dtos';

@Component
export default class Navigation extends Vue {
  @Getter protected pages!: Page[];
  @Getter protected meta!: Meta;

  protected showMenu: boolean = false;

  protected toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}
</script>
