<script setup lang="ts">
import { cn } from '../utils';

// ❌ Invalid: Mixed flat and nested, invalid in nested
// @invalidClasses [invalid-nested]
// @validClasses [flex, items-center, bg-blue-500]
</script>

<template>
  <div :class="cn(['flex', ['items-center', 'invalid-nested'], 'bg-blue-500'])">
  			Invalid in nested
  		</div>
</template>
