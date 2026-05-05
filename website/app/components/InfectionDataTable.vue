
<template>
  <v-card variant="flat">
    <v-data-table-server
      :headers="headers"
      :items="props.records"
      :items-length="props.totalItems"
      item-value="id"
      :loading="props.loading"
      :page="props.page"
      :items-per-page="props.pageSize"
      :items-per-page-options="pageSizeOptions"
      :sort-by="tableSortBy"
      :must-sort="props.canSortByValue"
      @update:page="emit('change-page', $event)"
      @update:items-per-page="onPageSizeChanged"
      @update:sort-by="onSortByChanged"
    >
      <template #top>
        <InfectionFiltersRow
          :filters="props.filters"
          :loading="props.loading"
          @apply-filters="emit('apply-filters', $event)"
        />
      </template>

      <template #item.ageGroupId="{ value }">
        {{ value || '-' }}
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script setup lang="ts">
import type { InfectionDataRecord, InfectionTableFilters } from '~/app/utils/infectionData'

const props = defineProps<{
  records: InfectionDataRecord[]
  loading: boolean
  page: number
  pageSize: number
  totalItems: number
  sortOrder: 'ASC' | 'DESC'
  canSortByValue: boolean
  filters: InfectionTableFilters
}>()

const emit = defineEmits<{
  'change-page': [number]
  'change-page-size': [number]
  'change-sort-order': ['ASC' | 'DESC']
  'apply-filters': [InfectionTableFilters]
}>()

const pageSizeOptions = [5, 10, 20, 50, 100]

const headers = computed(() => [
  { title: 'admin0Id', key: 'admin0Id', sortable: false },
  { title: 'admin1Id', key: 'admin1Id', sortable: false },
  { title: 'summaryTypeId', key: 'summaryTypeId', sortable: false },
  { title: 'indicatorId', key: 'indicatorId', sortable: false },
  { title: 'ageGroupId', key: 'ageGroupId', sortable: false },
  { title: 'value', key: 'value', sortable: props.canSortByValue }
])

const tableSortBy = computed(() => {
  if (!props.canSortByValue) {
    return []
  }

  return [{ key: 'value', order: props.sortOrder === 'ASC' ? 'asc' : 'desc' }]
})

const onPageSizeChanged = (value: number) => {
  if (value > 0) {
    emit('change-page-size', value)
  }
}

const onSortByChanged = (sortBy: Array<{ key: string; order?: 'asc' | 'desc' }>) => {
  if (!props.canSortByValue) {
    return
  }

  const valueSort = sortBy.find((item) => item.key === 'value')
  if (!valueSort) {
    return
  }

  const nextOrder = valueSort.order === 'asc' ? 'ASC' : valueSort.order === 'desc' ? 'DESC' : props.sortOrder
  emit('change-sort-order', nextOrder)
}



</script>
