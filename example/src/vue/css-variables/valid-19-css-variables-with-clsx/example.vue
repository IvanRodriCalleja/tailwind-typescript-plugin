<script setup lang="ts">
import clsx from 'clsx';

// ✅ Valid: CSS variables with clsx
// @validClasses [[--card-bg:#1e293b], bg-[var(--card-bg)], p-4]
</script>

<template>
  <div :class="clsx('[--card-bg:#1e293b]', 'bg-[var(--card-bg)]', 'p-4')">
  			CSS variables with clsx
  		</div>
</template>
