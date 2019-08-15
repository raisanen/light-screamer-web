<template>
    <div class="video">
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Video } from '../../models/dtos';

@Component({
    name: 'video-item'
})
export default class VideoItem extends Vue {
    @Prop() protected item!: Video;
}
</script>