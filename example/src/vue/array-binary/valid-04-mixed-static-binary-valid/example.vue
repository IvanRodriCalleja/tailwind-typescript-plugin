<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isError = true;

// ✅ Valid: Mix of static and binary in array
// @validClasses [flex, items-center, text-red-500, font-bold]
</script>

<template>
  <div :class="cn(['flex', 'items-center', isError && 'text-red-500', 'font-bold'])">
  			Mixed static and binary
  		</div>
</template>
