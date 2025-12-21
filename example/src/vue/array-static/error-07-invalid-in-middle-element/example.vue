<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ❌ Invalid: Invalid in middle element
// @invalidClasses [invalid-middle]
// @validClasses [flex, justify-center]
</script>

<template>
  <div :class="cn(['flex', 'invalid-middle', 'justify-center'])">Invalid middle</div>
</template>
