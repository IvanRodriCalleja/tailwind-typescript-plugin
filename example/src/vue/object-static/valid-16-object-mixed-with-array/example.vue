<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ✅ Valid: Mix of object and array
// @validClasses [flex, items-center, justify-center, bg-blue-500]
</script>

<template>
  <div
  			:class="clsx(['flex', 'items-center'], {
  				'justify-center': true,
  				'bg-blue-500': isActive
  			})">
  			Mixed with array
  		</div>
</template>
