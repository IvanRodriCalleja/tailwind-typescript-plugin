<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ✅ Valid: Binary with Tailwind variants
// @validClasses [flex, hover:bg-blue-500, md:text-lg]
</script>

<template>
  <div :class="clsx('flex', isActive && 'hover:bg-blue-500 md:text-lg')">
  			Binary with variants
  		</div>
</template>
