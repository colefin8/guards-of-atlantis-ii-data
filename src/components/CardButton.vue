<script setup lang="ts">
import { computed } from 'vue'
import { getColorClasses } from '../utils/colorMap'
import type { Card } from '../../types'

interface Props {
  card: Card
}

const props = defineProps<Props>()

defineEmits<{
  click: [card: Card]
}>()

const colorClasses = computed(() => {
  const classes = getColorClasses(props.card.color)
  return { bg: classes.bg }
})
</script>

<template>
  <button @click="$emit('click', card)"
    :class="[colorClasses.bg, 'px-3 py-2 rounded text-sm font-semibold hover:opacity-75 transition-opacity border border-gray-300 text-black']">
    {{ card.cardName }} ({{ card.tier }})
  </button>
</template>
