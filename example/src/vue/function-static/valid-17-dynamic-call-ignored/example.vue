<script setup lang="ts">
import { clsx as cn } from 'clsx';

const functions = { cn: cn };

// ✅ Valid: Dynamic function call (should be ignored, not validated)
</script>

<template>
  <div :class="functions['cn']('flex', 'items-center')">Dynamic call</div>
</template>
