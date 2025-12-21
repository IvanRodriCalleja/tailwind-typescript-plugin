<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ❌ Invalid: Object with mix of arbitrary and invalid
// @invalidClasses [invalid-size]
// @validClasses [h-[50vh], w-[100px]]
</script>

<template>
  <div :class="clsx({ 'h-[50vh]': true, 'invalid-size': true, 'w-[100px]': isActive })">
  			Arbitrary and invalid
  		</div>
</template>
