<template>
    <div class="photo">
        <ResponsiveImage :image="item"/>
        <slot></slot>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { AirtableImageEntry } from '../../models/dtos';

const ResponsiveImage = () => import(/* webpackChunkName: "component-responsive-img" */ '@/components/ResponsiveImage.vue');

@Component({
    name: 'photo-item',
    components: {
        ResponsiveImage
    }
})
export default class PhotoItem extends Vue {
    @Prop() protected item!: AirtableImageEntry;
}
</script>

<style lang="scss">
    .photo {
        line-height: 0;
    }
</style>