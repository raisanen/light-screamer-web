<template>
    <div class="lightbox-container" :class="{active: !!lightboxImage}" @click="close">
        <button class="close-button"><i class="fa fa-times"></i></button>
        <div class="lightbox dont-close" v-if="lightboxImage">
            <a :href="lightboxImage.url" target="_blank" rel="noreferrer">
                <ResponsiveImage :image="lightboxImage"/>
            </a>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Getter } from 'vuex-class';
import { AirtableImageItem } from '../models/airtable-record';

const ResponsiveImage = () => import(/* webpackChunkName: "component-responsive-img" */ '@/components/ResponsiveImage.vue');

@Component({
    components: {
        ResponsiveImage
    }
})
export default class Lighbox extends Vue {
    @Getter protected lightboxImage!: AirtableImageItem;

    protected close(event: MouseEvent): void {
        let elm = event.target as HTMLElement;
        while (elm && !elm.classList.contains('lightbox-container')) {
            if (elm.classList.contains('dont-close')) {
                return;
            }
            elm = elm.parentElement;
        }
        this.$store.dispatch('hideLightbox');
    }
}
</script>
<style lang="scss">
    @import '../scss/components/lightbox';
</style>