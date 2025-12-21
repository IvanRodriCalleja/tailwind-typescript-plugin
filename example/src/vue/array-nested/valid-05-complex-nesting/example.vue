<script setup lang="ts">
import { cn } from '../utils';

// ✅ Valid: Complex nesting like clsx documentation
// Example: [['baz', [['hello'], 'there']]]
// @validClasses [flex, items-center, justify-center, text-lg]
</script>

<template>
  <div :class="cn([['flex', [['items-center'], 'justify-center']], 'text-lg'])">
  			Complex nesting
  		</div>
</template>
