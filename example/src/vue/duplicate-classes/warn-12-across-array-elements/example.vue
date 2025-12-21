<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ⚠️ Warning: Duplicate across array elements
// @duplicateClasses [bg-blue-500, bg-blue-500]
</script>

<template>
  <div :class="cn(['flex bg-blue-500', 'items-center', 'bg-blue-500'])">
  			Duplicate across array elements
  		</div>
</template>
