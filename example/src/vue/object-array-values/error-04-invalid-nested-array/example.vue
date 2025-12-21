<script setup lang="ts">
import { clsx } from 'clsx';

// ❌ Invalid: Nested arrays as object values with invalid
// @invalidClasses [invalid-nested]
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="clsx({ flex: [['items-center', 'invalid-nested']], 'justify-center': true })">
  			Invalid nested
  		</div>
</template>
