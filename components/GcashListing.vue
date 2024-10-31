<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { usePagination } from '~/composables/usePagination'

interface GcashTransaction {
  id: number
  type: 'CASH_IN' | 'CASH_OUT' | 'LOAD'
  amount: number
  description: string
  created_at: string
  reference_number: string
  phone_number: string
  load_service?: 'TM' | 'GLOBE' | 'DITO' | 'SMART' | 'TNT' | 'ESIM'
}

// Table headers
const headers = [
  { title: 'Date', key: 'created_at' },
  { title: 'Type', key: 'type' },
  { title: 'Amount', key: 'amount' },
  { title: 'Phone Number', key: 'phone_number' },
  { title: 'Load Service', key: 'load_service' },
  { title: 'Reference #', key: 'reference_number' },
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
  itemsPerPage: 10,
  initialPage: 1
})

const search = ref('')

// Mock data - replace this with actual API call
const transactions = ref<GcashTransaction[]>([
  {
    id: 1,
    type: 'CASH_IN',
    amount: 1000,
    description: 'Load from bank',
    created_at: '2024-03-15',
    reference_number: 'REF123456',
    phone_number: '09123456789'
  },
  {
    id: 2,
    type: 'CASH_OUT',
    amount: 500,
    description: 'Payment for services',
    created_at: '2024-03-16',
    reference_number: 'REF789012',
    phone_number: '09187654321'
  },
  {
    id: 3,
    type: 'LOAD',
    amount: 2000,
    description: 'Load GLOBE',
    created_at: '2024-03-17',
    reference_number: 'REF345678',
    phone_number: '09198765432',
    load_service: 'GLOBE'
  }
])

// Computed properties for filtered data
const filteredItems = computed(() => {
  let items = [...transactions.value]
  
  if (search.value) {
    const searchTerm = search.value.toLowerCase()
    items = items.filter(item => 
      item.description.toLowerCase().includes(searchTerm) ||
      item.reference_number.toLowerCase().includes(searchTerm) ||
      item.phone_number.includes(searchTerm)
    )
  }
  
  // Update total items for pagination
  totalItems.value = items.length
  
  // Apply pagination
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return items.slice(start, end)
})

// Methods
const fetchData = async () => {
  loading.value = true
  try {
    // In real implementation, this would be an API call with pagination params
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
    
    // You would typically get these values from the API response
    // totalItems.value = response.total
    // transactions.value = response.data
    
    loading.value = false
  } catch (error) {
    console.error('Error fetching data:', error)
    loading.value = false
  }
}

// Modify modal state
const showFormModal = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const editingItem = ref<GcashTransaction | null>(null)
const formTitle = computed(() => formMode.value === 'add' ? 'Add Transaction' : 'Edit Transaction')

// Initialize form with empty values
const initialFormState = {
  type: 'CASH_IN' as 'CASH_IN' | 'CASH_OUT' | 'LOAD',
  amount: 0,
  description: '',
  phone_number: '',
  reference_number: '',
  load_service: undefined as 'TM' | 'GLOBE' | 'DITO' | 'SMART' | 'TNT' | 'ESIM' | undefined
}

const editForm = ref({ ...initialFormState })

// Transaction types for select input
const transactionTypes = [
  { title: 'Cash In', value: 'CASH_IN' },
  { title: 'Cash Out', value: 'CASH_OUT' },
  { title: 'Load', value: 'LOAD' }
]

// Load service types
const loadServiceTypes = [
  { title: 'TM', value: 'TM' },
  { title: 'Globe', value: 'GLOBE' },
  { title: 'DITO', value: 'DITO' },
  { title: 'Smart', value: 'SMART' },
  { title: 'TNT', value: 'TNT' },
  { title: 'ESIM', value: 'ESIM' }
]

// Form validation rules
const rules = {
  required: (v: any) => !!v || 'This field is required',
  number: (v: any) => !isNaN(v) || 'Must be a number',
  phone: (v: string) => /^09\d{9}$/.test(v) || 'Must be a valid phone number (e.g., 09123456789)',
  minAmount: (v: number) => v > 0 || 'Amount must be greater than 0'
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
    reference_number: item.reference_number,
    load_service: item.load_service
  }
  showFormModal.value = true
}

