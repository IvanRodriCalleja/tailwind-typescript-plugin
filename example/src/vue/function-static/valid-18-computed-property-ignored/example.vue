<script setup lang="ts">
import { clsx as cn } from 'clsx';

const key = 'cn';
const functions = { cn: cn };

// ✅ Valid: Computed property (should be ignored, not validated)
</script>

<template>
  <div :class="functions[key]('flex', 'items-center')">Computed property</div>
</template>
