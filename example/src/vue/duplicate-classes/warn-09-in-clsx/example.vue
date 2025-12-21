<script setup lang="ts">
import clsx from 'clsx';

// ⚠️ Warning: Duplicate in clsx function
// @duplicateClasses [flex, flex]
</script>

<template>
  <div :class="clsx('flex', 'flex', 'items-center')">Duplicate in clsx</div>
</template>
