<script setup lang="ts">
const isError = true;

// ❌ Invalid: Type assertion on ternary with invalid
// @invalidClasses [invalid-class]
// @validClasses [bg-blue-500]
</script>

<template>
  <div :class="(isError ? 'invalid-class' : 'bg-blue-500') as string">
  			Invalid in ternary with assertion
  		</div>
</template>
