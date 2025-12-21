<script setup lang="ts">
import { clsx as cn } from 'clsx';
import clsx from 'clsx';

const isError = true;

// ❌ Invalid: Nested functions with invalid binary in array
// @invalidClasses [invalid-error]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="clsx('flex', cn([isError && 'invalid-error', 'items-center']))">
  			Nested with invalid
  		</div>
</template>
