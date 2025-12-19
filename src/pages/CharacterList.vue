<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

interface Character {
  name: string
  cardCount: number
}

const router = useRouter()
const characters = ref<Character[]>([])
const searchQuery = ref('')
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3001/api/characters')
    if (!response.ok) throw new Error('Failed to fetch characters')
    characters.value = await response.json()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
  } finally {
    loading.value = false
  }
})

const filteredCharacters = () => {
  const query = searchQuery.value.toLowerCase()
  return characters.value.filter((char) => char.name.toLowerCase().includes(query))
}

const goToCharacter = (characterName: string) => {
  router.push({ name: 'CharacterDetails', params: { name: characterName } })
}

const errorState = computed(() => {
  return loading.value ? 'Loading Characters...' : error.value ? error.value : filteredCharacters().length === 0 ? 'No characters found' : false
})
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Characters</h2>

    <div class="rounded-lg bg-sky-100 w-fit">
      <input class="text-m p-4 rounded-lg" v-model="searchQuery" type="text" placeholder="Search characters..." />
    </div>
    <div class="bg-slate-400 mt-4 p-4 rounded-lg">

      <div class="bg-slate-100 p-4 text-lg" v-if="errorState">{{ errorState }}</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="character in filteredCharacters()" :key="character.name"
          class="aspect-square bg-slate-300 rounded-lg flex flex-col items-center justify-center text-center p-4 cursor-pointer duration-300 hover:shadow-lg hover:bg-slate-100 transition-all"
          @click="goToCharacter(character.name)">
          <h3 class="text-2xl font-bold mb-2">{{ character.name }}</h3>
          <p class="text-lg font-semibold">{{ character.cardCount }} cards</p>
          <p class="text-sm mt-2">General Stats go here</p>
          <p class="text-sm">Image Background eventually</p>
        </div>
      </div>
    </div>
  </div>
</template>
