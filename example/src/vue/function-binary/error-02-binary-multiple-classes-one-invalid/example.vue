<script setup lang="ts">
import clsx from 'clsx';

const isError = false;

// ❌ Invalid: Function with binary expression with multiple classes, one invalid
// @invalidClasses [invalid-class]
// @validClasses [flex, text-red-500, font-bold]
</script>

<template>
  <div :class="clsx('flex', isError && 'text-red-500 invalid-class font-bold')">
  			Binary with multiple classes
  		</div>
</template>
