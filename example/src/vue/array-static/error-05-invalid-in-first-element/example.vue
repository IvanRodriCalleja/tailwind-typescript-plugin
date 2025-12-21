<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ❌ Invalid: Invalid in first element
// @invalidClasses [invalid-first]
// @validClasses [items-center, justify-center]
</script>

<template>
  <div :class="cn(['invalid-first', 'items-center', 'justify-center'])">Invalid first</div>
</template>
