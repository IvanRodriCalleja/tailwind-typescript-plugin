<script setup lang="ts">
import { clsx as cn } from 'clsx';
import clsx from 'clsx';

const isError = false;

// ❌ Invalid: Nested functions with invalid in binary
// @invalidClasses [invalid-error]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="clsx('flex', cn(isError && 'invalid-error', 'items-center'))">
  			Nested with invalid binary
  		</div>
</template>
