<script setup lang="ts">
import { cn } from '../utils';

// ✅ Valid: Single level nested array, all valid
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="cn([['flex', 'items-center']])">Single level nested</div>
</template>
