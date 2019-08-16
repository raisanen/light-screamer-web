<template>
    <picture v-if="image && image.thumbnails">
        <source media="(min-width: 901px)" :srcset="image.thumbnails.full.url">
        <source media="(min-width: 701px and max-width: 900px)" :srcset="image.thumbnails.large.url">
        <source media="(max-width: 700px)" :srcset="image.thumbnails.small.url">
        <img :src="image.thumbnails.small.url" :alt="image.title">
    </picture>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { AirtableImageItem} from '@/models/airtable-record';

@Component
export default class ResponsiveImage extends Vue {
    @Prop() protected image!: AirtableImageItem;
}
</script>