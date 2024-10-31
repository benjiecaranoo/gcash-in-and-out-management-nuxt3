import { ref, computed } from 'vue'

export interface PaginationOptions {
  itemsPerPage?: number
  initialPage?: number
}

export interface PaginationInfo {
  page: number
  itemsPerPage: number
  totalItems: number
}

export function usePagination(options: PaginationOptions = {}) {
  const page = ref(options.initialPage || 1)
  const itemsPerPage = ref(options.itemsPerPage || 10)
  const totalItems = ref(0)
  const loading = ref(false)
  const sortBy = ref([])

  const pageCount = computed(() => {
    return Math.ceil(totalItems.value / itemsPerPage.value)
  })

  const paginationInfo = computed((): PaginationInfo => ({
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    totalItems: totalItems.value
  }))

  const setTotalItems = (total: number) => {
    totalItems.value = total
  }

  const setLoading = (state: boolean) => {
    loading.value = state
  }

  return {
    // Reactive refs
    page,
    itemsPerPage,
    totalItems,
    loading,
    sortBy,
    
    // Computed
    pageCount,
    paginationInfo,
    
    // Methods
    setTotalItems,
    setLoading
  }
} 