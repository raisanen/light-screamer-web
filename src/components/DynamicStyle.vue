<template>
    <component :is="'style'" v-html="stylesheet"></component>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class DynamicStyle extends Vue {
    @Prop() protected stylesheet!: string;
}
</script>

