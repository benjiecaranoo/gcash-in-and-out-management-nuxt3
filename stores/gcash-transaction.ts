import  { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'
import type { GcashTransaction, GcashTransactionData, ErrorResponse } from '@/types/gcash-transaction'

export const useGcashStore = defineStore('gcash', {
  state: (): GcashState => ({
    transactions: null,
    pagination: null,
  }),
  actions: {
    async createGcash(formData: GcashTransactionData): Promise<void> {
      console.log(formData)
      const { error, data } = await useApi('/auth/transactions', {
        method: 'POST',
        body: formData,
      })

      if (error.value) {
        console.log(error)
        const errorResponse = error.value as ErrorResponse;
        if(errorResponse.statusCode === 401) {
          throw errorResponse;
        }
        throw errorResponse;
      }
      // console.log('test')
      console.log(data.value)
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

