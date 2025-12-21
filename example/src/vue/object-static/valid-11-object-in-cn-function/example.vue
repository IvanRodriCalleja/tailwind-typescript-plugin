<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ✅ Valid: Object in cn() function
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="cn({ flex: true, 'items-center': true, 'justify-center': isActive })">
  			Object in cn()
  		</div>
</template>
