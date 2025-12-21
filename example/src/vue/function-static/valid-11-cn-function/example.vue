<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ✅ Valid: Using cn() function
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="cn('flex', 'items-center', 'justify-center')">Using cn function</div>
</template>
