<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ⚠️ Warning: Duplicate in cn function
// @duplicateClasses [p-4, p-4]
</script>

<template>
  <div :class="cn('p-4 p-4 m-2')">Duplicate in cn</div>
</template>
