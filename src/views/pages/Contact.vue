<template>
    <div class="contact"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';

@Component
export default class ContactPage extends Vue {}
</script>

<style lang="sass">
    @import '../../scss/views/contact';
</style>