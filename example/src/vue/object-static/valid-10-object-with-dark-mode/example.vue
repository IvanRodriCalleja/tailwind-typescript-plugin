<script setup lang="ts">
import clsx from 'clsx';

// ✅ Valid: Object with dark mode variants
// @validClasses [bg-white, dark:bg-gray-900, text-black, dark:text-white]
</script>

<template>
  <div
  			:class="clsx({
  				'bg-white': true,
  				'dark:bg-gray-900': true,
  				'text-black': true,
  				'dark:text-white': true
  			})">
  			Dark mode
  		</div>
</template>
