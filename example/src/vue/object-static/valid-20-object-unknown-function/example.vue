<script setup lang="ts">
const isActive = true;

// ✅ Valid: Unknown function with object (ignored, not validated)
</script>

<template>
  <div
  			:class="unknownBuilder({ flex: true, 'totally-invalid': true, 'items-center': isActive })">
  			Unknown ignored
  		</div>
</template>
