<template>
    <div class="photos" v-if="photos">
        <ContentList :items="photos" columns="2" type="photo"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Photo } from '@/models/dtos';

import ContentList from '@/components/ContentList.vue';
import { Getter } from 'vuex-class';

@Component({
    components: {
        ContentList
    }
})
export default class PhotosPage extends Vue {
    @Getter protected photos!: Photo[];
}
</script>

<style lang="sass">
    @import '../../scss/views/photos';
</style>