<template>
    <div class="photo" v-show="item && item.imageItem">
        <slot name="standard-header"/>
        <slot name="standard-image"/>
        <slot name="description"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { EntityWithImage } from '@/models/airtable-record';

@Component({
    name: 'photos-item',
})
export default class PhotoItem extends Vue {
    @Prop() protected item!: EntityWithImage;
}
</script>

<style lang="scss">
    @import '../../scss/components/items/photo-item';
</style>