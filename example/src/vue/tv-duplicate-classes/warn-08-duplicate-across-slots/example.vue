<script setup lang="ts">
import { tv } from 'tailwind-variants';

// ⚠️ Warning: Duplicate across slots
// @duplicateClasses [flex, flex]
</script>

<template>
  <div :class="component().base">Duplicate across slots</div>
</template>
