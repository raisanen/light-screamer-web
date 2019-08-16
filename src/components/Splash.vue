<template>
    <div class="splash" v-if="splash">
        <p v-html="splash.description"/>
        <a target="_blank" rel="noreferrer"
                :class="`btn solid inverted shiny ${splash.type}`" 
                :href="splash.url">
            <i v-if="splash.type" :class="`fa fa-${splash.type}`"></i>
            {{splash.label}}
        </a>
    </div>    
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';
import { Splash, AirtableSplash } from '@/models/airtable-record';

@Component
export default class SplashComponent extends Vue {
    @Prop() protected splash!: AirtableSplash;
}
</script>

<style lang="sass">
    @import '../scss/components/splash';
</style>