<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ✅ Valid: className property with valid Tailwind classes
// @validClasses [bg-teal-500, hover:bg-teal-700]
</script>

<template>
  <button :class="button({ intent: 'secondary', className: 'bg-teal-500 hover:bg-teal-700' })">
  			Valid className Override
  		</button>
</template>
