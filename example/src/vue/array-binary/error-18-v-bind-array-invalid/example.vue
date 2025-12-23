<script setup lang="ts">
const isError = true;

// ❌ Invalid: v-bind:class array with binary, invalid class
// @invalidClasses [invalid-vbind]
// @validClasses [flex]
</script>

<template>
  <div v-bind:class="['flex', isError && 'invalid-vbind']">v-bind:class array</div>
</template>
