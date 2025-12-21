<script setup lang="ts">
// ✅ Valid: Member expression with valid classes
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="utils.cn('flex', 'items-center', 'justify-center')">
  			Member expression valid
  		</div>
</template>
