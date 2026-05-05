
<template>
  <v-card variant="elevated" class="pa-4">
    <v-form @submit.prevent="onSubmit">
      <v-row>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="form.admin0Id"
            label="admin0Id"
            placeholder="e.g. AGO"
            variant="outlined"
            density="comfortable"
            hide-details
            :disabled="props.loading"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            v-model="form.indicator"
            label="indicatorId"
            placeholder="e.g. hospitalAdmissions"
            variant="outlined"
            density="comfortable"
            hide-details
            :disabled="props.loading"
          />
        </v-col>

        <v-col cols="12" md="6" class="d-flex justify-end">
          <v-btn
            type="submit"
            color="primary"
            size="large"
            :loading="props.loading"
            :disabled="isSearchDisabled"
          >
            Search
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import type { SearchPayload } from '~/app/utils/infectionData'

const props = defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  search: [SearchPayload]
}>()

const form = reactive({
  admin0Id: '',
  indicator: ''
})

const isSearchDisabled = computed(() => {
  return (
    props.loading ||
    !form.admin0Id.trim() ||
    !form.indicator.trim()
  )
})

const onSubmit = () => {
  emit('search', {
    admin0Id: form.admin0Id,
    indicator: form.indicator
  })
}
</script>
