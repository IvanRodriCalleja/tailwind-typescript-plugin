<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ✅ Valid: Nested arrays
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="cn([cn(['flex', 'items-center']), 'justify-center'])">Nested arrays</div>
</template>
