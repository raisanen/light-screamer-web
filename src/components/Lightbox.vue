<template>
    <div class="lightbox-container" :class="{active: !!lightboxImage}">
        <button class="close-button" @click="close()"><i class="fa fa-times"></i></button>
        <div class="lightbox" @click="close()">
            <img v-if="!!lightboxImage" :src="lightboxImage" alt="Lightboxed image">
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Getter } from 'vuex-class';

@Component
export default class Lighbox extends Vue {
    @Getter protected lightboxImage!: string;

    protected close(): void {
        this.$store.dispatch('hideLightbox');
    }
}
</script>
<style lang="scss">
    @import '../scss/components/lightbox';
</style>