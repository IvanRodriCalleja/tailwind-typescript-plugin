<script setup lang="ts">
import clsx from 'clsx';

// ⚠️ Warning: Conflict in clsx arguments
// @conflictClasses [flex, block]
</script>

<template>
  <div :class="clsx('flex', 'block', 'items-center')">Conflict in clsx</div>
</template>
