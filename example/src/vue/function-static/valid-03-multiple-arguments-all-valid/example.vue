<script setup lang="ts">
import clsx from 'clsx';

// ✅ Valid: Multiple arguments with valid classes
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="clsx('flex', 'items-center', 'justify-center')">Multiple valid arguments</div>
</template>
