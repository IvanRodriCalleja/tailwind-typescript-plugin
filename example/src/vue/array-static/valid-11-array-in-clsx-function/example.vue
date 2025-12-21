<script setup lang="ts">
import clsx from 'clsx';

// ✅ Valid: Array in clsx() function
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="clsx(['flex', 'items-center', 'justify-center'])">Array in clsx()</div>
</template>
