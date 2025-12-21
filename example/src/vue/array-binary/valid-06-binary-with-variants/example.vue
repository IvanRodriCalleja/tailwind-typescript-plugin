<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ✅ Valid: Binary with Tailwind variants in array
// @validClasses [flex, hover:bg-blue-500, md:text-lg]
</script>

<template>
  <div :class="cn(['flex', isActive && 'hover:bg-blue-500 md:text-lg'])">
  			Binary with variants
  		</div>
</template>
