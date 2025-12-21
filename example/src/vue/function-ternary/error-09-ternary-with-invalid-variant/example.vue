<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ❌ Invalid: Ternary with invalid variant
// @invalidClasses [invalid-variant:bg-blue]
// @validClasses [flex, hover:bg-gray-500]
</script>

<template>
  <div :class="clsx('flex', isActive ? 'invalid-variant:bg-blue' : 'hover:bg-gray-500')">
  			Ternary with invalid variant
  		</div>
</template>
