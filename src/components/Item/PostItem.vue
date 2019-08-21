<template>
    <div class="list-item--post">
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Post } from '@/models/airtable-record';

@Component({
    name: 'posts-item'
})
export default class PostItem extends Vue {
    @Prop() protected item!: Post;
}
</script>