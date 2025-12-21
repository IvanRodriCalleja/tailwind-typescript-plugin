<script setup lang="ts">
const isActive = true;

// ✅ Valid: Member expression with object
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div :class="utils.clsx({ flex: true, 'items-center': true, 'justify-center': isActive })">
  			Member with object
  		</div>
</template>
