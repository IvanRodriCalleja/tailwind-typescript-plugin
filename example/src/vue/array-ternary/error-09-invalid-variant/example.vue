<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ❌ Invalid: Ternary with invalid variant in array
// @invalidClasses [invalid-variant:bg-blue]
// @validClasses [flex, hover:bg-gray-500]
</script>

<template>
  <div :class="cn(['flex', isActive ? 'invalid-variant:bg-blue' : 'hover:bg-gray-500'])">
  			Ternary with invalid variant
  		</div>
</template>
