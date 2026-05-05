
<template>
  <div class="pa-4 pb-2">
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="2">
        <v-text-field
          v-model="localFilters.admin1Id"
          label="Filter: admin1Id"
          placeholder="optional"
          variant="outlined"
          density="comfortable"
          hide-details
          :disabled="props.loading"
        />
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3">
        <v-text-field
          v-model="localFilters.summaryTypeId"
          label="Filter: summaryTypeId"
          placeholder="required for value filter/sort"
          variant="outlined"
          density="comfortable"
          hide-details
          :disabled="props.loading"
        />
      </v-col>

      <v-col cols="12" sm="6" md="2" lg="2">
        <v-text-field
          v-model="localFilters.minValue"
          label="Min value"
          type="number"
          step="any"
          variant="outlined"
          density="comfortable"
          hide-details
          :disabled="props.loading || !hasSummaryTypeId"
        />
      </v-col>

      <v-col cols="12" sm="6" md="2" lg="2">
        <v-text-field
          v-model="localFilters.maxValue"
          label="Max value"
          type="number"
          step="any"
          variant="outlined"
          density="comfortable"
          hide-details
          :disabled="props.loading || !hasSummaryTypeId"
        />
      </v-col>

      <v-col cols="12" md="12" lg="3" class="d-flex align-center justify-start justify-lg-end flex-nowrap ga-2">
        <v-btn
          variant="outlined"
          :disabled="props.loading"
          @click="onClearFilters"
        >
          Clear
        </v-btn>

        <v-btn
          color="primary"
          :loading="props.loading"
          :disabled="props.loading || !hasAnyFilterValue"
          @click="onApplyFilters"
        >
          Apply filters
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { InfectionTableFilters } from '~/app/utils/infectionData'

const props = defineProps<{
  filters: InfectionTableFilters
  loading: boolean
}>()

const emit = defineEmits<{
  'apply-filters': [InfectionTableFilters]
}>()

const localFilters = reactive<InfectionTableFilters>({
  admin1Id: '',
  summaryTypeId: '',
  minValue: '',
  maxValue: ''
})

watch(
  () => props.filters,
  (value) => {
    localFilters.admin1Id = value.admin1Id
    localFilters.summaryTypeId = value.summaryTypeId
    localFilters.minValue = value.minValue
    localFilters.maxValue = value.maxValue
  },
  { immediate: true, deep: true }
)

const hasSummaryTypeId = computed(() => localFilters.summaryTypeId.trim().length > 0)

watch(hasSummaryTypeId, (value) => {
  if (!value) {
    localFilters.minValue = ''
    localFilters.maxValue = ''
  }
})

const hasAnyFilterValue = computed(() => {
  return Boolean(
    localFilters.admin1Id.trim() ||
    localFilters.summaryTypeId.trim() ||
    localFilters.minValue.trim() ||
    localFilters.maxValue.trim()
  )
})

const onApplyFilters = () => {
  emit('apply-filters', { ...localFilters })
}

const onClearFilters = () => {
  localFilters.admin1Id = ''
  localFilters.summaryTypeId = ''
  localFilters.minValue = ''
  localFilters.maxValue = ''
  emit('apply-filters', { ...localFilters })
}
</script>
