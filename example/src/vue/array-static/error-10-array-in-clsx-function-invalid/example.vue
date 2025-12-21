<script setup lang="ts">
import clsx from 'clsx';

// ❌ Invalid: Array in clsx() with invalid class
// @invalidClasses [invalid-class]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="clsx(['flex', 'invalid-class', 'items-center'])">Array in clsx() invalid</div>
</template>
