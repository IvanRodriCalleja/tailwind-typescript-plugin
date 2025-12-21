<script setup lang="ts">
import { tv } from 'tailwind-variants';

// Valid: tv with allowed classes in base
// @validClasses [custom-button, flex, rounded]
const button = tv({
  base: 'custom-button flex rounded'
});
</script>

<template>
  <button :class="button()">TV Base Allowed</button>
</template>
