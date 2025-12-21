<script setup lang="ts">
import clsx from 'clsx';

// ✅ Valid: Function with responsive variants
// @validClasses [sm:flex, md:grid, lg:grid-cols-3]
</script>

<template>
  <div :class="clsx('sm:flex', 'md:grid', 'lg:grid-cols-3')">
  			Function with responsive variants
  		</div>
</template>
