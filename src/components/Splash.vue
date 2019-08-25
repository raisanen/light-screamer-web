<template>
    <div :class="`splash splash--${splash.entityType}`" v-if="splash">
        <p class="splash__text">
            {{descriptionPreamble}}
            <span :if="descriptionLensed" class="lensed"><span class="c-4">{{descriptionLensed}}</span></span>
            {{descriptionPost}}
        </p>
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

    protected get descriptionPreamble(): string {
        const parts = this.descriptionParts;
        if (parts.length > 0) {
            return parts[0];
        }
        return '';
    }
    protected get descriptionLensed(): string {
        const parts = this.descriptionParts;
        if (parts.length > 1) {
            return parts[1];
        }
        return '';
    }
    
    protected get descriptionPost(): string {
        const parts = this.descriptionParts;
        if (parts.length > 2) {
            return parts[2];
        }
        return '';
    }

    protected get descriptionParts(): string[] {
        return this.splash ? this.splash.description.split(/<\/?i>/) : [];
    }
}
</script>
