<template>
    <div :class="containerClass">
        <h3 class="links-title" v-if="title">
            <i v-if="icon" :class="iconClass"></i>
            {{title}}
        </h3>
        <slot>
            <a :class="link.type" v-for="link in defaultLinks" :key="link.id" :href="link.url" :aria-label="link.title" 
                rel="noreferrer" target="_blank">
                <i :class="`fa fa-${link.type}`"></i>
                <span v-if="showLabels">
                    {{link.title}}
                </span>
            </a>
        </slot>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Link } from '../models/dtos';

@Component
export default class Links extends Vue {
    @Prop() protected links?: Link[];
    @Prop() protected showLabels?: boolean;

    @Prop() protected title?: string;
    @Prop() protected icon?: string;
    @Prop() protected className?: string;

    protected get defaultLinks(): Link[] {
        return (this.links || []).filter((l) => l && l.id);
    }

    protected get containerClass(): string {
        return `links ${this.className || ''}`;
    }

    protected get iconClass(): string {
        return this.icon ? `fa fa-${this.icon}` : '';
    }
}
</script>
