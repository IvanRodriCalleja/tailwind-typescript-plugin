<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isError = true;
const isActive = true;

// ✅ Valid: Nested binary expressions in array
// @validClasses [flex, text-red-500, font-bold]
</script>

<template>
  <div :class="cn(['flex', isError && isActive && 'text-red-500 font-bold'])">
  			Nested binary in array
  		</div>
</template>
