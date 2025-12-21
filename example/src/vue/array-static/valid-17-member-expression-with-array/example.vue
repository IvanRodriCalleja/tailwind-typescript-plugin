<script setup lang="ts">
// ✅ Valid: Member expression with array
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="utils.cn(['flex', 'items-center', 'justify-center'])">Member with array</div>
</template>
