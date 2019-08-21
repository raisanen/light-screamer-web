<template>
    <div :class="currentPageType" v-if="currentPage && items">
        <h1>{{currentPage.title}}</h1>
        <Testimonials v-if="currentPage.testimonialItems && !currentPage.splashTestimonial" :testimonials="currentPage.testimonialItems" :columns="3"/>
        <ContentList :items="items" :columns="numColumns" :type="currentPageType"/>
        <TextBox/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Getter } from 'vuex-class';

import { Entity, Page } from '@/models/airtable-record';
import ContentList from '@/components/ContentList.vue';

const Testimonials = () => import(/* webpackChunkName: "component-testimonials" */ '@/components/Testimonials.vue');
const TextBox = () => import(/* webpackChunkName: "component-textbox" */ '@/components/TextBox.vue');

@Component({
    components: {
        ContentList,
        Testimonials,
        TextBox
    }
})
export default class ListPage extends Vue {
    @Getter protected currentPage!: Page;

    protected get currentPageType(): string {
        return this.currentPage && this.currentPage.type ? this.currentPage.type : 'unknown';
    }

    protected get numColumns(): number {
        return (this.currentPageType === 'photos') ? 2 : 1;
    }

    protected get items(): Entity[] {
        if (this.$store.getters[this.currentPageType]) {
            return this.$store.getters[this.currentPageType];
        }
        return [];
    }
}
</script>
