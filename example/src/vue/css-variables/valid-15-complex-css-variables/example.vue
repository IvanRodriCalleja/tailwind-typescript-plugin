<script setup lang="ts">
// ✅ Valid: Complex example with multiple definitions and uses
// @validClasses [[--primary:#3b82f6], [--secondary:#8b5cf6], [--spacing:1rem], [--radius:8px], bg-[var(--primary)], text-[var(--secondary)], p-[var(--spacing)], rounded-[var(--radius)]]
</script>

<template>
  <div class="[--primary:#3b82f6] [--secondary:#8b5cf6] [--spacing:1rem] [--radius:8px] bg-[var(--primary)] text-[var(--secondary)] p-[var(--spacing)] rounded-[var(--radius)]">
  			Complex CSS variables
  		</div>
</template>
