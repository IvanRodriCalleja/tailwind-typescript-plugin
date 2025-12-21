<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ✅ Valid: Object with responsive variants
// @validClasses [sm:flex, md:grid, lg:grid-cols-3]
</script>

<template>
  <div :class="clsx({ 'sm:flex': true, 'md:grid': true, 'lg:grid-cols-3': isActive })">
  			Responsive
  		</div>
</template>
