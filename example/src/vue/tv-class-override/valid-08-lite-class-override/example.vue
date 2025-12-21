<script setup lang="ts">
import { tv as tvLite } from 'tailwind-variants/lite';

// ✅ Valid: Lite version with valid class override
// @validClasses [bg-cyan-500, hover:bg-cyan-700]
</script>

<template>
  <button
  			:class="buttonLite({
  				color: 'primary',
  				class: 'bg-cyan-500 hover:bg-cyan-700'
  			})">
  			Valid Lite Override
  		</button>
</template>
