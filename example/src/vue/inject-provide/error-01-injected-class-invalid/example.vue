<script setup lang="ts">
import { inject } from 'vue';

// ❌ Invalid: Injected class with default value containing invalid class
// @invalidClasses [invalid-injected-class]

// When inject has a default value, we can validate it statically
const classes = inject('buttonClasses', 'flex items-center invalid-injected-class');
</script>

<template>
  <div :class="classes">Injected class with default</div>
</template>
