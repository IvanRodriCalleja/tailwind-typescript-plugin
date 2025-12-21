<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ✅ Valid: Multiple objects, all valid
// @validClasses [flex, items-center, justify-center, bg-blue-500]
</script>

<template>
  <div
  			:class="clsx(
  				{ flex: true, 'items-center': true },
  				{ 'justify-center': isActive, 'bg-blue-500': true }
  			)">
  			Multiple objects
  		</div>
</template>
