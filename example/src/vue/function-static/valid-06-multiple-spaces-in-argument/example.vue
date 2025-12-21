<script setup lang="ts">
import clsx from 'clsx';

// ✅ Valid: Multiple spaces in argument
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="clsx('flex  items-center   justify-center')">Multiple spaces</div>
</template>
