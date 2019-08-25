<template>
    <div :class="currentPageType" v-if="currentPage">
        <h1>{{currentPage.title}}</h1>
        <h2>Upcoming shows</h2>
        <template v-if="comingEvents && comingEvents.length > 0">
            <ContentList :items="comingEvents" :columns="1" :type="currentPageType"/>
        </template>
        <p v-else>
            No upcoming shows...
        </p>
        <div class="past-shows">
            <h2>Past shows</h2>
            <ContentList :items="pastEvents" :columns="1" :type="currentPageType"/>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Getter } from 'vuex-class';

import moment from 'moment';

import { Entity, Page, Event } from '@/models/airtable-record';

import ContentList from '@/components/ContentList.vue';

@Component({
    components: {
        ContentList,
    }
})
export default class EventListPage extends Vue {
    @Getter protected events!: Event[];
    @Getter protected currentPage!: Page;

    protected get today(): moment.Moment {
        return moment.utc();
    }

    protected get currentPageType(): string {
        return this.currentPage && this.currentPage.type ? this.currentPage.type : 'unknown';
    }

    protected get comingEvents(): Event[] {
        if (this.events) {
            return this.events.filter((e) => e.dateMoment.isSameOrAfter(this.today));
        }
        return [];
    }
    protected get pastEvents(): Event[] {
        if (this.events) {
            return this.events.filter((e) => e.dateMoment.isBefore(this.today));
        }
        return [];
    }
}
</script>
