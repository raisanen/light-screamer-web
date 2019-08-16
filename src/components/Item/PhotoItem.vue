<template>
    <div class="photo" v-show="item && item.imageItem">
        <a @click="showLightbox()" :class="item.type || 'photo'">
            <ResponsiveImage :image="item.imageItem"/>
            <i v-if="item.type" :class="`fa fa-${item.type}`"></i>
        </a>
        <slot></slot>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { EntityWithImage } from '@/models/airtable-record';

const ResponsiveImage = () => import(/* webpackChunkName: "component-responsive-img" */ '@/components/ResponsiveImage.vue');

@Component({
    name: 'photos-item',
    components: {
        ResponsiveImage
    }
})
export default class PhotoItem extends Vue {
    @Prop() protected item!: EntityWithImage;

    protected showLightbox(): void {
        this.$store.dispatch('showLightbox', this.item.imageItem);
    }
}
</script>

<style lang="scss">
    @import '../../scss/components/items/photo-item';
</style>