<script setup lang="ts">
import { clsx } from 'clsx';
import { cn } from '../utils';

// ❌ Invalid: Nested function calls with nested arrays and invalid
// @invalidClasses [invalid-nested-fn]
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div
  			:class="cn([clsx([['flex', 'invalid-nested-fn']]), ['items-center', 'justify-center']])">
  			Invalid nested fn
  		</div>
</template>
