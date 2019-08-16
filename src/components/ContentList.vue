<template>
    <div>
        <h1 v-if="currentPage">
            {{currentPage.title}}
        </h1>
        <div :class="className">
            <div class="col" :class="item.type || ''" v-for="item in items" :key="item.id">
                <div class="box" :class="`${itemComponentName} ${item.type || ''}`">
                    <h2>
                        <span>
                            <i v-if="item.type" :class="`fa fa-${item.type}`"></i>
                            {{item.title}}
                        </span>
                        <span class="date" v-if="item.date">
                            {{item.formattedDate}}
                        </span>
                    </h2>
                    <component :is="itemComponentName" :item="item" :id="item.id">
                        <p class="description" v-html="item.description"></p>
                    </component>

                    <Testimonials v-if="item.testimonialItems" :testimonials="item.testimonialItems"/>
                </div>
            </div>
        </div>
        <TextBox v-if="currentPage && (currentPage.description || currentPage.linkItems)" :hideTitle="true"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { Post, Video, Photo, Release, Page } from '@/models/airtable-record';
import { Getter } from 'vuex-class';

const TextBox = () => import(/* webpackChunkName: "component-textbox" */ '@/components/TextBox.vue');
const Testimonials = () => import(/* webpackChunkName: "component-testimonials" */ '@/components/Testimonials.vue');
const PostsItem = () => import(/* webpackChunkName: "component-postitem" */ './Item/PostItem.vue');
const VideosItem = () => import(/* webpackChunkName: "component-videoitem" */ './Item/VideoItem.vue');
const PhotosItem = () => import(/* webpackChunkName: "component-photoitem" */ './Item/PhotoItem.vue');
const ReleasesItem = () => import(/* webpackChunkName: "component-releaseitem" */ './Item/ReleaseItem.vue');

@Component({
    components: {
        PostsItem,
        VideosItem,
        PhotosItem,
        ReleasesItem,
        Testimonials,
        TextBox
    }
})
export default class ContentList extends Vue {
    @Prop() protected items!: (Post|Video|Photo|Release)[];    
    @Prop() protected columns?: number;
    @Prop() protected type?: 'posts' | 'photos' | 'releases' | 'videos';

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