<template>
    <div class="video" v-if="item">
        <div v-html="item.embed" class="video-embed"/>
        <slot/>
        <div v-if="item.releases" class="related releases">
            <h3>
                Appears on:
            </h3>
            <router-link v-for="(release, index) in item.releases" :to="{path: '/releases', hash: release ? release.id : ''}" :key="index">
                <img class="image-icon" :src="release ? release.thumbnailSmallUrl : ''"/>
                {{release ? release.title : ''}}
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Video } from '../../models/dtos';

@Component({
    name: 'video-item'
})
export default class VideoItem extends Vue {
    @Prop() protected item!: Video;
}
</script>
<style lang="scss">
    @import '../../scss/components/items/video-item';
</style>