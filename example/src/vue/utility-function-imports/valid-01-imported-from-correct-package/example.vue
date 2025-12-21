<script setup lang="ts">
import { merge } from '@/lib/utils';

// ✅ Valid: Function imported from the correct package with valid classes
// @utilityFunctions [{"name": "merge", "from": "@/lib/utils"}]
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="merge('flex', 'items-center', 'justify-center')">
  			Imported from correct package
  		</div>
</template>
