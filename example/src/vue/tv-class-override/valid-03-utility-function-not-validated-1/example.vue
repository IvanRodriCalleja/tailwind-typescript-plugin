<script setup lang="ts">
// ✅ Valid: Utility function with "invalid" classes should NOT be validated
// @validClasses []
</script>

<template>
  <div :class="myCustomBuilder({ class: 'this-is-not-validated invalid-but-ok' })">
  			Utility Function 1 (should not validate)
  		</div>
</template>
