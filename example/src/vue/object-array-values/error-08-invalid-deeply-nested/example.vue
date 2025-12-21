<script setup lang="ts">
import { clsx } from 'clsx';

// ❌ Invalid: Deeply nested arrays with invalid
// @invalidClasses [invalid-deep]
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="clsx({ flex: [[['items-center', 'invalid-deep', 'justify-center']]] })">
  			Invalid deep
  		</div>
</template>
