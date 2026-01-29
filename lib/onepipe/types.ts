export interface OnePipeInvoiceRequest {
    request_ref: string
    request_type: "send invoice"
    auth: {
        type: string | null
        secure: string | null
        auth_provider: "PaywithAccount"
    }
    transaction: {
        mock_mode: "Live"
        transaction_ref: string
        transaction_desc: string
        transaction_ref_parent: null
        amount: number // kobo
        customer: {
            customer_ref: string
            firstname: string
            surname: string
            email: string
            mobile_no: string
        }
        meta: {
            type: "single_payment"
            expires_in: number
            skip_messaging: boolean
            biller_code: string
        }
        details: Record<string, any>
    }
}