<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;
const hasError = false;

// ✅ Valid: Three objects, all valid
// @validClasses [flex, items-center, justify-center, bg-blue-500, text-white, font-bold]
</script>

<template>
  <div
  			:class="clsx(
  				{ flex: true },
  				{ 'items-center': true, 'justify-center': isActive },
  				{ 'bg-blue-500': true, 'text-white': true, 'font-bold': hasError }
  			)">
  			Three objects
  		</div>
</template>
