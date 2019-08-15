<template>
    <div class="post">
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Post } from '../../models/dtos';

@Component({
    name: 'post-item'
})
export default class PostItem extends Vue {
    @Prop() protected item!: Post;
}
</script>