<template>
    <div :class="`splash splash--${splash.entityType}`" v-if="splash">
        <p class="splash__text" v-html="splash.description"/>
        <a v-if="splash.entityType === 'splash'" target="_blank" rel="noreferrer"
                :class="`btn btn--solid btn--inverted btn--shiny btn--${splash.type}`" 
                :href="splash.url">
            <i v-if="splash.type" :class="`fa fa-${splash.type}`"></i>
            {{splash.label}}
        </a>
        <cite v-if="splash.entityType === 'testimonial'">
            &mdash; {{splash.label}}
        </cite>
    </div>    
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';
import { Splash, AirtableSplash, AirtableTestimonial } from '@/models/airtable-record';

@Component
export default class SplashComponent extends Vue {
    @Prop() protected splash!: AirtableSplash | AirtableTestimonial;
}
</script>
