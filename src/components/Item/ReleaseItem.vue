<template>
    <div class="release">
        <slot name="standard-header"/>
        <slot name="standard-image"/>
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
                <slot name="description"/>
            </div>
            <div v-if="item.trackList" class="col tracks">
                <h3>
                    <i class="fa fa-list-ol"></i>
                    Track listing
                </h3>
                <ol>
                    <li v-for="(track, index) in item.trackList" :key="index">
                        {{track}}
                    </li>
                </ol>
            </div>
        </div>
        <div class="related videos" v-if="item.videoItems && item.videoItems.length > 0">
            <h3>Videos</h3>
            <div class="cols cols-4">
                <div class="col" v-for="(v, index) in item.videoItems" :key="index">
                    <router-link class="youtube" v-if="v" :to="{path: '/videos', hash: v.id}">
                        <span>
                            <img v-if="v.imageThumbnails" :src="v.imageThumbnails.large.url" :alt="v.title"/>
                            <i class="fa fa-play-circle"></i>
                        </span>
                        {{v.title}}
                    </router-link>
                </div> 
            </div>
        </div>

        <slot name="testimonials"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { Release } from '@/models/airtable-record';

@Component({
    name: 'releases-item'
})
export default class ReleaseItem extends Vue {
    @Prop() protected item!: Release;
}
</script>

<style lang="scss">
    @import '../../scss/components/items/release-item';
</style>