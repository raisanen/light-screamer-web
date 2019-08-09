<template>
    <div :class="boxClass">
        <div class="box-content">
            <h1 v-if="title && isTopLevel">{{title}}</h1>
            <h2 v-else-if="title">
                {{title}}
                <span v-if="date" class="date">{{date}}</span>
            </h2>
            <slot name="image"></slot>
            <slot name="pre-description"></slot>
     
            <div :class="descriptionContainerClass" v-if="description">
                <p class="description" v-html="description"></p>
                <slot name="sidebar"></slot>
            </div>

            <slot name="post-description"></slot>
            <slot name="pre-testimonials"></slot>

            <Testimonials v-if="testimonials" :testimonials="testimonials" :columns="testimonials.length % 2 === 0 ? 2 : 3"/>

            <slot name="post-testimonials"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import Testimonials from './Testimonials.vue';
import { Testimonial } from '@/models/dtos';

@Component({
    components: {
        Testimonials
    }
})
export default class Box extends Vue {
    @Prop() protected title?: string;
    @Prop() protected date?: string;
    @Prop() protected description?: string;
    @Prop() protected testimonials?: Testimonial[];
    @Prop() protected hasSidebar?: boolean;
    @Prop() protected isTopLevel?: boolean;
    @Prop() protected className?: string;

    protected get boxClass(): string {
        return `box ${this.className || ''}`;
    }

    protected get descriptionContainerClass(): string {
        return this.hasSidebar ? 'sidebar-container' : '';
    }
}
</script>

