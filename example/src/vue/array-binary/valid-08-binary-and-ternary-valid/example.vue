<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isError = true;
const isActive = true;

// ✅ Valid: Array with binary and ternary combined
// @validClasses [flex, text-red-500, bg-blue-500, bg-gray-500]
</script>

<template>
  <div
  			:class="cn(['flex', isError && 'text-red-500', isActive ? 'bg-blue-500' : 'bg-gray-500'])">
  			Binary and ternary in array
  		</div>
</template>
