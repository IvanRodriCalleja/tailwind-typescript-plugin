<script setup lang="ts">
import { tv } from 'tailwind-variants';

// ❌ Invalid: class with only invalid classes (no valid ones)
// @invalidClasses [completely-invalid, another-invalid-class]
</script>

<template>
  <button
  			:class="button({
  				color: 'primary',
  				class: 'completely-invalid another-invalid-class'
  			})">
  			All Invalid
  		</button>
</template>
