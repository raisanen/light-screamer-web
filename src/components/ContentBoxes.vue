<template>
    <div :class="containerClass">
        <Box v-for="(item, index) in entries" :key="index" 
            :id="item.entry.id"
            :title="item.entry && item.entry.title" 
            :date="item.entry && item.entry.dateString" 
            :description="item.entry && item.entry.description" 
            :testimonials="item.entry && item.entry.testimonials"
            :hasSidebar="item.entry && item.hasTracks"
            >
            <template v-slot:image>
                <div class="embed" v-if="item.entry.embed" v-html="item.entry.embed"></div>
                <a class="image" v-else-if="item.entry.imageUrl" :href="item.entry.postLink ? item.entry.postLink : item.entry.imageUrl" target="_blank" rel="noreferrer">
                    <img :src="item.entry.imageUrl" :alt="item.entry.title"/>
                </a>
            </template>

            <template v-slot:pre-description v-if="item.entry.spotify || item.entry.bandcamp">
                <Links className="buttons">
                    <a  class="btn spotify" v-if="item.entry.spotify" :href="item.entry.spotify" target="_blank" rel="noreferrer">
                        <i class="fa fa-spotify"></i>
                        Spotify
                    </a>
                    <a class="btn bandcamp" v-if="item.entry.bandcamp" :href="item.entry.bandcamp" target="_blank" rel="noreferrer">
                        <i class="fa fa-bandcamp"></i>
                        Bandcamp
                    </a>
                </Links>
            </template>

            <template v-if="item.hasTracks" v-slot:sidebar>
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
            </template>

            <template v-if="item.hasReleases" v-slot:pre-testimonials>
                <Links :title="'Appears on the release' + (item.entry.releases.length !== 1 ? 's' : '')" className="releases">
                    <router-link class="web" v-for="release in item.entry.releases" :key="release.id" :to="{ name: 'home', params: { slug: 'releases'}, hash: `#${release.id}`}">
                        <span class="image-icon">
                            <img :src="release.imageUrl" :alt="release.title">
                        </span>
                        {{release.title}}
                    </router-link>
                </Links>
            </template>

            <template v-slot:post-testimonials>
                <div class="videos" v-if="item.hasVideos">
                    <h3>
                        <i class="fa fa-youtube"></i>
                        Videos
                    </h3>
                    <div class="video-list">
                        <router-link v-for="video in item.entry.videos" :key="video.id" class="youtube" :to="{name: 'home', params: { slug: 'videos' }, hash: `#${video.id}`}">
                            <img :src="video.imageUrl" :alt="video.title"/>
                            <span>{{video.title}}</span>
                            <i class="fa fa-youtube-play fa-2x"></i>
                        </router-link>
                    </div>
                </div>
            </template>
        </Box>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Prop, Component } from 'vue-property-decorator';
import { AirtableEntry, PageType, Post, Photo, Page, Release, Video, Testimonial } from '@/models/dtos';
import Links from '@/components/Links.vue';
import Testimonials from '@/components/Testimonials.vue';

import moment from 'moment';
import Box from './Box.vue';

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
        Box,
        Links,
        Testimonials
    }
})
export default class ContentBoxes extends Vue {
    @Prop() content!: ValidContent[];
    @Prop() columns?: number;

    protected get containerClass(): string {
        return `boxes boxes-${this.columns || 1}`;
    }

    protected get entries(): BoxEntry[] {
        const has = (c: any, prop: string): boolean => c && c[prop] && c[prop].length > 0;
        return (this.content || []).map((c) => {
            return <BoxEntry> {
                entry: { ...c },
                hasTestimonials: has(c, 'testimonials'),
                hasVideos: has(c, 'videos'),
                hasReleases: has(c, 'releases'),
                hasLinks: has(c, 'links'),
                hasTracks: has(c, 'tracks')
            }
        }).filter((c) => c.entry && c.entry.id);
    }

}
</script>
