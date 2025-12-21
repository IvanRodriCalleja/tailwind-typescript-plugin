<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isError = true;

// ✅ Valid: Binary OR in array with valid class
// @validClasses [flex, bg-gray-500]
</script>

<template>
  <div :class="cn(['flex', isError || 'bg-gray-500'])">Binary OR in array</div>
</template>
