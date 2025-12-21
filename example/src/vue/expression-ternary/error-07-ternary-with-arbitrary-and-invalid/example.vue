<script setup lang="ts">
const isActive = true;

// ❌ Invalid: Ternary with mix of arbitrary and invalid
// @invalidClasses [invalid-size]
// @validClasses [h-[50vh], h-[30vh]]
</script>

<template>
  <div :class="isActive ? 'h-[50vh] invalid-size' : 'h-[30vh]'">
  			Ternary with arbitrary and invalid
  		</div>
</template>
