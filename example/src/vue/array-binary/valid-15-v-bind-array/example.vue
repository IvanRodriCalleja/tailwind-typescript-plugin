<script setup lang="ts">
const isError = true;

// ✅ Valid: v-bind:class array with binary, all valid classes
// @validClasses [flex, text-red-500]
</script>

<template>
  <div v-bind:class="['flex', isError && 'text-red-500']">v-bind:class array</div>
</template>
