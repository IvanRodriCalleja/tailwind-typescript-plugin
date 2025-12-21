<script setup lang="ts">
import { tv } from 'tailwind-variants';

// ❌ Invalid: Slots with invalid class
// @invalidClasses [invalid-slot-class]
// @validClasses [mr-2]
</script>

<template>
  <span :class="component().icon">Invalid Slot</span>
</template>
