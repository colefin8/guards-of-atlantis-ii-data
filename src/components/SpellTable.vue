<script setup lang="ts">
import { ref, computed } from 'vue'
import { getColorClasses } from '../utils/colorMap'
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
