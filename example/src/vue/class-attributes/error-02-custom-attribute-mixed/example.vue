<script setup lang="ts">
// Error: Mix of valid and invalid classes in custom attribute
// @invalidClasses [not-a-class, also-invalid]
</script>

<template>
  <View colorStyles="flex not-a-class items-center also-invalid">Hello</View>
</template>
