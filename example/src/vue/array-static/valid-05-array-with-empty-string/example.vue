<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ✅ Valid: Array with empty string element
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="cn(['flex', '', 'items-center'])">Array with empty string</div>
</template>
