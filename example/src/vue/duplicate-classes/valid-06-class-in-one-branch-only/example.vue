<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ✅ Valid: Class only in ONE ternary branch
// No issue - 'flex' only appears in the true branch
</script>

<template>
  <div :class="clsx('mt-4', isActive ? 'flex bg-blue-500' : 'bg-gray-500')">
  			Class in one branch only (valid)
  		</div>
</template>
