<script setup lang="ts">
// ❌ Invalid: Mix of allowed, Tailwind, and invalid classes
// @invalidClasses [invalid-class]
// @validClasses [custom-button, flex, items-center]
</script>

<template>
  <div class="custom-button flex invalid-class items-center">Custom + Tailwind + Invalid</div>
</template>
