<template>
<div :class="containerClass" v-if="testimonials">
    <div class="box" v-for="(item, index) in testimonials" :key="index" :id="item.id">
        <div class="testimonial">
            <blockquote>{{item.quote}}</blockquote>
            <a class="source" v-if="item.sourceUrl" :href="item.sourceUrl">
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

    protected get containerClass(): string {
        return `boxes boxes-${this.columns || 1}`;
    }
}
</script>
