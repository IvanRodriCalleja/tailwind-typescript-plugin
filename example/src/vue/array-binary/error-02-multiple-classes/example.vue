<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isError = true;

// ❌ Invalid: Binary with multiple classes, one invalid
// @invalidClasses [invalid-class]
// @validClasses [flex, text-red-500, font-bold]
</script>

<template>
  <div :class="cn(['flex', isError && 'text-red-500 invalid-class font-bold'])">
  			Binary with multiple classes
  		</div>
</template>
