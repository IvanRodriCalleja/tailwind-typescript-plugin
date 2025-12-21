<script setup lang="ts">
// ❌ Invalid: Member expression with invalid in array
// @invalidClasses [invalid-class]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="utils.cn(['flex', 'invalid-class', 'items-center'])">Member with invalid</div>
</template>
