export interface GcashTransaction {
  id: number;
  type: 'cash_in' | 'cash_out' | 'load';
  user_id: number;
  amount: number;
  description: string;
  reference: string;
  phone_number: string;
  load_service?: 'tm' | 'globe' | 'dito' | 'smart' | 'tnt' |
    'esim' | 'sky' | 'smart_bro' | 'globe_at_home' |
    'cignal' | 'sky';
  status?: 'paid' | 'unpaid';
  created_at: Date;
  updated_at?: Date;
}

export interface GcashState {
  transactions: GcashTransaction[] | null;
  pagination: GcashPagination | null;
}

export interface ErrorResponse {
  message: string;
  errors: any;
  statusCode?: number;
  data?: any;
}

export interface GcashTransactionData {
  user_id: string;
  type: string;
  amount: number;
  status: string;
  reference: string;
  load_service: string;
  phone_number: string;
}

export interface GcashPagination {
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}