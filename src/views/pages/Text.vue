<template>
    <div v-if="currentPage">
        <h1>{{currentPage.title}}</h1>
        <TextBox/>
        <Testimonials v-if="currentPage.testimonialItems" :testimonials="currentPage.testimonialItems" :columns="3"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import { Page } from '../../models/airtable-record';

const Testimonials = () => import(/* webpackChunkName: "component-testimonials" */ '@/components/Testimonials.vue');
const TextBox = () => import(/* webpackChunkName: "component-textbox" */ '@/components/TextBox.vue');

@Component({
    components: {
        TextBox,
        Testimonials
    }
})
export default class TextPage extends Vue {
    @Getter protected currentPage!:Page;
}
</script>
