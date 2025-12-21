<script setup lang="ts">
import { tv as tvLite } from 'tailwind-variants/lite';

// ❌ Invalid: Lite version with multiple invalid classes
// @invalidClasses [invalid-lite-1, invalid-lite-2]
// @validClasses [bg-red-600, text-white]
</script>

<template>
  <button
  			:class="buttonLite({
  				color: 'primary',
  				class: 'invalid-lite-1 bg-red-600 invalid-lite-2 text-white'
  			})">
  			Multiple Invalid in Lite
  		</button>
</template>
