<script setup lang="ts">
import { cn } from '../utils';

// ❌ Invalid: Complex nesting with invalid class
// @invalidClasses [invalid-complex]
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="cn([['flex', [['items-center'], 'invalid-complex']], 'justify-center'])">
  			Invalid complex
  		</div>
</template>
