<script setup lang="ts">
import { cn } from '../utils';

const isActive = true;

// ❌ Invalid: Mix with invalid in nested array
// @invalidClasses [invalid-nested]
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div
  			:class="cn(
  				'flex',
  				isActive && 'items-center',
  				[['justify-center', 'invalid-nested']],
  				'text-white'
  			)">
  			Invalid nested
  		</div>
</template>
