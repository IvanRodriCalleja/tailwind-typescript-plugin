<script setup lang="ts">
import { tv } from 'tailwind-variants';

// ✅ Valid: Slots with valid classes
// @validClasses [flex, items-center, mr-2, text-blue-500, font-semibold]
</script>

<template>
  <div :class="component().base">
  			<span :class="component().icon">Icon</span>
  		</div>
</template>
