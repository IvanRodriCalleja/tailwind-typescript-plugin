<script setup lang="ts">
import clsx from 'clsx';

// ❌ Invalid: Function with mix of arbitrary and invalid classes
// @invalidClasses [invalid-size]
// @validClasses [h-[50vh], w-[100px]]
</script>

<template>
  <div :class="clsx('h-[50vh]', 'invalid-size', 'w-[100px]')">
  			Function with arbitrary and invalid
  		</div>
</template>
