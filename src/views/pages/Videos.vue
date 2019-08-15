<template>
    <div class="videos" v-if="videos">
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';
import { Video } from '@/models/dtos';

@Component
export default class VideosPage extends Vue {
    @Prop() protected videos!: Video[];
}
</script>

<style lang="sass">
    @import '../../scss/views/videos';
</style>