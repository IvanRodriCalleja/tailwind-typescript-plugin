<script setup lang="ts">
import clsx from 'clsx';

// ✅ Valid: Object with boolean values
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="clsx({ flex: true, 'items-center': false, 'justify-center': true })">
  			Boolean values
  		</div>
</template>
