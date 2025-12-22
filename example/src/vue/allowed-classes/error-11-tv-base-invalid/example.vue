<script setup lang="ts">
import { tv } from 'tailwind-variants';

// Invalid: tv with invalid class in base
// @invalidClasses [invalid-tv-base]
// @validClasses [custom-button, flex]
const button = tv({
  base: 'custom-button flex invalid-tv-base'
});
</script>

<template>
  <button :class="button()">TV Base Invalid</button>
</template>
