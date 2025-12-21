<script setup lang="ts">
import { cn } from '../utils';

// ❌ Invalid: Mixed flat and nested, invalid in flat
// @invalidClasses [invalid-flat]
// @validClasses [items-center, justify-center, bg-blue-500]
</script>

<template>
  <div :class="cn(['invalid-flat', ['items-center', 'justify-center'], 'bg-blue-500'])">
  			Invalid in flat
  		</div>
</template>
