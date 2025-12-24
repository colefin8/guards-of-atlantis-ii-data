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
</script>

<template>
  <div v-if="cards.length > 0" class="flex-1">
    <p class="text-base font-bold mb-2">{{ label }}:</p>
    <div class="flex flex-wrap gap-2">
      <CardButton v-for="card in cards" :key="card.cardName" :card="card" @click="$emit('select-card', $event)" />
    </div>
  </div>
</template>
