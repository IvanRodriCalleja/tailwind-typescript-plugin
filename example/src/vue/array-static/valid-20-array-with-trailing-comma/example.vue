<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ✅ Valid: Array with trailing comma
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="cn(['flex', 'items-center', 'justify-center'])">Trailing comma</div>
</template>
