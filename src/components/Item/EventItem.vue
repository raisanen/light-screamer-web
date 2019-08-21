<template>
    <div class="list-item--event">
        <h2 class="list-item__description">
            <a :href="item.url" target="_blank" rel="noreferrer">
                <slot name="date"/> / <slot name="title"/>
            </a>
        </h2>
        <div class="list-item__read-more-container" 
            :class="{'list-item__read-more-container--active': readmore}">
            <slot name="image"/>
            <h3>
                    <slot name="date"/>
                    &mdash;
                    <i>{{item.venue}}</i>
            </h3>
            <slot name="description"/>
        </div>
        <button class="list-item__read-more-button btn btn--invert" @click="readmore = true">
            <i class="fa fa-chevron-circle-down"></i>
            read more
        </button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { Event } from '@/models/airtable-record';

@Component({
    name: 'events-item'
})
export default class EventItem extends Vue {
    @Prop() protected item!: Event;

    protected readmore: boolean = false;
}
</script>
