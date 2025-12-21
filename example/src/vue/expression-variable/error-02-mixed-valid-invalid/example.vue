<script setup lang="ts">
const mixedClasses = 'flex invalid-one items-center invalid-two';

// ❌ Invalid: Variable with mix of valid and invalid classes
// @invalidClasses [invalid-one, invalid-two]
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="mixedClasses">Mixed valid and invalid classes</div>
</template>
