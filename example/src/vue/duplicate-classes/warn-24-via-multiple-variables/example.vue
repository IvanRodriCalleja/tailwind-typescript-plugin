<script setup lang="ts">
import clsx from 'clsx';

const spacingClasses = 'p-4 m-2';
const moreSpacing = 'p-4';

// ⚠️ Warning: Duplicate via multiple variables
// @duplicateClasses [p-4, p-4]
</script>

<template>
  <div :class="clsx(spacingClasses, moreSpacing)">Duplicate via multiple variables</div>
</template>
