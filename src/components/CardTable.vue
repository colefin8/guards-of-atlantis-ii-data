<script setup lang="ts">
import { ref, computed } from 'vue'

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

type SortColumn = 'id' | 'initiative' | 'cardName' | 'tier' | 'actionType' | 'defense' | 'movement' | 'attack' | 'rangeRadius' | 'itemIcon'

interface Props {
  cards: Card[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'select-card': [card: Card]
}>()

const sortColumn = ref<SortColumn>('id')
const sortDirection = ref<'asc' | 'desc'>('asc')

const sortedCards = computed(() => {
  const cards = [...props.cards]

  cards.sort((a, b) => {
    let aVal = a[sortColumn.value] || ''
    let bVal = b[sortColumn.value] || ''

    // Handle tier with custom order
    if (sortColumn.value === 'tier') {
      const tierOrder: Record<string, number> = {
        'Basic': 0,
        'I': 1,
        'II': 2,
        'III': 3,
        'IV': 4,
        'H': 5
      }
      const aOrder = tierOrder[String(aVal)] ?? 999
      const bOrder = tierOrder[String(bVal)] ?? 999
      return sortDirection.value === 'asc' ? aOrder - bOrder : bOrder - aOrder
    }

    if (sortColumn.value === 'id') {
      const idOrder: Record<string, number> = {
        'D': 0,
        'S': 1,
        'B1': 2,
        'G1': 3,
        'R1': 4,
        'B2A': 5,
        'B2B': 6,
        'G2A': 7,
        'G2B': 8,
        'R2A': 9,
        'R2B': 10,
        'B3A': 11,
        'B3B': 12,
        'G3A': 13,
        'G3B': 14,
        'R3A': 15,
        'R3B': 16,
        'P4': 17,
        'DH': 18,
      }
      const aOrder = idOrder[String(aVal)] ?? 999
      const bOrder = idOrder[String(bVal)] ?? 999
      return sortDirection.value === 'asc' ? aOrder - bOrder : bOrder - aOrder
    }

    // Handle numeric sorting for initiative
    if (sortColumn.value === 'initiative') {
      aVal = parseInt(String(aVal)) || 999
      bVal = parseInt(String(bVal)) || 999
    }

    if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })

  return cards
})

const handleSort = (column: SortColumn) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
  hasManualOrder.value = false
}

const getSortIndicator = (column: SortColumn) => {
  if (sortColumn.value !== column) return ''
  return sortDirection.value === 'asc' ? ' ▲' : ' ▼'
}

const getColorClasses = (color: string) => {
  const colorMap: Record<string, { bg: string; border: string; header: string; text: string; hover: string }> = {
    Red: { bg: 'bg-red-100', border: 'border-red-600', header: 'bg-red-600', text: 'text-red-700', hover: 'hover:bg-red-200' },
    Blue: { bg: 'bg-blue-100', border: 'border-blue-600', header: 'bg-blue-600', text: 'text-blue-700', hover: 'hover:bg-blue-200' },
    Green: { bg: 'bg-green-100', border: 'border-green-600', header: 'bg-green-600', text: 'text-green-700', hover: 'hover:bg-green-200' },
    Black: { bg: 'bg-gray-100', border: 'border-gray-800', header: 'bg-gray-800', text: 'text-gray-800', hover: 'hover:bg-gray-200' },
    Gold: { bg: 'bg-yellow-100', border: 'border-yellow-600', header: 'bg-yellow-600', text: 'text-yellow-700', hover: 'hover:bg-yellow-200' },
    Silver: { bg: 'bg-slate-100', border: 'border-slate-500', header: 'bg-slate-500', text: 'text-slate-700', hover: 'hover:bg-slate-200' },
    Purple: { bg: 'bg-purple-100', border: 'border-purple-600', header: 'bg-purple-600', text: 'text-purple-700', hover: 'hover:bg-purple-200' },
  }
  return colorMap[color] || { bg: 'bg-slate-100', border: 'border-slate-600', header: 'bg-slate-600', text: 'text-slate-700', hover: 'hover:bg-slate-200' }
}

