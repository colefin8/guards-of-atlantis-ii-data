<script setup lang="ts">
import { computed } from 'vue'

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

interface Props {
    card: Card
    allCards: Card[]
}

const props = defineProps<Props>()

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
                    <div v-if="card.initiative" :class="[getColorClasses(card.color).bg, 'p-3 rounded']">
                        <strong class="text-base block mb-1">Initiative:</strong> <span class="text-lg font-semibold">{{
                            card.initiative }}</span>
                    </div>
                    <div v-if="card.tier" :class="[getColorClasses(card.color).bg, 'p-3 rounded']">
                        <strong class="text-base block mb-1">Tier:</strong> <span class="text-lg font-semibold">{{
                            card.tier }}</span>
                    </div>
                    <div v-if="card.defense" :class="[getColorClasses(card.color).bg, 'p-3 rounded']">
                        <strong class="text-base block mb-1">Defense:</strong> <span class="text-lg font-semibold">{{
                            card.defense }}</span>
                    </div>
                    <div v-if="card.movement" :class="[getColorClasses(card.color).bg, 'p-3 rounded']">
                        <strong class="text-base block mb-1">Movement:</strong> <span class="text-lg font-semibold">{{
                            card.movement }}</span>
                    </div>
                    <div v-if="card.attack" :class="[getColorClasses(card.color).bg, 'p-3 rounded']">
                        <strong class="text-base block mb-1">Attack:</strong> <span class="text-lg font-semibold">{{
                            card.attack }}</span>
                    </div>
                    <div v-if="card.actionType" :class="[getColorClasses(card.color).bg, 'p-3 rounded']">
                        <strong class="text-base block mb-1">Action:</strong> <span class="text-lg font-semibold">{{
                            card.actionType }}</span>
                    </div>
                    <div v-if="card.rangeRadius" :class="[getColorClasses(card.color).bg, 'p-3 rounded']">
                        <strong class="text-base block mb-1">Range/Radius:</strong> <span
                            class="text-lg font-semibold">{{
                                card.rangeRadius }}</span>
                    </div>
                    <div v-if="card.itemIcon" :class="[getColorClasses(card.color).bg, 'p-3 rounded']">
                        <strong class="text-base block mb-1">Item Icon:</strong> <span class="text-lg font-semibold">{{
                            card.itemIcon }}</span>
                    </div>
                </div>
                <div :class="[getColorClasses(card.color).bg, 'p-4 rounded mb-4']">
                    <strong class="text-base block mb-2">Ability:</strong>
                    <p class="text-sm leading-relaxed">{{ card.cardText }}</p>
                </div>

                <!-- Upgrade/Downgrade buttons -->
                <div class="mt-4 flex flex-col gap-3">
                    <div v-if="getDowngrades.length > 0" class="flex-1">
                        <p class="text-base font-bold mb-2">Downgrades:</p>
                        <div class="flex flex-wrap gap-2">
                            <button v-for="c in getDowngrades" :key="c.cardName" @click="$emit('select-card', c)"
                                :class="[getColorClasses(c.color).bg, getColorClasses(c.color).header, 'text-white px-3 py-2 rounded text-sm font-semibold hover:opacity-80 transition-opacity']">
                                {{ c.cardName }} ({{ c.tier }})
                            </button>
                        </div>
                    </div>
                    <div v-if="getUpgrades.length > 0" class="flex-1">
                        <p class="text-base font-bold mb-2">Upgrades:</p>
                        <div class="flex flex-wrap gap-2">
                            <button v-for="c in getUpgrades" :key="c.cardName" @click="$emit('select-card', c)"
                                :class="[getColorClasses(c.color).bg, getColorClasses(c.color).header, 'text-white px-3 py-2 rounded text-sm font-semibold hover:opacity-80 transition-opacity']">
                                {{ c.cardName }} ({{ c.tier }})
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
