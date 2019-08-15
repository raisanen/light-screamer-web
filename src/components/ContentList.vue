<template>
    <div :class="className">
        <div class="col" v-for="item in items" :key="item.id">
            <div class="box" :class="itemComponentName">
                <h2>
                    {{item.title}}
                    <span class="date" v-if="item.date">
                        {{item.dateString}}
                    </span>
                </h2>
                <component :is="itemComponentName" :item="item" :id="item.id">
                    <p class="description" v-html="item.description"></p>
                </component>

                <Testimonials v-if="item.testimonials" :testimonials="item.testimonials"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { Post, Video, Photo, Release } from '@/models/dtos';

const Testimonials = () => import(/* webpackChunkName: "component-testimonials" */ '@/components/Testimonials.vue');
const PostItem = () => import(/* webpackChunkName: "component-postitem" */ './Item/PostItem.vue');
const VideoItem = () => import(/* webpackChunkName: "component-videoitem" */ './Item/VideoItem.vue');
const PhotoItem = () => import(/* webpackChunkName: "component-photoitem" */ './Item/PhotoItem.vue');
const ReleaseItem = () => import(/* webpackChunkName: "component-releaseitem" */ './Item/ReleaseItem.vue');

@Component({
    components: {
        PostItem,
        VideoItem,
        PhotoItem,
        ReleaseItem,
        Testimonials
    }
})
export default class ContentList extends Vue {
    @Prop() protected items!: (Post|Video|Photo|Release)[];    
    @Prop() protected columns?: number;
    @Prop() protected type?: 'post' | 'photo' | 'release' | 'video';

    protected get className(): string {
        return `content-list cols cols-${this.columns || 1}`;
    }

    protected get itemComponentName(): string {
        return (this.type || 'post') + '-item';
    }
}
</script>

<style lang="scss">
    @import '../scss/components/content-list';
</style>