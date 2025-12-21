<script setup lang="ts">
import { tv } from 'tailwind-variants';

// ❌ Invalid: Multiple invalid classes should all be detected
// @invalidClasses [invalid-class-1, invalid-class-2]
// @validClasses [bg-pink-500, hover:bg-pink-700]
</script>

<template>
  <button
  			:class="button({
  				color: 'primary',
  				class: 'invalid-class-1 bg-pink-500 invalid-class-2 hover:bg-pink-700'
  			})">
  			Multiple Invalid Classes
  		</button>
</template>
