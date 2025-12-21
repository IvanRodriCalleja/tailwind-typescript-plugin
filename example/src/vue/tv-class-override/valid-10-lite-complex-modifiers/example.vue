<script setup lang="ts">
import { tv as tvLite } from 'tailwind-variants/lite';

// ✅ Valid: Lite version with complex modifiers
// @validClasses [sm:bg-teal-500, md:bg-teal-600, lg:hover:bg-teal-700]
</script>

<template>
  <button
  			:class="buttonLite({
  				color: 'primary',
  				class: 'sm:bg-teal-500 md:bg-teal-600 lg:hover:bg-teal-700'
  			})">
  			Valid Lite Complex Modifiers
  		</button>
</template>
