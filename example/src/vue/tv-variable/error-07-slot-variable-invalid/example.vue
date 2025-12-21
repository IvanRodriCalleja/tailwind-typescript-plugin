<script setup lang="ts">
import { tv } from 'tailwind-variants';

const invalidBase = 'invalid-tv-base-var';

// ❌ Invalid: Slot with invalid variable value
// @invalidClasses [invalid-tv-base-var]
</script>

<template>
  <div :class="component().base">Invalid Slot Variable</div>
</template>
