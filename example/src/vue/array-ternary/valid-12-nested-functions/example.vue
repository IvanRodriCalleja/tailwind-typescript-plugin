<script setup lang="ts">
import { clsx as cn } from 'clsx';
import clsx from 'clsx';

const isActive = true;

// ✅ Valid: Nested functions with ternary in array
// @validClasses [flex, bg-blue-500, bg-gray-500, items-center]
</script>

<template>
  <div :class="clsx('flex', cn([isActive ? 'bg-blue-500' : 'bg-gray-500', 'items-center']))">
  			Nested with ternary
  		</div>
</template>
