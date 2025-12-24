<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { Card, Spell } from '../../types'
import StatBox from './StatBox.vue'
import SectionBox from './SectionBox.vue'
import CardList from './CardList.vue'

interface Props {
  card: Card
  allCards: Card[]
  characterName?: string
}

const props = defineProps<Props>()
const spells = ref<Spell[]>([])
const showSpells = ref(false)
const referencedSpells = ref<Spell[]>([])

defineEmits<{
  close: []
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

const getTierProgression = (currentTier: string): { prev: string | null; next: string | null } => {
  const tierOrder = ['Basic', 'I', 'II', 'III', 'IV', 'H']
  const currentIndex = tierOrder.indexOf(currentTier)

  return {
    prev: currentIndex > 0 ? tierOrder[currentIndex - 1] ?? null : null,
    next: currentIndex < tierOrder.length - 1 ? tierOrder[currentIndex + 1] ?? null : null
  }
}

const getUpgrades = computed(() => {
  const { next } = getTierProgression(props.card.tier)
  if (!next) return []

  return props.allCards.filter(
    c => c.color === props.card.color && c.tier === next
  )
})

const getDowngrades = computed(() => {
  const { prev } = getTierProgression(props.card.tier)
  if (!prev) return []

  return props.allCards.filter(
    c => c.color === props.card.color && c.tier === prev
  )
})

onMounted(async () => {
  if (props.characterName === 'Gydion') {
    try {
      const response = await fetch('/api/spells')
      if (response.ok) {
        spells.value = await response.json()
        updateReferencedSpells()
      }
    } catch (err) {
      console.error('Failed to load spells:', err)
    }
  }
})

const extractSpellNames = (): string[] => {
  const spellNameRegex = /"([^"]+)"/g
  const matches: string[] = []
  let match

  while ((match = spellNameRegex.exec(props.card.cardText)) !== null) {
    matches.push(match[1] || '')
  }

  return matches
}

const updateReferencedSpells = () => {
  const spellNames = extractSpellNames()
  referencedSpells.value = spells.value.filter(spell =>
    spellNames.includes(spell.cardName)
  )
}
</script>

<template>
  <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50" @click="$emit('close')">
    <div :class="[getColorClasses(card.color).bg, 'rounded-lg shadow-lg max-w-2xl w-full mx-4']" @click.stop>
      <div
        :class="[getColorClasses(card.color).header, 'text-white p-4 rounded-t-lg flex justify-between items-center']">
        <h3 class="text-2xl font-bold">{{ card.cardName }}</h3>
        <button class="text-2xl hover:opacity-80" @click="$emit('close')">✕</button>
      </div>
      <div class="p-5">
        <div class="grid grid-cols-2 gap-3 mb-5">
          <StatBox v-if="card.initiative" label="Initiative" :value="card.initiative"
            :bg-color="getColorClasses(card.color).bg" />
          <StatBox v-if="card.tier" label="Tier" :value="card.tier" :bg-color="getColorClasses(card.color).bg" />
          <StatBox v-if="card.defense" label="Defense" :value="card.defense"
            :bg-color="getColorClasses(card.color).bg" />
          <StatBox v-if="card.movement" label="Movement" :value="card.movement"
            :bg-color="getColorClasses(card.color).bg" />
          <StatBox v-if="card.attack" label="Attack" :value="card.attack" :bg-color="getColorClasses(card.color).bg" />
          <StatBox v-if="card.actionType" label="Action" :value="card.actionType"
            :bg-color="getColorClasses(card.color).bg" />
          <StatBox v-if="card.rangeRadius" label="Range/Radius" :value="card.rangeRadius"
            :bg-color="getColorClasses(card.color).bg" />
          <StatBox v-if="card.itemIcon" label="Item Icon" :value="card.itemIcon"
            :bg-color="getColorClasses(card.color).bg" />
        </div>
        <SectionBox :bg-color="getColorClasses(card.color).bg">
          <strong class="text-base block mb-2">Ability:</strong>
          <div class="text-sm leading-relaxed whitespace-pre-wrap">{{ card.cardText }}</div>
          <p v-if="card.flavorText" class="text-xs italic text-gray-600 mt-2">{{ card.flavorText }}</p>
        </SectionBox>

        <!-- Gydion spell references -->
        <SectionBox v-if="characterName === 'Gydion' && referencedSpells.length > 0"
          :bg-color="getColorClasses(card.color).bg">
          <button @click="showSpells = !showSpells"
            class="w-full text-left font-semibold text-base mb-2 flex justify-between items-center hover:opacity-80">
            <span>Referenced Spells ({{ referencedSpells.length }})</span>
            <span>{{ showSpells ? '▼' : '▶' }}</span>
          </button>
          <div v-if="showSpells" class="space-y-3 mt-3 max-h-64 overflow-y-auto">
            <div v-for="spell in referencedSpells" :key="spell.id" class="border-l-4 border-gray-400 pl-3 pb-3">
              <p class="font-semibold text-sm">{{ spell.cardName }}</p>
              <p class="text-xs text-gray-700 mt-1">{{ spell.actionType }}</p>
              <p class="text-xs leading-relaxed mt-2 whitespace-pre-wrap">{{ spell.cardText }}</p>
            </div>
          </div>
        </SectionBox>

        <!-- Upgrade/Downgrade buttons -->
        <div class="mt-4 flex flex-col gap-3">
          <CardList :cards="getDowngrades" label="Downgrades" @select-card="$emit('select-card', $event)" />
          <CardList :cards="getUpgrades" label="Upgrades" @select-card="$emit('select-card', $event)" />
        </div>
      </div>
    </div>
  </div>
</template>
