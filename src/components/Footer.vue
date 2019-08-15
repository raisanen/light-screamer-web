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

import { Meta, Link } from '@/models/dtos';
import Links from '@/components/Links.vue';

@Component({
  components: {
    Links
  },
})
export default class Footer extends Vue {
    @Getter protected meta!: Meta;
    @Getter protected links!: Link[];

    protected get footerLinks(): Link[] {
        return this.meta ? this.meta.footerLinks : [];
    }
    protected get footerText(): string {
        return this.meta ? this.meta.footerText : '';
    }
}
</script>
<style lang="scss">
  @import '../scss/components/footer';
</style>

