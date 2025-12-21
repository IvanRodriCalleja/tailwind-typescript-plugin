<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ❌ Invalid: Multiple elements, all invalid
// @invalidClasses [invalid-one, invalid-two, invalid-three]
</script>

<template>
  <div :class="cn(['invalid-one', 'invalid-two', 'invalid-three'])">All invalid</div>
</template>
