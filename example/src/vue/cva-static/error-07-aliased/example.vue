<script setup lang="ts">
import { cva as myCva } from 'class-variance-authority';

const component = myCva(['flex', 'invalid-aliased-class', 'items-center']);

// ❌ Invalid: Import aliasing with invalid class
// @invalidClasses [invalid-aliased-class]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="component()">Invalid Aliased</div>
</template>
