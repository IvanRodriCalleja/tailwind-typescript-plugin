<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ❌ Invalid: Array with ternary, invalid in true branch
// @invalidClasses [invalid-active]
// @validClasses [flex, bg-gray-500]
</script>

<template>
  <div :class="cn(['flex', isActive ? 'invalid-active' : 'bg-gray-500'])">
  			Invalid in true branch
  		</div>
</template>
