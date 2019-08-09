<template>
    <div :class="containerClass">
        <div class="box" v-for="(item, index) in entries" :key="index" :id="item.entry.id">
            <div>
            <h2 v-if="item.entry.title">
                {{item.entry.title}}
                <span class="date" v-if="item.entry.date && item.entry.dateString">
                    {{item.entry.dateString}}
                </span>
            </h2>

            <div class="embed" v-if="item.entry.embed" v-html="item.entry.embed"></div>
            <a class="image" v-else-if="item.entry.imageUrl" :href="item.entry.imageUrl" target="_blank">
                <img :src="item.entry.imageUrl"/>
            </a>

            <div class="buttons links" v-if="item.entry.spotify || item.entry.bandcamp">
                <a class="btn spotify" v-if="item.entry.spotify" :href="item.entry.spotify" target="_blank">
                    <i class="fa fa-spotify"></i>
                    Spotify
                </a>
                <a class="btn bandcamp" v-if="item.entry.bandcamp" :href="item.entry.bandcamp" target="_blank">
                    <i class="fa fa-bandcamp"></i>
                    Bandcamp
                </a>
            </div>

            <div v-if="item.hasTracks && item.entry.description" class="flex-split sixty-forty">
                <p v-html="item.entry.description"/>
                <div class="tracks">
                    <h3>
                        <i class="fa fa-list-ol"></i>
                        Track listing
                    </h3>
                    <ol>
                        <li v-for="(track, index) in item.entry.tracks" :key="index">
                            {{track}}
                        </li>
                    </ol>
                </div>

            </div>
            <p class="description" v-else-if="item.entry.description" v-html="item.entry.description"/>

            <div class="links releases" v-if="item.entry.releases">
                <h3 class="links-title">Appears on the album</h3>
                <router-link class="web" v-for="release in item.entry.releases" :key="release.id" :to="{ name: 'home', params: { slug: 'releases'}, hash: `#${release.id}`}">
                    <i class="fa fa-circle-o"></i>
                    {{release.title}}
                </router-link>
            </div>

            <Testimonials v-if="item.hasTestimonials" :testimonials="item.entry.testimonials" :columns="item.entry.testimonials.length % 2 === 0 ? 2 : 3"/>

            <div class="videos" v-if="item.hasVideos">
                <h3>
                    <i class="fa fa-youtube"></i>
                    Videos
                </h3>
                <div class="video-list">
                    <router-link v-for="video in item.entry.videos" :key="video.id" class="youtube" :to="{name: 'home', params: { slug: 'videos' }, hash: `#${video.id}`}">
                        <img :src="video.imageUrl"/>
                        <span>{{video.title}}</span>
                        <i class="fa fa-youtube-play fa-2x"></i>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Prop, Component } from 'vue-property-decorator';
import { AirtableEntry, PageType, Post, Photo, Page, Release, Video, Testimonial } from '@/models/dtos';
import Links from '@/components/Links.vue';
import Testimonials from '@/components/Testimonials.vue';

import moment from 'moment';

export type ValidContent = Post | Photo | Release | Video;

interface BoxEntry {
    entry: ValidContent;
    hasTestimonials: boolean;
    hasVideos: boolean;
    hasReleases: boolean;
    hasLinks: boolean;
    hasTracks: boolean;
}

@Component({
    components: {
        Links,
        Testimonials
    }
})
export default class ContentBox extends Vue {
    @Prop() content!: ValidContent[];
    @Prop() columns?: number;

    protected get containerClass(): string {
        return `boxes boxes-${this.columns || 1}`;
    }

    protected get entries(): BoxEntry[] {
        const has = (c: any, prop: string): boolean => c[prop] && c[prop].length > 0;
        return this.content.map((c) => {
            return <BoxEntry> {
                entry: c,
                hasTestimonials: has(c, 'testimonials'),
                hasVideos: has(c, 'videos'),
                hasReleases: has(c, 'releases'),
                hasLinks: has(c, 'links'),
                hasTracks: has(c, 'tracks')
            }
        });
    }

}
</script>
