<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ✅ Valid: Array with static strings in function
// @validClasses [flex, items-center, justify-center, bg-blue-500]
</script>

<template>
  <div :class="cn('flex', ['items-center', 'justify-center'], 'bg-blue-500')">
  			Array with static
  		</div>
</template>
