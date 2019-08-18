<template>
    <div>
        <div :class="className">
            <div class="col" :class="item.type || ''" v-for="item in items" :key="item.id">
                <div class="box" :class="`${itemComponentName} ${item.type || ''}`">
                    <component :is="itemComponentName" :item="item" :id="item.id">
                        <template v-slot:title>{{item.title}}</template>
                        <template v-slot:date>{{item.date ? item.formattedDate : ''}}</template>
                        <template v-slot:description>
                            <p class="description" v-html="item.description"></p>
                        </template>
                        <template v-slot:testimonials>
                            <Testimonials v-if="item.testimonialItems" :testimonials="item.testimonialItems"/>
                        </template>
                        <template v-slot:image>
                            <ResponsiveImage v-if="item.image" :image="item.imageItem"/>
                        </template>
                        <template v-slot:type-icon>
                            <i v-if="item.type" :class="`fa fa-${item.type}`"></i>
                        </template>


                        <template v-slot:standard-header>
                            <h2>
                                <span>
                                    <i v-if="item.type" :class="`fa fa-${item.type}`"></i>
                                    {{item.title}}
                                </span>
                                <span class="date" v-if="item.date">
                                    {{item.formattedDate}}
                                </span>
                            </h2>
                        </template>
                        <template v-slot:standard-image>
                            <div class="image">
                                <LightBoxLink :image="item.imageItem" v-if="item.image">
                                    <ResponsiveImage :image="item.imageItem"/>
                                    <i v-if="item.type" :class="`fa fa-${item.type}`"></i>
                                </LightBoxLink>
                            </div>
                        </template>

                        <template v-slot:standard-footer>
                            <p class="description" v-html="item.description"></p>
                            <Testimonials v-if="item.testimonialItems" :testimonials="item.testimonialItems"/>
                        </template>
                    </component>

                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { Post, Video, Photo, Release, Page, Event } from '@/models/airtable-record';
import { Getter } from 'vuex-class';

const Testimonials = () => import(/* webpackChunkName: "component-testimonials" */ '@/components/Testimonials.vue');

const EventsItem = () => import(/* webpackChunkName: "component-eventitem" */ './Item/EventItem.vue');
const PostsItem = () => import(/* webpackChunkName: "component-postitem" */ './Item/PostItem.vue');
const VideosItem = () => import(/* webpackChunkName: "component-videoitem" */ './Item/VideoItem.vue');
const PhotosItem = () => import(/* webpackChunkName: "component-photoitem" */ './Item/PhotoItem.vue');
const ReleasesItem = () => import(/* webpackChunkName: "component-releaseitem" */ './Item/ReleaseItem.vue');
const ResponsiveImage = () => import(/* webpackChunkName: "component-responsive-img" */ '@/components/ResponsiveImage.vue');

const LightBoxLink = () => import(/* webpackChunkName: "component-lightboxlink" */ '@/components/LightboxLink.vue');


@Component({
    components: {
        EventsItem,
        PostsItem,
        VideosItem,
        PhotosItem,
        ReleasesItem,
        ResponsiveImage,
        Testimonials,
        LightBoxLink
    }
})
export default class ContentList extends Vue {
    @Prop() protected items!: (Post|Video|Photo|Release|Event)[];    
    @Prop() protected columns?: number;
    @Prop() protected type?: 'posts' | 'photos' | 'releases' | 'videos' | 'events';

    @Getter protected currentPage!: Page;

    protected get className(): string {
        return `content-list cols cols-${this.columns || 1} ${this.type}`;
    }

    protected get itemComponentName(): string {
        return (this.type || 'posts') + '-item';
    }
}
</script>

<style lang="scss">
    @import '../scss/components/content-list';
</style>