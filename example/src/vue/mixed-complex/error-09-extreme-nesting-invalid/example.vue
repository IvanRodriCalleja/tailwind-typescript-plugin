<script setup lang="ts">
import { cn } from '../utils';

// ❌ Invalid: Extreme nesting with invalid
// @invalidClasses [invalid-extreme]
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="cn([[[[[['flex', 'items-center'], ['invalid-extreme']], 'justify-center']]]])">
  			Invalid extreme
  		</div>
</template>
