<template>
    <TextBox/>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';


const TextBox = () => import(/* webpackChunkName: "component-textbox" */ '@/components/TextBox.vue');

@Component({
    components: {
        TextBox
    }
})
export default class TextPage extends Vue {}
</script>
