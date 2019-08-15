<template>
    <picture v-if="image">
        <source media="(min-width: 901px)" :srcset="image.imageUrl">
        <source media="(min-width: 701px and max-width: 900px)" :srcset="image.thumbnailLargeUrl">
        <source media="(max-width: 700px)" :srcset="image.thumbnailSmallUrl">
        <img :src="image.thumbnailSmallUrl" :alt="image.title">
    </picture>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { AirtableImageEntry } from '../models/dtos';

@Component
export default class ResponsiveImage extends Vue {
    @Prop() protected image!: AirtableImageEntry;
}
</script>