const handleSubmit = async () => {
  loading.value = true
  try {
    // Validate load service if type is LOAD
    if (editForm.value.type === 'LOAD' && !editForm.value.load_service) {
      alert('Please select a load service')
      return
    }

    if (formMode.value === 'add') {
      const newTransaction: GcashTransaction = {
        id: Math.max(...transactions.value.map(t => t.id)) + 1,
        created_at: new Date().toISOString(),
        ...editForm.value,
        type: editForm.value.type as 'CASH_IN' | 'CASH_OUT' | 'LOAD',
        load_service: editForm.value.type === 'LOAD' ? editForm.value.load_service : undefined
      }
      transactions.value.unshift(newTransaction)
    } else {
      const index = transactions.value.findIndex(item => item.id === editingItem.value?.id)
      if (index !== -1) {
        transactions.value[index] = {
          ...transactions.value[index],
          ...editForm.value,
          type: editForm.value.type as 'CASH_IN' | 'CASH_OUT' | 'LOAD',
          load_service: editForm.value.type === 'LOAD' ? editForm.value.load_service : undefined
        }
      }
    }
    
    showFormModal.value = false
    editingItem.value = null
    editForm.value = { ...initialFormState }
    
  } catch (error) {
    console.error('Error saving item:', error)
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
    // Here you would make the API call to delete the item
    console.log('Deleting item:', itemToDelete.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Remove item from local state
    transactions.value = transactions.value.filter(
      item => item.id !== itemToDelete.value?.id
    )
    
    // Close modal and reset
    showDeleteModal.value = false
    itemToDelete.value = null
    
    // Optional: Show success message
    // You might want to add a toast/snackbar notification system
  } catch (error) {
    console.error('Error deleting item:', error)
    // Optional: Show error message
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

// Initial data fetch
onMounted(() => {
  fetchData()
})

// Add computed property for showing load service field
const showLoadService = computed(() => editForm.value.type === 'LOAD')

// Watch for type changes to handle load service
watch(() => editForm.value.type, (newType) => {
  if (newType !== 'LOAD') {
    editForm.value.load_service = undefined
  }
})

// Add these helper functions
const getTypeColor = (type: GcashTransaction['type']) => {
  switch (type) {
    case 'CASH_IN':
      return 'success'
    case 'CASH_OUT':
      return 'error'
    case 'LOAD':
      return 'info'
    default:
      return 'grey'
  }
}

const getTextColor = (type: GcashTransaction['type']) => {
  switch (type) {
    case 'CASH_IN':
      return 'text-success'
    case 'CASH_OUT':
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
    <v-card>
      <v-card-title>
        Manage GCASH Transactions
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
            v-if="item.type === 'LOAD' && item.load_service"
            size="small"
            :color="getTypeColor(item.type)"
            variant="outlined"
          >
            {{ item.load_service }}
          </v-chip>
          <span v-else :class="getTextColor(item.type)">-</span>
        </template>

        <template v-slot:item.reference_number="{ item }">
          <span :class="getTextColor(item.type)">
            {{ item.reference_number }}
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
                    :rules="[rules.required]"
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
                    :rules="[rules.required]"
                    required
                  ></v-select>
                </v-col>

                <v-col cols="12" :md="showLoadService ? 12 : 6">
                  <v-text-field
                    v-model.number="editForm.amount"
                    label="Amount"
                    prefix="₱"
                    type="number"
                    :rules="[rules.required, rules.number, rules.minAmount]"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editForm.phone_number"
                    label="Phone Number"
                    :rules="[rules.required, rules.phone]"
                    required
                    placeholder="09123456789"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editForm.reference_number"
                    label="Reference Number"
                    :rules="[rules.required]"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="editForm.description"
                    label="Description"
                    :rules="[rules.required]"
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
</style> 