<script setup lang="ts">
import clsx from 'clsx';

const isError = false;

// ❌ Invalid: Function with binary expression, invalid class
// @invalidClasses [invalid-error]
// @validClasses [flex]
</script>

<template>
  <div :class="clsx('flex', isError && 'invalid-error')">
  			Function with invalid class in binary
  		</div>
</template>
