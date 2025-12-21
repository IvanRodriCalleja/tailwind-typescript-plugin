<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ❌ Invalid: Single element with mix of valid and invalid
// @invalidClasses [invalid-class]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="cn(['flex invalid-class items-center'])">Mixed classes</div>
</template>
