<template>
    <div class="box text-box" v-if="currentPage && (pageHasDescription || pageHasLinks)">
        <p class="description" v-html="currentPage.description"></p>
        <Links v-if="currentPage.linkItems" :links="currentPage.linkItems" :title="currentPage.linksTitle"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';
import { Getter } from 'vuex-class';


import Links from '@/components/Links.vue';
import { Page } from '@/models/airtable-record';

@Component({
    components: {
        Links
    }
})
export default class TextBox extends Vue {
    @Getter protected currentPage!:Page;

    protected get pageHasLinks(): boolean {
        return this.currentPage.linkItems && this.currentPage.linkItems.length > 0;
    }

    protected get pageHasDescription(): boolean {
        return (this.currentPage ? this.currentPage.description || '' : '').trim().length > 0;
    }

}
</script>

