<script setup lang="ts">
// ❌ Invalid: Mix of valid and invalid classes
// @invalidClasses [invalidclass, badone]
// @validClasses [flex, items-center]
</script>

<template>
  <div class="flex invalidclass items-center badone">Mixed valid and invalid</div>
</template>
