<template>
    <a @click="showLightbox()">
        <slot/>
    </a>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { AirtableImageItem } from '@/models/airtable-record';


@Component
export default class PhotoItem extends Vue {
    @Prop() protected image!: AirtableImageItem;

    protected showLightbox(): void {
        this.$store.dispatch('showLightbox', this.image);
    }
}
</script>
