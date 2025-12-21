<script setup lang="ts">
import { cn } from '../utils';

// ❌ Invalid: Variadic complex with invalid
// @invalidClasses [invalid-variadic]
// @validClasses [flex, items-center, justify-center, bg-blue-500, font-bold]
</script>

<template>
  <div
  			:class="cn(
  				['flex'],
  				['items-center'],
  				[['justify-center', [['bg-blue-500'], 'invalid-variadic']]],
  				'font-bold'
  			)">
  			Invalid variadic
  		</div>
</template>
