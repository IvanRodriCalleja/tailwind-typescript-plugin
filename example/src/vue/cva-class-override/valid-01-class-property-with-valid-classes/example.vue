<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ✅ Valid: class property with valid Tailwind classes
// @validClasses [bg-pink-500, hover:bg-pink-700]
</script>

<template>
  <button :class="button({ intent: 'secondary', class: 'bg-pink-500 hover:bg-pink-700' })">
  			Valid Override
  		</button>
</template>
