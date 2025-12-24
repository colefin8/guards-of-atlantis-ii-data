<script setup lang="ts">
import type { Card } from '../../types'
import CardButton from './CardButton.vue'

interface Props {
  cards: Card[]
  label: string
}

defineProps<Props>()

defineEmits<{
  'select-card': [card: Card]
}>()

const getColorClasses = (color: string) => {
  const colorMap: Record<string, { bg: string; border: string; header: string; text: string }> = {
    Red: { bg: 'bg-red-100', border: 'border-red-600', header: 'bg-red-600', text: 'text-red-700' },
    Blue: { bg: 'bg-blue-100', border: 'border-blue-600', header: 'bg-blue-600', text: 'text-blue-700' },
    Green: { bg: 'bg-green-100', border: 'border-green-600', header: 'bg-green-600', text: 'text-green-700' },
    Black: { bg: 'bg-gray-100', border: 'border-gray-800', header: 'bg-gray-800', text: 'text-gray-800' },
    Gold: { bg: 'bg-yellow-100', border: 'border-yellow-600', header: 'bg-yellow-600', text: 'text-yellow-700' },
    Silver: { bg: 'bg-slate-100', border: 'border-slate-500', header: 'bg-slate-500', text: 'text-slate-700' },
    Purple: { bg: 'bg-purple-100', border: 'border-purple-600', header: 'bg-purple-600', text: 'text-purple-700' },
  }
  return colorMap[color] || { bg: 'bg-slate-100', border: 'border-slate-600', header: 'bg-slate-600', text: 'text-slate-700' }
}
</script>

<template>
  <div v-if="cards.length > 0" class="flex-1">
    <p class="text-base font-bold mb-2">{{ label }}:</p>
    <div class="flex flex-wrap gap-2">
      <CardButton v-for="card in cards" :key="card.cardName" :card="card" :bg-color="getColorClasses(card.color).bg"
        :header-color="getColorClasses(card.color).header" @click="$emit('select-card', $event)" />
    </div>
  </div>
</template>
