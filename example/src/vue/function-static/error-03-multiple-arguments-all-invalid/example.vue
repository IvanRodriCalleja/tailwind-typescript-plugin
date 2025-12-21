<script setup lang="ts">
import clsx from 'clsx';

// ❌ Invalid: Multiple arguments, all invalid
// @invalidClasses [invalid-one, invalid-two, invalid-three]
</script>

<template>
  <div :class="clsx('invalid-one', 'invalid-two', 'invalid-three')">
  			Multiple invalid arguments
  		</div>
</template>
