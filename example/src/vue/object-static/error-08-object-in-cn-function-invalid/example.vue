<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ❌ Invalid: Object in cn() with invalid class
// @invalidClasses [invalid-class]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="cn({ flex: true, 'invalid-class': true, 'items-center': isActive })">
  			Invalid in cn()
  		</div>
</template>
