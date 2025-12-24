<script setup lang="ts">
interface Props {
    bgColor: string
}

defineProps<Props>()
</script>

<template>
    <div :class="[bgColor, 'p-4 rounded mb-4']">
        <slot />
    </div>
</template>
