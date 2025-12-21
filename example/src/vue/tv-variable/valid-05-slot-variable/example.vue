<script setup lang="ts">
import { tv } from 'tailwind-variants';

const validBase = 'flex items-center';

// ✅ Valid: Slot with variable value
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="component().base">Valid Slot Variable</div>
</template>
