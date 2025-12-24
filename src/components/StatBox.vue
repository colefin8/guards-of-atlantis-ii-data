<script setup lang="ts">
interface Props {
  label: string
  value: string | number
  bgColor: string
}

defineProps<Props>()
</script>

<template>
  <div :class="[bgColor, 'p-4 rounded border-2 border-gray-300']">
    <strong class="text-base block mb-1 text-gray-900">{{ label }}:</strong>
    <span class="text-xl font-semibold text-gray-900">{{ value }}</span>
  </div>
</template>
