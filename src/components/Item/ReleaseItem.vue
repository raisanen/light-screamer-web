<template>
    <div class="release">
        <PhotoItem :item="item"/>
        <div class="buttons">
            <a class="btn bandcamp" v-if="item.bandcamp" :href="item.bandcamp" target="_blank" rel="noreferrer">
                <i class="fa fa-bandcamp"></i> Bandcamp
            </a>
            <a class="btn spotify" v-if="item.spotify" :href="item.spotify" target="_blank" rel="noreferrer">
                <i class="fa fa-spotify"></i> Spotify
            </a>
        </div>
        <div class="cols cols-2 description-and-tracks">
            <div class="col description">
                <slot/>
            </div>
            <div v-if="item.tracks" class="col tracks">
                <h3>
                    <i class="fa fa-list-ol"></i>
                    Track listing
                </h3>
                <ol>
                    <li v-for="(track, index) in item.tracks" :key="index">
                        {{track}}
                    </li>
                </ol>
            </div>
        </div>
        <div class="related videos" v-if="item.videos && item.videos.length > 0">
            <h3>Videos</h3>
            <div class="cols cols-3">
                <div class="col" v-for="(v, index) in item.videos" :key="index">
                    <router-link class="youtube" v-if="v" :to="{path: '/videos', hash: v.id}">
                        <span>
                            <ResponsiveImage :image="v"/>
                            <i class="fa fa-play-circle"></i>
                        </span>
                        {{v.title}}
                    </router-link>
                </div> 
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Release } from '@/models/dtos';


const PhotoItem = () => import(/* webpackChunkName: "component-photoitem" */ '@/components/Item/PhotoItem.vue');
const ResponsiveImage = () => import(/* webpackChunkName: "component-responsive-img" */ '@/components/ResponsiveImage.vue');
@Component({
    name: 'release-item',
    components: {
        PhotoItem,
        ResponsiveImage
    }
})
export default class ReleaseItem extends Vue {
    @Prop() protected item!: Release;
}
</script>

<style lang="scss">
    @import '../../scss/components/items/release-item';
</style>