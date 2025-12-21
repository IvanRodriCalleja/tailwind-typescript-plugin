<script setup lang="ts">
import { cn } from '../utils';

// ✅ Valid: Extreme nesting (5+ levels)
// @validClasses [flex, items-center, justify-center, bg-blue-500]
</script>

<template>
  <div :class="cn([[[[[['flex', 'items-center'], ['justify-center']], 'bg-blue-500']]]])">
  			Extreme nesting
  		</div>
</template>
