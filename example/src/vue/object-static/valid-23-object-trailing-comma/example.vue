<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ✅ Valid: Object with trailing comma
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="clsx({ flex: true, 'items-center': true, 'justify-center': isActive })">
  			Trailing comma
  		</div>
</template>
