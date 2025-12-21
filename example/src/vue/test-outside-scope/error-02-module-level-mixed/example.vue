<script setup lang="ts">
const outsideMixedClasses = 'flex invalid-mixed-outside items-center';

// ❌ Invalid: Variable defined at module level with mixed valid and invalid classes
// @validClasses [flex, items-center]
// @invalidClasses [invalid-mixed-outside]
</script>

<template>
  <div :class="outsideMixedClasses">Mixed outside scope</div>
</template>
