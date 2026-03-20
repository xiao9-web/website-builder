<template>
  <div class="accordion-container">
    <div class="accordion-wrapper">
      <div
        v-for="group in groups"
        :key="group.id"
        class="accordion-item"
      >
        <button
          class="accordion-trigger"
          @click="toggleGroup(group.id)"
        >
          <span class="accordion-title">{{ group.title }}</span>
          <span
            class="accordion-icon"
            :class="{ 'is-active': activeGroupId === group.id }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </button>
        <div
          class="accordion-content"
          :class="{ 'is-open': activeGroupId === group.id }"
        >
          <ul class="accordion-list">
            <li
              v-for="item in group.items"
              :key="item.id"
              class="accordion-list-item"
            >
              {{ item.text }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeGroupId = ref<string | null>(null)

const groups = ref([
  {
    id: 'group-1',
    title: 'Group Name A',
    items: [
      { id: '1-1', text: 'Item 1.1' },
      { id: '1-2', text: 'Item 1.2' },
      { id: '1-3', text: 'Item 1.3' },
      { id: '1-4', text: 'Item 1.4' },
      { id: '1-5', text: 'Item 1.5' }
    ]
  },
  {
    id: 'group-2',
    title: 'Group Name B',
    items: [
      { id: '2-1', text: 'Item 2.1' },
      { id: '2-2', text: 'Item 2.2' },
      { id: '2-3', text: 'Item 2.3' },
      { id: '2-4', text: 'Item 2.4' },
      { id: '2-5', text: 'Item 2.5' },
      { id: '2-6', text: 'Item 2.6' },
      { id: '2-7', text: 'Item 2.7' }
    ]
  },
  {
    id: 'group-3',
    title: 'Group Name C',
    items: [
      { id: '3-1', text: 'Item 3.1' },
      { id: '3-2', text: 'Item 3.2' },
      { id: '3-3', text: 'Item 3.3' },
      { id: '3-4', text: 'Item 3.4' },
      { id: '3-5', text: 'Item 3.5' },
      { id: '3-6', text: 'Item 3.6' },
      { id: '3-7', text: 'Item 3.7' },
      { id: '3-8', text: 'Item 3.8' }
    ]
  },
  {
    id: 'group-4',
    title: 'Group Name D',
    items: [
      { id: '4-1', text: 'Item 4.1' },
      { id: '4-2', text: 'Item 4.2' },
      { id: '4-3', text: 'Item 4.3' },
      { id: '4-4', text: 'Item 4.4' },
      { id: '4-5', text: 'Item 4.5' },
      { id: '4-6', text: 'Item 4.6' }
    ]
  },
  {
    id: 'group-5',
    title: 'Group Name E',
    items: [
      { id: '5-1', text: 'Item 5.1' },
      { id: '5-2', text: 'Item 5.2' },
      { id: '5-3', text: 'Item 5.3' },
      { id: '5-4', text: 'Item 5.4' },
      { id: '5-5', text: 'Item 5.5' }
    ]
  },
  {
    id: 'group-6',
    title: 'Group Name F',
    items: [
      { id: '6-1', text: 'Item 6.1' },
      { id: '6-2', text: 'Item 6.2' },
      { id: '6-3', text: 'Item 6.3' },
      { id: '6-4', text: 'Item 6.4' },
      { id: '6-5', text: 'Item 6.5' },
      { id: '6-6', text: 'Item 6.6' },
      { id: '6-7', text: 'Item 6.7' },
      { id: '6-8', text: 'Item 6.8' }
    ]
  }
])

const toggleGroup = (groupId: string) => {
  if (activeGroupId.value === groupId) {
    activeGroupId.value = null
  } else {
    activeGroupId.value = groupId
  }
}
</script>

<style scoped>
.accordion-container {
  max-width: 56rem;
  margin: 0 auto;
  background: #ffffff;
  padding: 2rem;
}

.accordion-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.accordion-item {
  background: #ffffff;
  border-radius: 0.5rem;
  overflow: hidden;
}

.accordion-trigger {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #ffffff;
  border: none;
  border-top: 1px solid #f3f4f6;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.2s ease;
}

.accordion-title {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
}

.accordion-icon {
  color: #6b7280;
  transition: transform 0.2s ease;
}

.accordion-icon.is-active {
  transform: rotate(180deg);
}

.accordion-content {
  height: 0;
  overflow: hidden;
  transition: height 0.3s ease;
  background: #f9fafb;
}

.accordion-content.is-open {
  height: auto;
}

.accordion-list {
  padding: 0.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
}

.accordion-list-item {
  padding: 0.25rem 0 0.25rem 1rem;
  color: #6b7280;
  font-size: 0.875rem;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.accordion-list-item:hover {
  color: #0d9488;
  text-decoration: underline;
}
</style>
