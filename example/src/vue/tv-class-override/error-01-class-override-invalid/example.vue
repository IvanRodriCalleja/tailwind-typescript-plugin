<script setup lang="ts">
import { tv } from 'tailwind-variants';

// ❌ Invalid: class property with invalid Tailwind classes
// @invalidClasses [invalid-override-class]
// @validClasses [bg-pink-500, hover:bg-pink-700]
</script>

<template>
  <button
  			:class="button({
  				color: 'primary',
  				class: 'bg-pink-500 invalid-override-class hover:bg-pink-700'
  			})">
  			Invalid Override
  		</button>
</template>
