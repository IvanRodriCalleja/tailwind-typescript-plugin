<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ❌ Invalid: Multiple objects with invalid in both
// @invalidClasses [invalid-first, invalid-second]
// @validClasses [flex, bg-blue-500]
</script>

<template>
  <div
  			:class="clsx(
  				{ flex: true, 'invalid-first': true },
  				{ 'invalid-second': isActive, 'bg-blue-500': true }
  			)">
  			Invalid in both
  		</div>
</template>
