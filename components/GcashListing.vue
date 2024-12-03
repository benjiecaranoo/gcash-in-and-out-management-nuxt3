import type { GcashTransaction } from '~/types/gcash-transaction'

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { usePagination } from '~/composables/usePagination'
import { useGcashStore } from '~/stores/gcash-transaction';
import useSnackbar from '@/composables/useSnackbar';
import { useVuelidate } from '@vuelidate/core'

const { fetchTransactions, deleteGcash, createGcash } = useGcashStore()
const { showSnackbar } = useSnackbar();
const transactionStore = useGcashStore()
const { validations } = useValidation()


// Table headers
const headers = [
  { title: 'Date', key: 'created_at' },
  { title: 'Type', key: 'type' },
  { title: 'Amount', key: 'amount' },
  { title: 'Phone Number', key: 'phone_number' },
  { title: 'Load Service', key: 'load_service' },
  { title: 'Reference #', key: 'reference' },
  { title: 'Status', key: 'status' },
  { title: 'Description', key: 'description' },
  { title: 'Actions', key: 'actions' },
]

// Initialize pagination
const {
  page,
  itemsPerPage,
  totalItems,
  loading,
  sortBy,
  paginationInfo
} = usePagination({
  itemsPerPage: 5,
  initialPage: 1
})

const search = ref('')
const transactions = computed(() => transactionStore.transactions)

// Methods
const fetchData = async () => {
  loading.value = true
  try {
    await fetchTransactions(itemsPerPage.value)
    
    loading.value = false
  } catch (error) {
    console.error('Error fetching data:', error)
    loading.value = false
  }
}

// Computed properties for filtered data
const filteredItems = computed(() => {
  let items = transactions.value

  if (search.value) {
    const searchTerm = search.value.toLowerCase()
    items = items.filter((item: GcashTransaction) => 
      item.reference.toLowerCase().includes(searchTerm) ||
      item.phone_number.includes(searchTerm)
    )
  }
  
  // Apply pagination
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return items ? items.slice(start, end) : []
})

// Modify modal state
const showFormModal = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const editingItem = ref<GcashTransaction | null>(null)
const formTitle = computed(() => formMode.value === 'add' ? 'Add Transaction' : 'Edit Transaction')

// Initialize form with empty values
const initialFormState = {
  type: 'cash_in' as 'cash_in' | 'cash_out' | 'load',
  amount: 0,
  description: '',
  phone_number: '',
  reference: '',
  status: 'unpaid' as 'paid' | 'unpaid',
  load_service: undefined as 
    'tm' | 'globe' | 'dito' | 'smart' | 'tnt' |
    'esim' | 'sky' | 'smart_bro' | 'globe_at_home' |
    'cignal' | 'sky' | undefined
}

const editForm = ref({ ...initialFormState })

// Transaction types for select input
const transactionTypes = [
  { title: 'Cash In', value: 'cash_in' },
  { title: 'Cash Out', value: 'cash_out' },
  { title: 'Load', value: 'load' }
]

// Load service types
const loadServiceTypes = [
  { title: 'TM', value: 'tm' },
  { title: 'Globe', value: 'globe' },
  { title: 'DITO', value: 'dito' },
  { title: 'Smart', value: 'smart' },
  { title: 'TNT', value: 'tnt' },
  { title: 'ESIM', value: 'esim' },
  { title: 'Others', value: 'others'}
]

// Form validation rules
const rules = {
  amount: {
    required: validations.required('Amount'),
    minAmount: validations.minAmount(1),
    number: validations.number
  },
  phone_number: {
    required: validations.required('Phone number'),
    phone: validations.phone
  },
  description: {
    required: validations.required('Description')
  },
  reference: {
    required: validations.required('Reference number')
  },
  type: {
    required: validations.required('Transaction type')
  },
  status: {
    required: validations.required('Transaction status')
  }
}

const handleAdd = () => {
  formMode.value = 'add'
  editingItem.value = null
  editForm.value = { ...initialFormState }
  showFormModal.value = true
}

const handleEdit = (item: GcashTransaction) => {
  formMode.value = 'edit'
  editingItem.value = item
  editForm.value = {
    type: item.type,
    amount: item.amount,
    description: item.description,
    phone_number: item.phone_number,
    reference: item.reference,
    status: item.status,
    load_service: item.load_service
  }
  showFormModal.value = true
}

const errorFields = ref();
const v$ = useVuelidate(rules, editForm, { $autoDirty: true })

const errors = computed<Record<string, string | undefined>>(() => {
  return Object.keys(editForm.value).reduce((prev, curr) => {
    prev[curr] = v$.value[curr]?.$errors[0]?.$message || errorFields.value?.[curr]?.[0];
    return prev
  }, {} as Record<string, string | undefined>)
})


