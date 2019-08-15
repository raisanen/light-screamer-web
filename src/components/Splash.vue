<template>
    <div class="splash" v-if="splash">
        <p v-html="splash.description"/>
        <a target="_blank" rel="noreferrer"
                :class="`btn solid inverted shiny ${splash.classes}`" 
                :href="splash.link">
            <i v-if="splash.icon" :class="`fa fa-${splash.icon}`"></i>
            {{splash.label}}
        </a>
    </div>    
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';
import { Splash } from '../models/dtos';

@Component
export default class SplashComponent extends Vue {
    @Prop() protected splash!: Splash;
}
</script>

<style lang="sass">
    @import '../scss/components/splash';
</style>