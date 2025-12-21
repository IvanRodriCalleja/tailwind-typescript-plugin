<script setup lang="ts">
import clsx from 'clsx';

const isDisabled = false;
const hasError = false;

// ❌ Invalid: Object with invalid key and variable value
// @invalidClasses [invalid-error]
// @validClasses [flex, bg-gray-100]
</script>

<template>
  <div :class="clsx({ flex: true, 'invalid-error': hasError, 'bg-gray-100': isDisabled })">
  			Invalid with variables
  		</div>
</template>
