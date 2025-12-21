<script setup lang="ts">
import { cn } from '../utils';

// ✅ Valid: Empty nested arrays
// @validClasses [flex]
</script>

<template>
  <div :class="cn([[], 'flex', [[]]])">Empty nested arrays</div>
</template>
