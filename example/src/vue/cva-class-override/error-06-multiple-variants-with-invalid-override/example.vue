<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ❌ Invalid: Override with multiple variants and invalid class
// @invalidClasses [invalid-multi-variant]
// @validClasses [bg-indigo-500]
</script>

<template>
  <button
  			:class="button({
  				intent: 'secondary',
  				size: 'small',
  				class: 'bg-indigo-500 invalid-multi-variant'
  			})">
  			Invalid Multi-Variant Override
  		</button>
</template>
