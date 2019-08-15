<template>
    <div class="photo">
        <picture>
            <source media="(min-width: 701px)" :srcset="item.imageUrl">
            <source media="(max-width: 700px)" :srcset="item.thumbnailSmallUrl">
            <img :src="item.thumbnailSmallUrl" :alt="item.title">
        </picture>
        <slot></slot>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { AirtableImageEntry } from '../../models/dtos';

@Component({
    name: 'photo-item'
})
export default class PhotoItem extends Vue {
    @Prop() protected item!: AirtableImageEntry;
}
</script>

<style lang="scss">
    .photo {
        line-height: 0;
        img {
            max-width: 100%;
        }
    }
</style>