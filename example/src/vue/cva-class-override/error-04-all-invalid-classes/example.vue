<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ❌ Invalid: class with only invalid classes (no valid ones)
// @invalidClasses [completely-invalid, another-invalid-class]
</script>

<template>
  <button
  			:class="button({
  				intent: 'primary',
  				class: 'completely-invalid another-invalid-class'
  			})">
  			All Invalid
  		</button>
</template>
