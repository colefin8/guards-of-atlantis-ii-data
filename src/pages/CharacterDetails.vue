<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CardTable from '../components/CardTable.vue'
import CardModal from '../components/CardModal.vue'
import type { Card, CharacterData } from '../../types'

const route = useRoute()
const router = useRouter()
const characterData = ref<CharacterData | null>(null)
const loading = ref(true)
const error = ref('')
const selectedCard = ref<Card | null>(null)

onMounted(async () => {
  const characterName = route.params.name as string
  try {
    const response = await fetch(`/api/characters/${characterName}`)
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
      <div class="flex items-center gap-3 mb-4">
        <h2 class="text-3xl font-bold">{{ characterData.name }}</h2>
        <router-link v-if="characterData.name === 'Gydion'" to="/character/Gydion/spells"
          class="text-blue-600 hover:text-blue-800 font-semibold">
          View Spellbook →
        </router-link>
      </div>

      <CardTable :cards="characterData.cards" @select-card="openCardDetail" />

      <CardModal v-if="selectedCard" :card="selectedCard" :all-cards="characterData.cards"
        :character-name="characterData.name" @close="closeModal" @select-card="openCardDetail" />
    </div>
  </div>
</template>
