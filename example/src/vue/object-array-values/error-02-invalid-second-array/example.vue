<script setup lang="ts">
import { clsx } from 'clsx';

// ❌ Invalid: Multiple properties with array values, invalid in second
// @invalidClasses [invalid-text]
// @validClasses [flex, items-center, justify-center, bg-blue-500]
</script>

<template>
  <div
  			:class="clsx({
  				flex: ['items-center', 'justify-center'],
  				'bg-blue-500': ['invalid-text']
  			})">
  			Invalid in second
  		</div>
</template>
