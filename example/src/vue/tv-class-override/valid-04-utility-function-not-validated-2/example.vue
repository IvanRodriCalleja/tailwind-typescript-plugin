<script setup lang="ts">
// ✅ Valid: Another utility function should NOT be validated
// @validClasses []
</script>

<template>
  <div :class="buildStyles({ className: 'also-not-validated another-invalid' })">
  			Utility Function 2 (should not validate)
  		</div>
</template>
