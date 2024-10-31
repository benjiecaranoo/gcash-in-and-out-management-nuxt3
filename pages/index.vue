<script setup lang="ts">
import { ref, computed } from 'vue'
import { mdiCashPlus, mdiCashMinus, mdiCellphone } from '@mdi/js'

definePageMeta({
  middleware: ['auth']
})

// Mock data - replace with actual API data
const transactions = ref([
  { id: 1, type: 'CASH_IN', amount: 5000, created_at: '2024-03-15' },
  { id: 2, type: 'CASH_OUT', amount: 2000, created_at: '2024-03-16' },
  { id: 3, type: 'LOAD', amount: 1000, created_at: '2024-03-17' },
  // ... more transactions
])

// Computed statistics
const statistics = computed(() => {
  const today = new Date()
  const thisMonth = today.getMonth()
  const thisYear = today.getFullYear()

  const monthlyTransactions = transactions.value.filter(t => {
    const date = new Date(t.created_at)
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear
  })

  return {
    totalCashIn: monthlyTransactions
      .filter(t => t.type === 'CASH_IN')
      .reduce((sum, t) => sum + t.amount, 0),
    totalCashOut: monthlyTransactions
      .filter(t => t.type === 'CASH_OUT')
      .reduce((sum, t) => sum + t.amount, 0),
    totalLoad: monthlyTransactions
      .filter(t => t.type === 'LOAD')
      .reduce((sum, t) => sum + t.amount, 0)
  }
})

// Card configurations - removed current balance card
const dashboardCards = computed(() => [
  {
    title: 'Total Cash In',
    amount: statistics.value.totalCashIn,
    icon: mdiCashPlus,
    color: 'success',
    trend: '+12.5%',
    subtitle: 'This Month'
  },
  {
    title: 'Total Cash Out',
    amount: statistics.value.totalCashOut,
    icon: mdiCashMinus,
    color: 'error',
    trend: '-5.2%',
    subtitle: 'This Month'
  },
  {
    title: 'Total Load',
    amount: statistics.value.totalLoad,
    icon: mdiCellphone,
    color: 'info',
    trend: '+8.1%',
    subtitle: 'This Month'
  }
])

// Recent transactions for the chart
const recentTransactions = computed(() => {
  return transactions.value.slice(-7).map(t => ({
    date: new Date(t.created_at).toLocaleDateString(),
    amount: t.amount,
    type: t.type
  }))
})
</script>

<template>
  <div class="app-background-animated">
    <v-container class="py-8">
      <!-- Statistics Cards -->
      <v-row justify="center">
        <v-col
          v-for="card in dashboardCards"
          :key="card.title"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            class="mx-auto stat-card"
            :class="`border-${card.color}`"
            elevation="0"
          >
            <div class="card-background" :class="`bg-${card.color}`"></div>
            <v-card-text class="position-relative">
              <div class="d-flex justify-space-between align-center mb-4">
                <div>
                  <div class="text-subtitle-1 font-weight-medium text-medium-emphasis">
                    {{ card.title }}
                  </div>
                  <div class="text-h3 font-weight-bold mt-2">
                    ₱{{ card.amount.toLocaleString() }}
                  </div>
                </div>
                <v-avatar
                  :color="`${card.color}`"
                  size="56"
                  class="stat-icon-wrapper elevation-1"
                >
                  <v-icon
                    :icon="card.icon"
                    size="32"
                    color="white"
                    class="stat-icon"
                  />
                </v-avatar>
              </div>
              
              <div class="d-flex align-center mt-4">
                <span class="text-body-2 text-medium-emphasis">
                  {{ card.subtitle }}
                </span>
                <v-chip
                  :color="card.trend.startsWith('+') ? 'success' : 'error'"
                  size="small"
                  class="ml-2"
                  variant="tonal"
                >
                  <v-icon
                    :icon="card.trend.startsWith('+') ? 'mdi-trending-up' : 'mdi-trending-down'"
                    start
                    size="small"
                  />
                  {{ card.trend }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts Row -->
      <v-row class="mt-6">
        <v-col cols="12" md="8">
          <v-card class="chart-card" elevation="0">
            <v-card-title class="text-h6 font-weight-bold px-6 pt-6">
              Transaction History
              <v-chip color="primary" size="small" class="ml-2" variant="tonal">
                Last 7 Days
              </v-chip>
            </v-card-title>
            <v-card-text>
              <v-chart class="chart" :option="chartOption" autoresize />
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="activity-card" elevation="0">
            <v-card-title class="text-h6 font-weight-bold px-6 pt-6">
              Recent Activities
              <v-chip color="primary" size="small" class="ml-2" variant="tonal">
                Live
              </v-chip>
            </v-card-title>
            <v-list lines="two" class="py-0">
              <v-list-item
                v-for="(transaction, i) in recentTransactions"
                :key="i"
                :title="`₱${transaction.amount.toLocaleString()}`"
                :subtitle="transaction.date"
                class="activity-item"
              >
                <template v-slot:prepend>
                  <v-avatar
                    :color="transaction.type === 'CASH_IN' ? 'success' : transaction.type === 'LOAD' ? 'info' : 'error'"
                    size="40"
                    class="elevation-1"
                  >
                    <v-icon
                      :icon="transaction.type === 'CASH_IN' ? mdiCashPlus : transaction.type === 'LOAD' ? mdiCellphone : mdiCashMinus"
                      color="white"
                      size="24"
                    />
                  </v-avatar>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.stat-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border-radius: 16px !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
}

.card-background {
  position: absolute;
  top: 0;
  right: 0;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  opacity: 0.1;
  transform: translate(30%, -30%);
  transition: all 0.3s ease;
}

.stat-card:hover .card-background {
  transform: translate(25%, -25%) scale(1.1);
}

.bg-primary { background-color: rgb(var(--v-theme-primary)); }
.bg-success { background-color: rgb(var(--v-theme-success)); }
.bg-error { background-color: rgb(var(--v-theme-error)); }
.bg-info { background-color: rgb(var(--v-theme-info)); }

.stat-icon-wrapper {
  transition: all 0.3s ease;
}

.stat-card:hover .stat-icon-wrapper {
  transform: scale(1.1);
}

.stat-icon {
  transition: all 0.3s ease;
}

.position-relative {
  position: relative;
}

.chart-card, .activity-card {
  border-radius: 16px !important;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
}

.chart-card:hover, .activity-card:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
}

.chart {
  height: 400px;
  padding: 16px;
}

.activity-item {
  transition: background-color 0.2s ease;
  border-radius: 8px;
  margin: 4px 8px;
}

.activity-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

/* Custom scrollbar for the activity list */
:deep(.v-list) {
  overflow-y: auto;
  max-height: 400px;
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--v-theme-primary), 0.2) transparent;
}

:deep(.v-list::-webkit-scrollbar) {
  width: 6px;
}

:deep(.v-list::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.v-list::-webkit-scrollbar-thumb) {
  background-color: rgba(var(--v-theme-primary), 0.2);
  border-radius: 3px;
}

/* Smooth font rendering */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
