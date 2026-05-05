<template>
	<v-container class="py-8" max-width="1200">
		<v-row>
			<v-col cols="12">
				<h1 class="text-h4 font-weight-bold mb-4">Infection Data Explorer</h1>
			</v-col>
		</v-row>

		<v-row>
			<v-col cols="12">
				<InfectionSearchPanel :loading="loading" @search="onSearch" />
			</v-col>
		</v-row>

		<v-row v-if="errorMessage">
			<v-col cols="12">
				<v-alert type="error" variant="tonal">{{ errorMessage }}</v-alert>
			</v-col>
		</v-row>

		<v-row v-if="hasSearched">
			<v-col cols="12">
				<InfectionDataTable
					:records="records"
					:filters="filters"
					:loading="loading"
					:page="page"
					:page-size="pageSize"

					:total-items="totalItems"
					:sort-order="sortOrder"
					:can-sort-by-value="canSortByValue"
					@change-page="onChangePage"
					@change-page-size="onChangePageSize"
					@change-sort-order="onChangeSortOrder"
					@apply-filters="onApplyFilters"
				/>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import type {
	InfectionDataResponse,
	InfectionTableFilters,
	SearchPayload
} from '~/app/utils/infectionData'

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl as string

const records = ref<InfectionDataRecord[]>([])
const loading = ref(false)
const errorMessage = ref('')
const hasSearched = ref(false)

const searchPayload = ref<SearchPayload>({
	admin0Id: '',
	indicator: ''
})

const filters = ref<InfectionTableFilters>({
	admin1Id: '',
	summaryTypeId: '',
	minValue: '',
	maxValue: ''
})

const page = ref(1)
const pageSize = ref(20)
const totalItems = ref(0)
const sortOrder = ref<'ASC' | 'DESC'>('DESC')

const canSortByValue = computed(() => Boolean(filters.value.summaryTypeId.trim()))

const buildSearchParams = () => {
	const params = new URLSearchParams()
	params.set('admin0Id', searchPayload.value.admin0Id.trim())
	params.set('indicator', searchPayload.value.indicator.trim())
	params.set('page', String(page.value))
	params.set('pageSize', String(pageSize.value))

	if (filters.value.admin1Id.trim()) {
		params.set('admin1Id', filters.value.admin1Id.trim())
	}

	if (filters.value.summaryTypeId.trim()) {
		params.set('summaryTypeId', filters.value.summaryTypeId.trim())
		params.set('sortBy', 'value')
		params.set('sortOrder', sortOrder.value)

		if (filters.value.minValue.trim()) {
			params.set('minValue', filters.value.minValue.trim())
		}
		if (filters.value.maxValue.trim()) {
			params.set('maxValue', filters.value.maxValue.trim())
		}
	}

	return params
}

const fetchInfectionData = async () => {
	loading.value = true
	errorMessage.value = ''

	try {
		const response = await $fetch<InfectionDataResponse>(`${apiBaseUrl}/infection-data`, {
			query: Object.fromEntries(buildSearchParams())
		})

		records.value = response.data
		totalItems.value = response.pagination.totalItems
	} catch (error: any) {
		records.value = []
		totalItems.value = 0
		errorMessage.value = error?.data?.error || 'Failed to fetch infection data'
	} finally {
		loading.value = false
	}
}

const onSearch = async (payload: SearchPayload) => {
	searchPayload.value = payload
	filters.value = {
		admin1Id: '',
		summaryTypeId: '',
		minValue: '',
		maxValue: ''
	}
	sortOrder.value = 'DESC'
	page.value = 1
	hasSearched.value = true
	await fetchInfectionData()
}

const onApplyFilters = async (payload: InfectionTableFilters) => {
	filters.value = payload
	page.value = 1
	if (hasSearched.value) {
		await fetchInfectionData()
	}
}

const onChangePage = async (newPage: number) => {
	page.value = newPage
	if (hasSearched.value) {
		await fetchInfectionData()
	}
}

const onChangePageSize = async (newPageSize: number) => {
	pageSize.value = newPageSize
	page.value = 1
	if (hasSearched.value) {
		await fetchInfectionData()
	}
}

const onChangeSortOrder = async (order: 'ASC' | 'DESC') => {
	if (!canSortByValue.value || !hasSearched.value || sortOrder.value === order) {
		return
	}

	sortOrder.value = order
	page.value = 1
	await fetchInfectionData()
}
</script>
