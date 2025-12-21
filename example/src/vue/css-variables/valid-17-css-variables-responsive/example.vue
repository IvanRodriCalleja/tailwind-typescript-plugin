<script setup lang="ts">
// ✅ Valid: CSS variables with responsive variants
// @validClasses [[--mobile-spacing:0.5rem], [--desktop-spacing:2rem], p-[var(--mobile-spacing)], md:p-[var(--desktop-spacing)]]
</script>

<template>
  <div class="[--mobile-spacing:0.5rem] [--desktop-spacing:2rem] p-[var(--mobile-spacing)] md:p-[var(--desktop-spacing)]">
  			Responsive CSS variables
  		</div>
</template>
