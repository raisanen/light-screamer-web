<template>
    <div :class="`list-item--video video--${item.type}`" v-if="item">
        <slot name="standard-header"/>
        <div v-html="item.embed" class="video__embed"/>
        <slot name="description"/>
        <div v-if="item.releaseItems" class="list-item__related video__releases">
            <h3>
                Appears on:
            </h3>
            <router-link v-for="(release, index) in item.releaseItems" :to="{path: '/releases', hash: release ? release.id : ''}" :key="index">
                <span class="video__image-icon" v-if="release && release.imageThumbnails">
                    <img :src="release.imageThumbnails.small.url" :alt="release.title">
                </span>
                {{release ? release.title : ''}}
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Video } from '@/models/airtable-record';

@Component({
    name: 'videos-item'
})
export default class VideoItem extends Vue {
    @Prop() protected item!: Video;
}
</script>
