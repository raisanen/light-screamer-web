<template>
    <div class="links" v-if="links && links.length > 0">
        <h3 class="links-title" v-if="title">
            {{title}}
        </h3>
        <a :class="link.type" v-for="link in links" :key="link.id" :href="link.url">
            <i :class="`fa fa-${link.type}`"></i>
            <span v-if="showLabels">
                {{link.title}}
            </span>
        </a>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Link } from '../models/dtos';

@Component
export default class Links extends Vue {
    @Prop() links!: Link[];
    @Prop() showLabels?: boolean;
    @Prop() title?: string;
}
</script>
