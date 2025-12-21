<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ⚠️ Warning: Conflict in cn function
// @conflictClasses [text-left, text-right]
</script>

<template>
  <div :class="cn('text-left text-right items-center')">Conflict in cn</div>
</template>
