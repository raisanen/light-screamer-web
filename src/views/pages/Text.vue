<template>
    <div v-if="currentPage" class="text-page">
        <h1 v-if="meta">
            <Lensed :text="meta.title"/>
        </h1>
        <h2>
            <Lensed :text="currentPage.title"/>
        </h2>
        <TextBox/>
        <Testimonials v-if="currentPage.testimonialItems" :testimonials="currentPage.testimonialItems" :columns="3"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import { Page, Meta } from '../../models/airtable-record';

const Lensed = () => import(/* webpackChunkName: "component-lensed" */ '@/components/Lensed.vue');
const Testimonials = () => import(/* webpackChunkName: "component-testimonials" */ '@/components/Testimonials.vue');
const TextBox = () => import(/* webpackChunkName: "component-textbox" */ '@/components/TextBox.vue');

@Component({
    components: {
        Lensed,
        TextBox,
        Testimonials
    }
})
export default class TextPage extends Vue {
    @Getter protected currentPage!:Page;
    @Getter protected meta!: Meta;
}
</script>
