<template>
    <div class="posts" v-if="posts">
        <ContentList :items="posts" columns="1" type="post"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Post } from '@/models/dtos';

import ContentList from '@/components/ContentList.vue';
import { Getter } from 'vuex-class';

@Component
export default class PostsPage extends Vue {
    @Getter protected posts!: Post[];
}
</script>

<style lang="sass">
    @import '../../scss/views/posts';
</style>