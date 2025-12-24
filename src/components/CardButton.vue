<script setup lang="ts">
import type { Card } from '../../types'

interface Props {
    card: Card
    bgColor: string
    headerColor: string
}

defineProps<Props>()

defineEmits<{
    click: [card: Card]
}>()
</script>

<template>
    <button @click="$emit('click', card)"
        :class="[bgColor, headerColor, 'text-white px-3 py-2 rounded text-sm font-semibold hover:opacity-80 transition-opacity']">
        {{ card.cardName }} ({{ card.tier }})
    </button>
</template>
