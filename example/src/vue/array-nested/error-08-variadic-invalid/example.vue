<script setup lang="ts">
import { cn } from '../utils';

// ❌ Invalid: Variadic nested arrays with invalid
// @invalidClasses [invalid-variadic]
// @validClasses [flex, items-center, justify-center, bg-blue-500]
</script>

<template>
  <div
  			:class="cn(
  				['flex'],
  				['items-center'],
  				[['justify-center', [['bg-blue-500'], 'invalid-variadic']]]
  			)">
  			Invalid variadic
  		</div>
</template>
