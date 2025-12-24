<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Spell } from '../../types'

type SortColumn = 'id' | 'cardName' | 'tier' | 'actionType' | 'attack' | 'rangeRadius'

interface Props {
  spells: Spell[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'select-spell': [spell: Spell]
}>()

const sortColumn = ref<SortColumn>('id')
const sortDirection = ref<'asc' | 'desc'>('asc')

const sortedSpells = computed(() => {
  const spells = [...props.spells]

  spells.sort((a, b) => {
    const aVal = a[sortColumn.value] || ''
    const bVal = b[sortColumn.value] || ''

    // Handle tier with custom order
    if (sortColumn.value === 'tier') {
      const tierOrder: Record<string, number> = {
        'Basic': 0,
        'I': 1,
        'II': 2,
        'III': 3,
        'IV': 4,
      }
      const aOrder = tierOrder[String(aVal)] ?? 999
      const bOrder = tierOrder[String(bVal)] ?? 999
      return sortDirection.value === 'asc' ? aOrder - bOrder : bOrder - aOrder
    }

    if (sortColumn.value === 'id') {
      const idOrder: Record<string, number> = {}
      props.spells.forEach((spell, index) => {
        idOrder[spell.id] = index
      })
      const aOrder = idOrder[String(aVal)] ?? 999
      const bOrder = idOrder[String(bVal)] ?? 999
      return sortDirection.value === 'asc' ? aOrder - bOrder : bOrder - aOrder
    }

    if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })

  return spells
})

const handleSort = (column: SortColumn) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
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
</script>

<template>
  <div class="bg-slate-400 mt-4 p-4 rounded-lg">
    <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-slate-600 text-white">
            <th
              class="hidden lg:table-cell border-2 border-slate-600 p-3 text-left cursor-pointer whitespace-nowrap w-auto"
              @click="handleSort('id')">
              ID{{ getSortIndicator('id') }}
            </th>
            <th class="border-2 border-slate-600 p-3 text-left cursor-pointer" @click="handleSort('cardName')">
              Spell Name{{ getSortIndicator('cardName') }}
            </th>
            <th class="border-2 border-slate-600 p-3 text-left cursor-pointer" @click="handleSort('tier')">
              Tier{{ getSortIndicator('tier') }}
            </th>
            <th
              class="hidden md:table-cell border-2 border-slate-600 p-3 text-left cursor-pointer whitespace-nowrap w-auto"
              @click="handleSort('attack')">
              Attack{{ getSortIndicator('attack') }}
            </th>
            <th class="hidden lg:table-cell border-2 border-slate-600 p-3 text-left cursor-pointer"
              @click="handleSort('rangeRadius')">
              Range/Radius{{ getSortIndicator('rangeRadius') }}
            </th>
            <th class="border-2 border-slate-600 p-3 text-left cursor-pointer" @click="handleSort('actionType')">
              Action{{ getSortIndicator('actionType') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="spell in sortedSpells" :key="spell.cardName" :class="[
            getColorClasses(spell.color).bg,
            getColorClasses(spell.color).border,
            getColorClasses(spell.color).hover,
            'border-2 transition-all cursor-pointer',
          ]" @click="emit('select-spell', spell)">
            <td class="hidden lg:table-cell border-2 border-slate-600 p-3 font-mono text-sm font-bold">{{ spell.id }}
            </td>
            <td class="border-2 border-slate-600 p-3 font-semibold">{{ spell.cardName }}</td>
            <td class="border-2 border-slate-600 p-3">{{ spell.tier }}</td>
            <td class="hidden md:table-cell border-2 border-slate-600 p-3">{{ spell.attack || '—' }}</td>
            <td class="hidden lg:table-cell border-2 border-slate-600 p-3">{{ spell.rangeRadius || '—' }}</td>
            <td class="border-2 border-slate-600 p-3">{{ spell.actionType }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
