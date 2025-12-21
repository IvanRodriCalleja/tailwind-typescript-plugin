<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ❌ Invalid: Invalid in last element
// @invalidClasses [invalid-last]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="cn(['flex', 'items-center', 'invalid-last'])">Invalid last</div>
</template>
