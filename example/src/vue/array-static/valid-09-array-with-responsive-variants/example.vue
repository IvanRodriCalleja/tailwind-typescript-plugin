<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ✅ Valid: Array with responsive variants
// @validClasses [sm:flex, md:grid, lg:grid-cols-3]
</script>

<template>
  <div :class="cn(['sm:flex', 'md:grid', 'lg:grid-cols-3'])">Array with responsive</div>
</template>
