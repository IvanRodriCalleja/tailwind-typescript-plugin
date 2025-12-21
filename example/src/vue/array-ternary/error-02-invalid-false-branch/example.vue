<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ❌ Invalid: Array with ternary, invalid in false branch
// @invalidClasses [invalid-inactive]
// @validClasses [flex, bg-blue-500]
</script>

<template>
  <div :class="cn(['flex', isActive ? 'bg-blue-500' : 'invalid-inactive'])">
  			Invalid in false branch
  		</div>
</template>
