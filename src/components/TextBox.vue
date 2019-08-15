<template>
    <div class="box text-box" v-if="currentPage">
        <h1 v-if="!hideTitle">{{currentPage.title}}</h1>
        <p class="description" v-html="currentPage.description"></p>
        <Links :links="currentPage.links" :title="currentPage.linksTitle"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';
import { Getter } from 'vuex-class';


import Links from '@/components/Links.vue';
import { Page } from '@/models/dtos';

@Component({
    components: {
        Links
    }
})
export default class TextBox extends Vue {
    @Prop() protected hideTitle?: boolean;

    @Getter protected currentPage!:Page;
}
</script>

<style lang="sass">
    @import '../scss/components/textbox';
</style>
