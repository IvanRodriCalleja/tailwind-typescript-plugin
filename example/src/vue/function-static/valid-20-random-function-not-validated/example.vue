<script setup lang="ts">
// ✅ Valid: Another unknown function with invalid classes (ignored)
// randomBuilder is not in the default list, so validation is skipped
</script>

<template>
  <div :class="randomBuilder('this-is-invalid', 'also-invalid', 'completely-wrong')">
  			Random function - ignored by plugin
  		</div>
</template>
