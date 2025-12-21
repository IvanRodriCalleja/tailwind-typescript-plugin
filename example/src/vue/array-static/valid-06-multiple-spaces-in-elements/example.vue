<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ✅ Valid: Elements with multiple spaces
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="cn(['flex  items-center', 'justify-center'])">Multiple spaces</div>
</template>
