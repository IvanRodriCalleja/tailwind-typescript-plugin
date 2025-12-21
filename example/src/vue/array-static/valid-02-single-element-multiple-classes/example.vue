<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ✅ Valid: Single element with multiple classes
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="cn(['flex items-center justify-center'])">Multiple classes in one element</div>
</template>
