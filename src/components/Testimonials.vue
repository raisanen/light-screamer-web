<template>
<div :class="containerClass" v-if="testimonials && testimonials.length > 0">
    <div class="col" v-for="(item, index) in testimonials" :key="index" :id="item ? item.id : ''">
        <div class="box testimonial" v-if="item">
            <blockquote>{{item.quote}}</blockquote>
            <a class="source" v-if="item.sourceUrl" :href="item.sourceUrl" target="_blank" rel="noreferrer">
                {{item.source}}
            </a>
            <span class="source" v-else>
                {{item.source}}
            </span>
        </div>
    </div>
</div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Testimonial } from '../models/dtos';

@Component
export default class Testimonials extends Vue {
    @Prop() protected testimonials!:Testimonial[];
    @Prop() columns?: number;

    protected get numColumns(): number {
        return Math.min(this.columns || 1, this.testimonials.length);
    }

    protected get containerClass(): string {
        return `testimonials cols cols-${this.numColumns}`;
    }
}
</script>
<style lang="scss">
    @import '../scss/components/testimonials';
</style>