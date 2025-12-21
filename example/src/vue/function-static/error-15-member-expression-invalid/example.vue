<script setup lang="ts">
// ❌ Invalid: Member expression with invalid class
// @invalidClasses [invalid-class]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="utils.cn('flex', 'invalid-class', 'items-center')">
  			Member expression with invalid
  		</div>
</template>
