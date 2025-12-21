<script setup lang="ts">
const isDisabled = false;
const isError = false;

// ✅ Valid: Button-like component with multiple conditionals
// @validClasses [px-4, py-2, rounded, font-semibold, bg-blue-500, text-white, hover:bg-blue-600, bg-gray-300, text-gray-500, cursor-not-allowed, ring-2, ring-red-500]
</script>

<template>
  <button
  			:class="`px-4 py-2 rounded font-semibold ${isDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'} ${isError ? 'ring-2 ring-red-500' : ''}`">
  			Submit
  		</button>
</template>
