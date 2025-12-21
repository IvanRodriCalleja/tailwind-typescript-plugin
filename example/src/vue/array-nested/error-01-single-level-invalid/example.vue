<script setup lang="ts">
import { cn } from '../utils';

// ❌ Invalid: Single level nested array, invalid class
// @invalidClasses [invalid-class]
// @validClasses [flex]
</script>

<template>
  <div :class="cn([['flex', 'invalid-class']])">Invalid nested</div>
</template>
