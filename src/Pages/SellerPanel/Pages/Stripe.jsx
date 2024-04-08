import React from 'react'

const Stripe = () => {
  return (
    <div>    const url = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_PrkjXeCQLVZDhRrdWRFqlJKyBMVUP7Zn&scope=read_write`;
    </div>
  )
}

export default Stripe
// {
//  "id": "acct_1P22IlFb3WOjoUUM",
//  "object": "account",
//  "business_profile": {
//    "annual_revenue": null,
//    "estimated_worker_count": null,
//    "mcc": null,
//    "name": null,
//    "product_description": null,
//    "support_address": null,
//    "support_email": null,
//    "support_phone": null,
//    "support_url": null,
//    "url": null
//  },
//  "business_type": null,
//  "capabilities": {},
//  "charges_enabled": false,
//  "country": "US",
//  "created": 1712283288,
//  "default_currency": "usd",
//  "details_submitted": false,
//  "email": "hasnainqureshi7942@gmail.com",
//  "external_accounts": {
//    "object": "list",
//    "data": [],
//    "has_more": false,
//    "total_count": 0,
//    "url": "/v1/accounts/acct_1P22IlFb3WOjoUUM/external_accounts"
//  },
//  "future_requirements": {
//    "alternatives": [],
//    "current_deadline": null,
//    "currently_due": [],
//    "disabled_reason": null,
//    "errors": [],
//    "eventually_due": [],
//    "past_due": [],
//    "pending_verification": []
//  },
//  "login_links": {
//    "object": "list",
//    "data": [],
//    "has_more": false,
//    "total_count": 0,
//    "url": "/v1/accounts/acct_1P22IlFb3WOjoUUM/login_links"
//  },
//  "metadata": {},
//  "payouts_enabled": false,
//  "requirements": {
//    "alternatives": [],
//    "current_deadline": null,
//    "currently_due": [
//      "external_account",
//      "tos_acceptance.date",
//      "tos_acceptance.ip"
//    ],
//    "disabled_reason": "requirements.past_due",
//    "errors": [],
//    "eventually_due": [
//      "external_account",
//      "tos_acceptance.date",
//      "tos_acceptance.ip"
//    ],
//    "past_due": [
//      "external_account",
//      "tos_acceptance.date",
//      "tos_acceptance.ip"
//    ],
//    "pending_verification": []
//  },
//  "settings": {
//    "bacs_debit_payments": {
//      "display_name": null,
//      "service_user_number": null
//    },
//    "branding": {
//      "icon": null,
//      "logo": null,
//      "primary_color": null,
//      "secondary_color": null
//    },
//    "card_issuing": {
//      "tos_acceptance": {
//        "date": null,
//        "ip": null
//      }
//    },
//    "card_payments": {
//      "decline_on": {
//        "avs_failure": false,
//        "cvc_failure": false
//      },
//      "statement_descriptor_prefix": null,
//      "statement_descriptor_prefix_kana": null,
//      "statement_descriptor_prefix_kanji": null
//    },
//    "dashboard": {
//      "display_name": null,
//      "timezone": "Etc/UTC"
//    },
//    "invoices": {
//      "default_account_tax_ids": null
//    },
//    "payments": {
//      "statement_descriptor": null,
//      "statement_descriptor_kana": null,
//      "statement_descriptor_kanji": null
//    },
//    "payouts": {
//      "debit_negative_balances": true,
//      "schedule": {
//        "delay_days": 2,
//        "interval": "daily"
//      },
//      "statement_descriptor": null
//    },
//    "sepa_debit_payments": {}
//  },
//  "tos_acceptance": {
//    "date": null,
//    "ip": null,
//    "user_agent": null
//  },
//  "type": "express"
// }