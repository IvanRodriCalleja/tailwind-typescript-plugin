<script setup lang="ts">
const isActive = true;

// ✅ Valid: Conflicting classes in DIFFERENT ternary branches - no conflict
// text-left in true branch, text-center in false branch are mutually exclusive
</script>

<template>
  <div :class="isActive ? 'text-left' : 'text-center'">
  			Ternary mutually exclusive - no conflict
  		</div>
</template>
