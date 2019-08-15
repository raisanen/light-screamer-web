<template>
    <div class="videos" v-if="videos">
        <ContentList :items="videos" columns="1" type="video"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Video } from '@/models/dtos';
import { Getter } from 'vuex-class';
import ContentList from '@/components/ContentList.vue';

@Component({
    components: {
        ContentList
    }
})
export default class VideosPage extends Vue {
    @Getter protected videos!: Video[];
}
</script>

<style lang="sass">
    @import '../../scss/views/videos';
</style>