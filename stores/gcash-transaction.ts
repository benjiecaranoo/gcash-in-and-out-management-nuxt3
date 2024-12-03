import  { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'
import type { GcashTransaction, GcashTransactionData, ErrorResponse } from '@/types/gcash-transaction'
import ApiErrorResponse from '~/types/ApiErrorResponse';

export const useGcashStore = defineStore('gcash', {
  state: (): GcashState => ({
    transactions: null,
    pagination: null,
  }),
  actions: {
    async createGcash(formData: GcashTransactionData): Promise<void> {
      const { error, data } = await useApi('/auth/transactions', {
        method: 'POST',
        body: formData,
      })

      if (error.value) {
        throw new ApiErrorResponse(error.value.data)
      }

      if(data.value) {
        this.transactions.unshift(data.value.data)
      }
    },

    // async getGcash(id: string): Promise<void> {
    //   const { data, error } = await useApi(`/auth/transactions/${id}`, {
    //     method: 'GET',
    //   })

    //   if(data.value) {
    //     this.gcash = data.value.data as Gcash
    //   }
    // },

    // async updateGcash(id: string, data: GcashData): Promise<void> {

    //   const { error } = await useApi(`/auth/transactions/${id}`, {
    //     method: 'PUT',
    //     body: data,
    //   })
    // },

    async deleteGcash(id: string): Promise<void> {
      console.log(id)
      const { status, error } = await useApi(`/auth/transactions/${id}`, {
        method: 'DELETE',
      })

      if(error) {
        throw new Error('Failed to delete Gcash transaction')
      }
    },

    async fetchTransactions(perPage: number): Promise<void> {
      const { data, error } = await useApi('/auth/transactions', {
        method: 'GET',
        params: {
          per_page: perPage
        }
      })

      if(data) {
        this.transactions = data.value.data as GcashTransaction[];
        
        if (data.value.meta) {
          this.pagination = data.value.meta;
          if (this.pagination) {
            this.pagination.links = data.value.links;
          }
        }
      }
    },
  },
})

