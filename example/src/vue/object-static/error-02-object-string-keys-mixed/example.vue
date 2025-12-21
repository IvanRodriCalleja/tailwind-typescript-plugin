<script setup lang="ts">
import clsx from 'clsx';

// ❌ Invalid: Object with mix of valid and invalid string keys
// @invalidClasses [invalid-center]
// @validClasses [flex, items-start]
</script>

<template>
  <div :class="clsx({ flex: true, 'invalid-center': true, 'items-start': true })">
  			Mixed keys
  		</div>
</template>
