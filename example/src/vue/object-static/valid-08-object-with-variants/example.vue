<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ✅ Valid: Object with variants
// @validClasses [hover:bg-blue-500, focus:ring-2, active:scale-95]
</script>

<template>
  <div
  			:class="clsx({
  				'hover:bg-blue-500': true,
  				'focus:ring-2': true,
  				'active:scale-95': isActive
  			})">
  			Variants
  		</div>
</template>
