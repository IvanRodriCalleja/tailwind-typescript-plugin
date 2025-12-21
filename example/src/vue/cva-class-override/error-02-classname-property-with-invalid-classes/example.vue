<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ❌ Invalid: className property with invalid Tailwind classes
// @invalidClasses [invalid-classname-override]
// @validClasses [bg-teal-500]
</script>

<template>
  <button
  			:class="button({
  				intent: 'primary',
  				className: 'bg-teal-500 invalid-classname-override'
  			})">
  			Invalid className Override
  		</button>
</template>
