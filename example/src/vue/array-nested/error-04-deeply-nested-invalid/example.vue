<script setup lang="ts">
import { cn } from '../utils';

// ❌ Invalid: Deeply nested arrays with invalid class
// @invalidClasses [invalid-deep]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="cn([[['flex', 'invalid-deep', 'items-center']]])">Invalid deep nested</div>
</template>
