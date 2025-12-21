<script setup lang="ts">
import { tv } from 'tailwind-variants';

// ❌ Invalid: Complex classes with invalid modifier combinations
// @invalidClasses [invalid-modifier:bg-red-500]
// @validClasses [md:bg-purple-600]
</script>

<template>
  <button
  			:class="button({
  				color: 'primary',
  				class: 'md:bg-purple-600 invalid-modifier:bg-red-500'
  			})">
  			Invalid Modifier
  		</button>
</template>