const handleSubmit = async () => {
  if (!(await v$.value.$validate())) return

  loading.value = true
  try {
    // Validate load service if type is LOAD
    if (editForm.value.type === 'load' && !editForm.value.load_service) {
      errorFields.value = {
        load_service: ['Load service provider is required.']
      }
      return
    }

    if (formMode.value === 'add') {
      const newTransaction: GcashTransaction = {
        id: Math.max(...transactions.value.map(t => t.id)) + 1,
        created_at: new Date().toISOString(),
        ...editForm.value,
        type: editForm.value.type as 'cash_in' | 'cash_out' | 'load',
        load_service: editForm.value.type === 'load' ? editForm.value.load_service : undefined
      }

      await createGcash(newTransaction);
    } else {
      const index = transactionStore.transactions.findIndex(item => item.id === editingItem.value?.id)
      if (index !== -1) {
        transactionStore.transactions[index] = {
          ...transactionStore.transactions[index],
          ...editForm.value,
          type: editForm.value.type as 'cash_in' | 'cash_out' | 'load',
          load_service: editForm.value.type === 'load' ? editForm.value.load_service : undefined
        }
      }
    }
    
    showFormModal.value = false
    editingItem.value = null
    editForm.value = { ...initialFormState }
    
  } catch (error) {
    console.error(error)
    errorFields.value = error.errors;
  } finally {
    loading.value = false
  }
}


const cancelForm = () => {
  showFormModal.value = false
  editingItem.value = null
  editForm.value = { ...initialFormState }
}

// Add these refs for delete confirmation modal
const showDeleteModal = ref(false)
const itemToDelete = ref<GcashTransaction | null>(null)

