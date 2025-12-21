<script setup lang="ts">
import { cn } from '../utils';

// ✅ Valid: Very deeply nested (4+ levels)
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="cn([[[[['flex', 'items-center', 'justify-center']]]]])">Very deep</div>
</template>
