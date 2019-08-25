<template>
    <span class="lensed" :if="text">
        <span v-for="(c, index) in textArray" 
            :class="c.class" :key="index">{{c.char}}</span>
    </span>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

interface LensChar {
    char: string;
    class: string;
}

@Component
export default class Lensed extends Vue {
    @Prop() private text!: string;

    private get textArray(): LensChar[] {
        if (!this.text) {
            return [];
        }
        const chars = this.text.split('');
        const max = Math.min(5, Math.ceil(chars.length / 2));
        const min = max > 4 ? 1 : 2;

        return chars.map((char, i) => {
            let n = i > max ? Math.min(chars.length - i, max) : i;
            n = Math.min(n + min, 5);

            return <LensChar>{
                char,
                class: `c-${n} ${char === ' ' ? 'c-empty' : ''}`
            };
        });
    }
}
</script>