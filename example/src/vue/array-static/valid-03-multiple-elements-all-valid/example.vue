<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ✅ Valid: Multiple elements with valid classes
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="cn(['flex', 'items-center', 'justify-center'])">Multiple valid elements</div>
</template>
