<script setup lang="ts">
import { clsx } from 'clsx';

// ✅ Valid: Nested arrays as object values
// @validClasses [flex, items-center, justify-center, bg-blue-500]
</script>

<template>
  <div :class="clsx({ flex: [['items-center', 'justify-center']], 'bg-blue-500': true })">
  			Nested array value
  		</div>
</template>
