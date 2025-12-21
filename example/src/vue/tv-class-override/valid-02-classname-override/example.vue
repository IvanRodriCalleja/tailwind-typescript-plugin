<script setup lang="ts">
import { tv } from 'tailwind-variants';

// ✅ Valid: className property with valid Tailwind classes
// @validClasses [bg-teal-500, hover:bg-teal-700]
</script>

<template>
  <button :class="button({ color: 'success', className: 'bg-teal-500 hover:bg-teal-700' })">
  			Valid className Override
  		</button>
</template>
