<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ❌ Invalid: Multiple objects with invalid in second object
// @invalidClasses [invalid-class]
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div
  			:class="clsx(
  				{ flex: true, 'items-center': true },
  				{ 'justify-center': isActive, 'invalid-class': true }
  			)">
  			Invalid in second
  		</div>
</template>
