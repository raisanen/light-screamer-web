<template>
    <div class="releases" v-if="releases">
        <ContentList :items="releases" columns="1" type="release"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Release } from '@/models/dtos';

import ContentList from '@/components/ContentList.vue';
import { Getter } from 'vuex-class';

@Component({
    components: {
        ContentList
    }
})
export default class ReleasesPage extends Vue {
    @Getter protected releases!: Release[];
}
</script>

<style lang="sass">
    @import '../../scss/views/releases';
</style>