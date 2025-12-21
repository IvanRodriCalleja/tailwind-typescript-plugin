<script setup lang="ts">
// ✅ Valid: Unknown function with array (ignored, not validated)
</script>

<template>
  <div :class="unknownBuilder(['flex', 'totally-invalid', 'items-center'])">
  			Unknown function ignored
  		</div>
</template>