const handleRowClick = (card: Card) => {
  emit('select-card', card)
}
</script>

<template>
  <div class="bg-slate-400 mt-4 p-4 rounded-lg">
    <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-slate-600 text-white">
            <th
              class="hidden lg:table-cell border-2 border-slate-600 p-3 text-left cursor-pointer hover:bg-slate-500 whitespace-nowrap w-auto"
              @click="handleSort('id')">
              ID{{ getSortIndicator('id') }}
            </th>
            <th class="border-2 border-slate-600 p-3 text-left cursor-pointer hover:bg-slate-500"
              @click="handleSort('cardName')">
              Card Name{{ getSortIndicator('cardName') }}
            </th>
            <th class="border-2 border-slate-600 p-3 text-left cursor-pointer hover:bg-slate-500"
              @click="handleSort('tier')">
              Tier{{ getSortIndicator('tier') }}
            </th>
            <th class="hidden md:table-cell border-2 border-slate-600 p-3 text-left cursor-pointer hover:bg-slate-500"
              @click="handleSort('initiative')">
              Initiative{{ getSortIndicator('initiative') }}
            </th>
            <th
              class="hidden md:table-cell border-2 border-slate-600 p-3 text-left cursor-pointer hover:bg-slate-500 whitespace-nowrap w-auto"
              @click="handleSort('attack')">
              Attack{{ getSortIndicator('attack') }}
            </th>
            <th class="hidden lg:table-cell border-2 border-slate-600 p-3 text-left cursor-pointer hover:bg-slate-500"
              @click="handleSort('rangeRadius')">
              Range/Radius{{ getSortIndicator('rangeRadius') }}
            </th>
            <th class="hidden lg:table-cell border-2 border-slate-600 p-3 text-left cursor-pointer hover:bg-slate-500"
              @click="handleSort('defense')">
              Defense{{ getSortIndicator('defense') }}
            </th>
            <th class="hidden lg:table-cell border-2 border-slate-600 p-3 text-left cursor-pointer hover:bg-slate-500"
              @click="handleSort('movement')">
              Movement{{ getSortIndicator('movement') }}
            </th>
            <th class="hidden lg:table-cell border-2 border-slate-600 p-3 text-left cursor-pointer hover:bg-slate-500"
              @click="handleSort('itemIcon')">
              Item Type{{ getSortIndicator('itemIcon') }}
            </th>
            <th class="border-2 border-slate-600 p-3 text-left cursor-pointer hover:bg-slate-500"
              @click="handleSort('actionType')">
              Action{{ getSortIndicator('actionType') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="card in sortedCards" :key="card.cardName" :class="[
            getColorClasses(card.color).bg,
            getColorClasses(card.color).border,
            getColorClasses(card.color).hover,
            'border-2 transition-all cursor-pointer'
          ]" @click="handleRowClick(card)">
            <td class="hidden lg:table-cell border-2 border-slate-600 p-3 font-mono text-sm font-bold">{{ card.id }}
            </td>
            <td class="border-2 border-slate-600 p-3 font-semibold">{{ card.cardName }}</td>
            <td class="border-2 border-slate-600 p-3">{{ card.tier }}</td>
            <td class="hidden md:table-cell border-2 border-slate-600 p-3">{{ card.initiative }}</td>
            <td class="hidden md:table-cell border-2 border-slate-600 p-3">{{ card.attack || '—' }}</td>
            <td class="hidden lg:table-cell border-2 border-slate-600 p-3">{{ card.rangeRadius || '—' }}</td>
            <td class="hidden lg:table-cell border-2 border-slate-600 p-3">{{ card.defense || '—' }}</td>
            <td class="hidden lg:table-cell border-2 border-slate-600 p-3">{{ card.movement || '—' }}</td>
            <td class="hidden lg:table-cell border-2 border-slate-600 p-3">{{ card.itemIcon || '—' }}</td>
            <td class="border-2 border-slate-600 p-3">{{ card.actionType }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
