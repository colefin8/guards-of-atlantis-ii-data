<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SpellTable from '../components/SpellTable.vue'
import CardModal from '../components/CardModal.vue'
import type { Spell } from '../../types'

const router = useRouter()
const spells = ref<Spell[]>([])
const loading = ref(true)
const error = ref('')
const selectedSpell = ref<Spell | null>(null)

onMounted(async () => {
    try {
        const response = await fetch('/api/spells')
        if (!response.ok) throw new Error('Spells not found')
        spells.value = await response.json()
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to load spells'
        router.push('/character/Gydion')
    } finally {
        loading.value = false
    }
})

const openSpellDetail = (spell: Spell) => {
    selectedSpell.value = spell
}

const closeModal = () => {
    selectedSpell.value = null
}
</script>

<template>
    <div class="p-4">
        <div class="flex items-center gap-3 mb-4">
            <h2 class="text-3xl font-bold">Gydion's Spellbook</h2>
            <router-link to="/character/Gydion" class="text-blue-600 hover:text-blue-800 font-semibold">
                ← Back to Character
            </router-link>
        </div>

        <div v-if="loading" class="text-lg">Loading spells...</div>
        <div v-else-if="error" class="text-lg text-red-600">{{ error }}</div>
        <div v-else>
            <SpellTable :spells="spells" @select-spell="openSpellDetail" />

            <CardModal v-if="selectedSpell" :card="selectedSpell" :all-cards="spells" character-name="Gydion"
                @close="closeModal" @select-card="openSpellDetail" />
        </div>
    </div>
</template>
