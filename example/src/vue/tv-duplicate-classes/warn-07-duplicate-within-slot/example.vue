<script setup lang="ts">
import { tv } from 'tailwind-variants';

// ⚠️ Warning: Duplicate within same slot
// @duplicateClasses [flex, flex]
</script>

<template>
  <div :class="component().base">Duplicate within slot</div>
</template>
