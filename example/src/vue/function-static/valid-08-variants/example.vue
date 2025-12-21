<script setup lang="ts">
import clsx from 'clsx';

// ✅ Valid: Function with variants
// @validClasses [hover:bg-blue-500, focus:ring-2, active:scale-95]
</script>

<template>
  <div :class="clsx('hover:bg-blue-500', 'focus:ring-2', 'active:scale-95')">
  			Function with variants
  		</div>
</template>
