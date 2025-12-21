<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ❌ Invalid: Multiple elements with mix of valid and invalid
// @invalidClasses [invalid-class]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="cn(['flex', 'invalid-class', 'items-center'])">Mixed elements</div>
</template>
