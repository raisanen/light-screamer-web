<template>
    <div class="event">
        <h2>
            <a :href="item.url" target="_blank" rel="noreferrer">
                <slot name="date"/> / <slot name="title"/>
            </a>
        </h2>
        <slot name="image"/>
        <h3>
                <slot name="date"/>
                &mdash;
                <i>{{item.venue}}</i>
        </h3>
        <slot name="description"/>
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
}
</script>

<style lang="scss">
    @import '../../scss/components/items/event-item';
</style>