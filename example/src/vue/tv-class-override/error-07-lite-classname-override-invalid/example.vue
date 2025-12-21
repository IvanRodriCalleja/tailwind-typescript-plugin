<script setup lang="ts">
import { tv as tvLite } from 'tailwind-variants/lite';

// ❌ Invalid: Lite version with invalid className override
// @invalidClasses [invalid-lite-classname]
// @validClasses [bg-orange-500]
</script>

<template>
  <button
  			:class="buttonLite({
  				color: 'secondary',
  				className: 'bg-orange-500 invalid-lite-classname'
  			})">
  			Invalid Lite className Override
  		</button>
</template>
