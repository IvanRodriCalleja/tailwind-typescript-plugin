<script setup lang="ts">
import { clsx } from 'clsx';

const isActive = true;

// Error: Invalid class in custom attribute with clsx
// @invalidClasses [invalid-class]
</script>

<template>
  <View colorStyles={clsx('bg-blue-500', isActive && 'invalid-class', { 'font-bold': true })}>
  			Hello
  		</View>
</template>
