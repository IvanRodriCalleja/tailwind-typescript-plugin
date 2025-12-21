<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ✅ Valid: Array with variants
// @validClasses [hover:bg-blue-500, focus:ring-2, active:scale-95]
</script>

<template>
  <div :class="cn(['hover:bg-blue-500', 'focus:ring-2', 'active:scale-95'])">
  			Array with variants
  		</div>
</template>
