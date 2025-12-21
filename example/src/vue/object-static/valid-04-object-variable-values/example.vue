<script setup lang="ts">
import clsx from 'clsx';

const isDisabled = false;
const hasError = false;

// ✅ Valid: Object with variable values
// @validClasses [flex, text-red-500, bg-gray-100]
</script>

<template>
  <div :class="clsx({ flex: true, 'text-red-500': hasError, 'bg-gray-100': isDisabled })">
  			Variable values
  		</div>
</template>
