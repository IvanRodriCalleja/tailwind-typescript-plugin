<script setup lang="ts">
import { clsx } from 'clsx';

// ❌ Invalid: Multiple properties with array values, invalid in first
// @invalidClasses [invalid-flex]
// @validClasses [items-center, bg-blue-500, text-white]
</script>

<template>
  <div
  			:class="clsx({ flex: ['invalid-flex', 'items-center'], 'bg-blue-500': ['text-white'] })">
  			Invalid in first
  		</div>
</template>
