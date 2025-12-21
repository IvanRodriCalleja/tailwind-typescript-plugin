<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ❌ Invalid: Ternary with multiple classes, one invalid in true branch
// @invalidClasses [invalid-class]
// @validClasses [flex, bg-blue-500, font-bold, bg-gray-500]
</script>

<template>
  <div :class="clsx('flex', isActive ? 'bg-blue-500 invalid-class font-bold' : 'bg-gray-500')">
  			Multiple classes with invalid
  		</div>
</template>
