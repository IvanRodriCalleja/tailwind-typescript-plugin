<script setup lang="ts">
// ❌ Invalid: Class from scoped slot prop with invalid class
// @invalidClasses [invalid-slot-class]

// Simulating a component that receives class from slot props
const slotProps = {
  buttonClass: 'flex items-center invalid-slot-class'
};
</script>

<template>
  <div :class="slotProps.buttonClass">Slot prop class</div>
</template>
