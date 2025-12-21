<script setup lang="ts">
import clsx from 'clsx';

// ⚠️ Warning: Duplicate across clsx arguments
// @duplicateClasses [bg-blue-500, bg-blue-500]
</script>

<template>
  <div :class="clsx('flex bg-blue-500', 'items-center bg-blue-500')">
  			Duplicate across args
  		</div>
</template>
