<script setup lang="ts">
import { tv as tvLite } from 'tailwind-variants/lite';

// ✅ Valid: Lite version with valid className override
// @validClasses [bg-orange-500, hover:bg-orange-700, font-extrabold]
</script>

<template>
  <button
  			:class="buttonLite({
  				color: 'secondary',
  				className: 'bg-orange-500 hover:bg-orange-700 font-extrabold'
  			})">
  			Valid Lite className Override
  		</button>
</template>
