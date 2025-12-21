<script setup lang="ts">
import clsx from 'clsx';

const isError = false;
const isActive = true;

// ✅ Valid: Binary and ternary combined in function
// @validClasses [flex, text-red-500, bg-blue-500, bg-gray-500]
</script>

<template>
  <div
  			:class="clsx('flex', isError && 'text-red-500', isActive ? 'bg-blue-500' : 'bg-gray-500')">
  			Binary and ternary in function
  		</div>
</template>
