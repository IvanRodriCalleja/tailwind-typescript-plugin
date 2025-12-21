<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ✅ Valid: Override with multiple variant properties
// @validClasses [bg-indigo-500, hover:bg-indigo-700]
</script>

<template>
  <button
  			:class="button({
  				intent: 'primary',
  				size: 'medium',
  				class: 'bg-indigo-500 hover:bg-indigo-700'
  			})">
  			Multiple Variants + Override
  		</button>
</template>
