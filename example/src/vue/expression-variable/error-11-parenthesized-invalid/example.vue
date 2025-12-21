<script setup lang="ts">
const parenthesizedInvalid = 'invalid-paren';

// ❌ Invalid: Variable with parenthesized expression containing invalid
// @invalidClasses [invalid-paren]
</script>

<template>
  <div :class="parenthesizedInvalid">Parenthesized expression - invalid</div>
</template>
