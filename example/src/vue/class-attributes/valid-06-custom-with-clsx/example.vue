<script setup lang="ts">
import { clsx } from 'clsx';

const isActive = true;

// Valid: Custom attribute with clsx utility function
// @validClasses [bg-blue-500, text-white, font-bold]
</script>

<template>
  <View colorStyles={clsx('bg-blue-500', isActive && 'text-white', { 'font-bold': true })}>
  			Hello
  		</View>
</template>
