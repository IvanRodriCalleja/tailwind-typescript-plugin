<script setup lang="ts">
import clsx from 'clsx';

// ✅ Valid: Single argument with multiple valid classes
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="clsx('flex items-center justify-center')">Multiple classes in one arg</div>
</template>
