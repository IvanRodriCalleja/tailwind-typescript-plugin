<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ❌ Invalid: Using cn() function with invalid class
// @invalidClasses [invalid-class]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="cn('flex', 'invalid-class', 'items-center')">Using cn with invalid</div>
</template>
