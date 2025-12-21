<script setup lang="ts">
import { clsx as cn } from 'clsx';
import clsx from 'clsx';

// ✅ Valid: Nested function calls with arrays
// @validClasses [flex, items-center, justify-center, bg-blue-500]
</script>

<template>
  <div :class="clsx('flex', cn(['items-center', 'justify-center']), 'bg-blue-500')">
  			Nested with arrays
  		</div>
</template>
