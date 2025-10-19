"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Wallet, Smartphone, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

export type PaymentMethod = "credit-card" | "paypal" | "apple-pay" | "google-pay" | "bank-transfer"

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod
  onMethodChange: (method: PaymentMethod) => void
}

const paymentMethods = [
  {
    id: "credit-card" as PaymentMethod,
    name: "Credit / Debit Card",
    description: "Visa, Mastercard, Amex",
    icon: CreditCard,
    processingTime: "Instant",
  },
  // {
  //   id: "paypal" as PaymentMethod,
  //   name: "PayPal",
  //   description: "Pay with your PayPal account",
  //   icon: Wallet,
  //   processingTime: "Instant",
  // },
  // {
  //   id: "apple-pay" as PaymentMethod,
  //   name: "Apple Pay",
  //   description: "Pay with Apple Pay",
  //   icon: Smartphone,
  //   processingTime: "Instant",
  // },
  // {
  //   id: "google-pay" as PaymentMethod,
  //   name: "Google Pay",
  //   description: "Pay with Google Pay",
  //   icon: Smartphone,
  //   processingTime: "Instant",
  // },
  {
    id: "bank-transfer" as PaymentMethod,
    name: "Bank Transfer",
    description: "Direct bank transfer",
    icon: Building2,
    processingTime: "1-2 business days",
  },
]

export function PaymentMethodSelector({ selectedMethod, onMethodChange }: PaymentMethodSelectorProps) {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Wallet className="w-5 h-5 text-primary" />
        Select payment method
      </h2>

      <RadioGroup value={selectedMethod} onValueChange={(value) => onMethodChange(value as PaymentMethod)}>
        <div className="space-y-3">
          {paymentMethods.map((method, index) => {
            const Icon = method.icon
            const isSelected = selectedMethod === method.id

            return (
              <motion.label
                key={method.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  "flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                    : "border-border hover:border-primary/50 hover:bg-secondary/50",
                )}
              >
                <RadioGroupItem value={method.id} id={method.id} />
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                      isSelected ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{method.name}</div>
                    <div className="text-sm text-muted-foreground">{method.description}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{method.processingTime}</div>
                </div>
              </motion.label>
            )
          })}
        </div>
      </RadioGroup>

      <div className="mt-4 p-3 bg-secondary/50 rounded-lg border border-border/50">
        <p className="text-xs text-muted-foreground leading-relaxed">
          All payment methods are secured with industry-standard encryption. Your payment information is never stored on
          our servers.
        </p>
      </div>
    </Card>
  )
}
