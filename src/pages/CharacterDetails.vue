<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CardTable from '../components/CardTable.vue'
import CardModal from '../components/CardModal.vue'

interface Card {
  id: string
  initiative: string | number
  cardName: string
  tier: string
  color: string
  defense?: string
  movement?: string
  attack?: string
  actionType: string
  rangeRadius?: string
  cardText: string
  itemIcon?: string
}

interface CharacterData {
  name: string
  cardCount: number
  cards: Card[]
}

const route = useRoute()
const router = useRouter()
const characterData = ref<CharacterData | null>(null)
const loading = ref(true)
const error = ref('')
const selectedCard = ref<Card | null>(null)

onMounted(async () => {
  const characterName = route.params.name as string
  try {
    const response = await fetch(`http://localhost:3001/api/characters/${characterName}`)
    if (!response.ok) throw new Error('Character not found')
    characterData.value = await response.json()
    console.log(characterData.value?.cards)

  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load character'
    router.push('/')
  } finally {
    loading.value = false
  }
})

const openCardDetail = (card: Card) => {
  selectedCard.value = card
}

const closeModal = () => {
  selectedCard.value = null
}
</script>

<template>
  <div class="p-4">
    <div v-if="loading" class="text-lg">Loading character data...</div>
    <div v-else-if="error" class="text-lg text-red-600">{{ error }}</div>
    <div v-else-if="characterData">
      <h2 class="text-3xl font-bold mb-2">{{ characterData.name }}</h2>

      <CardTable :cards="characterData.cards" @select-card="openCardDetail" />

      <CardModal v-if="selectedCard" :card="selectedCard" :all-cards="characterData.cards" @close="closeModal"
        @select-card="openCardDetail" />
    </div>
  </div>
</template>
