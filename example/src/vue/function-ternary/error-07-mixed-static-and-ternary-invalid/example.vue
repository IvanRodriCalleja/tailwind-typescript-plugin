<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ❌ Invalid: Mix with invalid in both static and ternary
// @invalidClasses [invalid-static, invalid-ternary]
// @validClasses [flex, items-center, bg-gray-500]
</script>

<template>
  <div
  			:class="clsx(
  				'flex',
  				'invalid-static',
  				isActive ? 'invalid-ternary' : 'bg-gray-500',
  				'items-center'
  			)">
  			Mixed with invalid
  		</div>
</template>
