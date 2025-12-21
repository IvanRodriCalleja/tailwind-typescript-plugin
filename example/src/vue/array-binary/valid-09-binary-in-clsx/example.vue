<script setup lang="ts">
import clsx from 'clsx';

const isError = true;

// ✅ Valid: Binary in array with clsx()
// @validClasses [flex, text-red-500]
</script>

<template>
  <div :class="clsx(['flex', isError && 'text-red-500'])">Binary in clsx array</div>
</template>
