<template>
    <div :class="currentPageType" v-if="items">
        <ContentList :items="items" :columns="numColumns" :type="currentPageType"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Photo, Entity, Page } from '@/models/airtable-record';

import ContentList from '@/components/ContentList.vue';
import { Getter } from 'vuex-class';

@Component({
    components: {
        ContentList
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

    beforeMount() {
        console.log(this.currentPageType);
        if (this.$store.getters[this.currentPageType]) {
            console.log(this.$store.getters[this.currentPageType]);
        }
    }
}
</script>

<style lang="sass">
    @import '../../scss/views/list';
</style>