<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ⚠️ Warning: Duplicate in array literal
// @duplicateClasses [flex, flex]
</script>

<template>
  <div :class="cn(['flex', 'flex', 'items-center'])">Duplicate in array</div>
</template>
