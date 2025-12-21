<script setup lang="ts">
import clsx from 'clsx';

// ✅ Valid: Object key with multiple classes
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="clsx({ 'flex items-center justify-center': true })">
  			Multiple classes in key
  		</div>
</template>
