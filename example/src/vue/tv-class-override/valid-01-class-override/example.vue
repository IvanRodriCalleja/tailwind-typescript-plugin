<script setup lang="ts">
import { tv } from 'tailwind-variants';

// ✅ Valid: class property with valid Tailwind classes
// @validClasses [bg-pink-500, hover:bg-pink-700]
</script>

<template>
  <button :class="button({ color: 'secondary', class: 'bg-pink-500 hover:bg-pink-700' })">
  			Valid Override
  		</button>
</template>
