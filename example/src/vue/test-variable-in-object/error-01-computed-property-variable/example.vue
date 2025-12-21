<script setup lang="ts">
const invalidClass = 'invalid-object-var';

// ❌ Invalid: Computed property with variable containing invalid class
// @invalidClasses [invalid-object-var]
</script>

<template>
  <div :class="{ [invalidClass]: true }">Computed property var</div>
</template>
