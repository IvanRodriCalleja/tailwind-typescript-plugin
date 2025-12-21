<script setup lang="ts">
import { tv as tvLite } from 'tailwind-variants/lite';

// ❌ Invalid: Lite version with invalid class override
// @invalidClasses [invalid-lite-override]
// @validClasses [bg-cyan-500]
</script>

<template>
  <button
  			:class="buttonLite({
  				color: 'primary',
  				class: 'bg-cyan-500 invalid-lite-override'
  			})">
  			Invalid Lite Override
  		</button>
</template>
