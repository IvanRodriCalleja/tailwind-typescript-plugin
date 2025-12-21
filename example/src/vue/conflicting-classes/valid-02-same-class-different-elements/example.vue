<script setup lang="ts">
// ✅ Valid: Same class in different elements - no conflict
// @validClasses [text-left, text-center]
</script>

<template>
  <div class="text-left">
  			<span class="text-center">Same utility, different elements</span>
  		</div>
</template>
