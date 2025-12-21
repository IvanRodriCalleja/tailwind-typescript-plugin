<script setup lang="ts">
import clsx from 'clsx';

// ✅ Valid: Empty string argument
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="clsx('flex', '', 'items-center')">Empty string argument</div>
</template>
