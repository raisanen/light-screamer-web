<template>
    <footer>
        <p v-html="footerText"></p>
        <Links :links="links"/>
    </footer>
</template>

<script lang="ts">
import Vue from 'vue';
import { Getter, Mutation, State } from 'vuex-class';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { Meta, Link, AirtableLink } from '@/models/airtable-record';
import Links from '@/components/Links.vue';

@Component({
  components: {
    Links
  },
})
export default class Footer extends Vue {
    @Getter protected meta!: Meta;
    @Getter protected links!: Link[];

    protected get footerLinks(): AirtableLink[] {
        return this.meta ? this.meta.linkItems : [];
    }
    protected get footerText(): string {
        return this.meta ? this.meta.footerText : '';
    }
}
</script>
<style lang="scss">
  @import '../scss/main';
</style>
