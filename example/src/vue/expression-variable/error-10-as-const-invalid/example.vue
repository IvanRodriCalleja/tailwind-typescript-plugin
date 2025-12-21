<script setup lang="ts">
const asConstInvalid = 'invalid-const' as const;

// ❌ Invalid: Variable with as const assertion containing invalid
// @invalidClasses [invalid-const]
</script>

<template>
  <div :class="asConstInvalid">As const assertion - invalid</div>
</template>
