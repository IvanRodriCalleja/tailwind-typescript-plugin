<script setup lang="ts">
import { clsx as cn } from 'clsx';

// ❌ Invalid: Array with mix of arbitrary and invalid
// @invalidClasses [invalid-size]
// @validClasses [h-[50vh], w-[100px]]
</script>

<template>
  <div :class="cn(['h-[50vh]', 'invalid-size', 'w-[100px]'])">
  			Array with arbitrary and invalid
  		</div>
</template>
