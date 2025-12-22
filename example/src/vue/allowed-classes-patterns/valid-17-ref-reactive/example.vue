<script setup lang="ts">
import { ref, reactive } from 'vue';

// ✅ Valid: ref and reactive with classes matching patterns
// @validClasses [custom-button, close-icon]
const refClass = ref('custom-button');
const reactiveState = reactive({
  className: 'close-icon'
});
</script>

<template>
  <div :class="refClass">Ref with valid pattern</div>
  <div :class="reactiveState.className">Reactive with valid pattern</div>
</template>