const handleDelete = async (item: GcashTransaction) => {
  itemToDelete.value = item
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return

  loading.value = true
  try {
    await deleteGcash(itemToDelete.value.id)
    
    // Remove item from local state
    transactionStore.transactions = transactionStore.transactions.filter(
      (item: GcashTransaction) => item.id !== itemToDelete.value?.id
    )

    await fetchData();
    
    // Close modal and reset
    showDeleteModal.value = false
    itemToDelete.value = null
    
    showSnackbar({
      text: 'Transaction successfully deleted.',
      state: 'success',
    });
  } catch (error) {
    console.error('Error deleting item:', error)
    showSnackbar({
      text: 'Error deleting item: ' + error.message,
      state: 'error'
    })
  } finally {
    loading.value = false
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  itemToDelete.value = null
}

// Watch for changes that should trigger a data refresh
watch([page, itemsPerPage, sortBy], () => {
  fetchData()
})

// // Initial data fetch
onMounted(async () => {
  await fetchData()
})

// Add computed property for showing load service field
const showLoadService = computed(() => editForm.value.type === 'load')

// Watch for type changes to handle load service
watch(() => editForm.value.type, (newType) => {
  if (newType !== 'load') {
    editForm.value.load_service = undefined
  }
})

// Add these helper functions
const getTypeColor = (type: GcashTransaction['type']) => {
  switch (type) {
    case 'cash_in':
      return 'success'
    case 'cash_out':
      return 'error'
    case 'LOAD':
      return 'info'
    default:
      return 'grey'
  }
}

const getTextColor = (type: GcashTransaction['type']) => {
  switch (type) {
    case 'cash_in':
      return 'text-success'
    case 'cash_out':
      return 'text-error'
    case 'LOAD':
      return 'text-info'
    default:
      return ''
  }
}
</script>

<template>
  <div>
    <v-card class="mb-4" elevation="0">
      <v-card-title class="d-flex align-center py-3 px-4">
        <span class="text-h5 font-weight-bold">Manage GCASH Transactions</span>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          class="mr-2"
          @click="handleAdd"
        >
          Add Transaction
        </v-btn>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          density="compact"
          class="max-width-200"
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :search="search"
        :loading="loading"
        :page="page"
        :items-per-page="itemsPerPage"
        @update:page="page = $event"
        @update:items-per-page="itemsPerPage = $event"
        class="elevation-1"
      >
        <template v-slot:item.type="{ item }">
          <v-chip
            :color="getTypeColor(item.type)"
            size="small"
          >
            {{ item.type }}
          </v-chip>
        </template>

        <template v-slot:item.amount="{ item }">
          <span :class="getTextColor(item.type)">
            ₱{{ item.amount.toLocaleString() }}
          </span>
        </template>

        <template v-slot:item.created_at="{ item }">
          <span :class="getTextColor(item.type)">
            {{ new Date(item.created_at).toLocaleDateString() }}
          </span>
        </template>

        <template v-slot:item.phone_number="{ item }">
          <v-chip
            variant="outlined"
            size="small"
            :color="getTypeColor(item.type)"
          >
            {{ item.phone_number }}
          </v-chip>
        </template>

        <template v-slot:item.load_service="{ item }">
          <v-chip
            v-if="item.type === 'load' && item.load_service"
            size="small"
            :color="getTypeColor(item.type)"
            variant="outlined"
          >
            {{ item.load_service }}
          </v-chip>
          <span v-else :class="getTextColor(item.type)">-</span>
        </template>

        <template v-slot:item.reference="{ item }">
          <span :class="getTextColor(item.type)">
            {{ item.reference }}
          </span>
        </template>

        <template v-slot:item.description="{ item }">
          <span :class="getTextColor(item.type)">
            {{ item.description }}
          </span>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            size="small"
            :color="getTypeColor(item.type)"
            class="mr-2"
            @click="handleEdit(item)"
          ></v-btn>
          <v-btn
            icon="mdi-delete"
            size="small"
            color="error"
            @click="handleDelete(item)"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Delete Confirmation Modal -->
    <v-dialog v-model="showDeleteModal" max-width="500px">
      <v-card>
        <v-card-title class="text-h5 bg-error text-white">
          Confirm Delete
        </v-card-title>
        
        <v-card-text class="pt-4">
          <p>Are you sure you want to delete this transaction?</p>
          <v-list v-if="itemToDelete" density="compact">
            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-calendar" class="mr-2" />
              </template>
              <v-list-item-title>
                {{ new Date(itemToDelete.created_at).toLocaleDateString() }}
              </v-list-item-title>
            </v-list-item>
            
            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-phone" class="mr-2" />
              </template>
              <v-list-item-title>
                {{ itemToDelete.phone_number }}
              </v-list-item-title>
            </v-list-item>
            
            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-cash" class="mr-2" />
              </template>
              <v-list-item-title>
                ₱{{ itemToDelete.amount.toLocaleString() }}
              </v-list-item-title>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-text" class="mr-2" />
              </template>
              <v-list-item-title>
                {{ itemToDelete.status }}
              </v-list-item-title>
            </v-list-item>
            
            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-text" class="mr-2" />
              </template>
              <v-list-item-title>
                {{ itemToDelete.description }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="cancelDelete"
            :disabled="loading"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            @click="confirmDelete"
            :loading="loading"
            :disabled="loading"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modified Form Modal -->
    <v-dialog v-model="showFormModal" max-width="600px">
      <v-card>
        <v-card-title class="text-h5 bg-primary text-white">
          {{ formTitle }}
        </v-card-title>
        
        <v-card-text class="pt-4">
          <v-form @submit.prevent="handleSubmit">
            <v-container>
              <v-row>
                <v-col cols="12" :md="showLoadService ? 6 : 6">
                  <v-select
                    v-model="editForm.type"
                    :items="transactionTypes"
                    item-title="title"
                    item-value="value"
                    label="Transaction Type"
                    :error-messages="errors.type"
                    required
                  ></v-select>
                </v-col>

                <!-- Load Service Selection -->
                <v-col v-if="showLoadService" cols="12" md="6">
                  <v-select
                    v-model="editForm.load_service"
                    :items="loadServiceTypes"
                    item-title="title"
                    item-value="value"
                    label="Load Service Provider"
                    :error-messages="errors.load_service"
                    required
                  ></v-select>
                </v-col>

                <v-col cols="12" :md="showLoadService ? 12 : 6">
                  <v-text-field
                    v-model.number="editForm.amount"
                    label="Amount"
                    prefix="₱"
                    type="number"
                    required
                    :error-messages="errors.amount"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editForm.phone_number"
                    label="Phone Number"
                    :error-messages="errors.phone_number"
                    required
                    placeholder="09123456789"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editForm.reference"
                    label="Reference Number"
                    required
                    :error-messages="errors.reference"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-select
                    v-model="editForm.status"
                    :items="['paid', 'unpaid']"
                    label="Status"
                    :error-messages="errors.status"
                    required
                  ></v-select>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="editForm.description"
                    label="Description"
                    :error-messages="errors.description"
                    required
                    rows="3"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="cancelForm"
            :disabled="loading"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="handleSubmit"
            :loading="loading"
            :disabled="loading"
          >
            {{ formMode === 'add' ? 'Add' : 'Save Changes' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.v-card-title {
  display: flex;
  align-items: center;
  padding: 16px;
}

.v-dialog .v-card-title {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

/* Optional: Add some spacing between form fields */
.v-col {
  padding-top: 8px;
  padding-bottom: 8px;
}

/* Add text color classes */
.text-success {
  color: rgb(var(--v-theme-success)) !important;
}

.text-error {
  color: rgb(var(--v-theme-error)) !important;
}

.text-info {
  color: rgb(var(--v-theme-info)) !important;
}

.max-width-200 {
  max-width: 200px;
}

/* Update card styles for better contrast */
:deep(.v-card) {
  border-radius: 12px;
}

:deep(.v-data-table) {
  border-radius: 8px;
  overflow: hidden;
}

/* Optional: Add hover effect to table rows */
:deep(.v-data-table-row:hover) {
  background-color: rgba(var(--v-theme-primary), 0.05);
}
</style> 