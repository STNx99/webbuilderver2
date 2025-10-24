"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Lock, Mail, User, Wallet, Smartphone, Building2 } from "lucide-react"
import type { Plan, BillingPeriod } from "./SubscriptionCheckout"
import type { PaymentMethod } from "./PaymentMethod"

interface CheckoutFormProps {
  selectedPlan: Plan
  billingPeriod: BillingPeriod
  paymentMethod: PaymentMethod
  onBillingPeriodChange: (period: BillingPeriod) => void
  onSubmit: (data: any) => void
}

export function CheckoutForm({  paymentMethod, onSubmit }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    accountNumber: "",
    routingNumber: "",
    acceptTerms: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    const newErrors: Record<string, string> = {}
    
    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.acceptTerms) newErrors.acceptTerms = "You must accept the terms"
    
    // Payment method specific validation
    if (paymentMethod === "credit-card") {
      if (!formData.cardNumber) newErrors.cardNumber = "Card number is required"
      if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required"
      if (!formData.cvv) newErrors.cvv = "CVV is required"
      if (!formData.cardholderName) newErrors.cardholderName = "Cardholder name is required"
    } else if (paymentMethod === "bank-transfer") {
      if (!formData.accountNumber) newErrors.accountNumber = "Account number is required"
      if (!formData.routingNumber) newErrors.routingNumber = "Routing number is required"
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    console.log("[Checkout] Processing payment...", { formData, paymentMethod })
    onSubmit(formData)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case "credit-card":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card className="p-4 sm:p-6 bg-card/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Card details
                </h2>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  <span>Secure</span>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="cardNumber" className="text-xs sm:text-sm font-medium">
                    Card number
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                      maxLength={19}
                      className="pr-10 h-9 sm:h-10 text-sm sm:text-base"
                    />
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  </div>
                  {errors.cardNumber && (
                    <p className="text-xs text-destructive mt-1">{errors.cardNumber}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="expiryDate" className="text-xs sm:text-sm font-medium">
                      Expiry date
                    </Label>
                    <Input
                      id="expiryDate"
                      type="text"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                      maxLength={5}
                      className="mt-1.5 h-9 sm:h-10 text-sm sm:text-base"
                    />
                    {errors.expiryDate && (
                      <p className="text-xs text-destructive mt-1">{errors.expiryDate}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="text-xs sm:text-sm font-medium">
                      CVV
                    </Label>
                    <Input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange("cvv", e.target.value)}
                      maxLength={4}
                      className="mt-1.5 h-9 sm:h-10 text-sm sm:text-base"
                    />
                    {errors.cvv && (
                      <p className="text-xs text-destructive mt-1">{errors.cvv}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="cardholderName" className="text-xs sm:text-sm font-medium">
                    Cardholder name
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="cardholderName"
                      type="text"
                      placeholder="John Doe"
                      value={formData.cardholderName}
                      onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                      className="pl-9 sm:pl-10 h-9 sm:h-10 text-sm sm:text-base"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                  </div>
                  {errors.cardholderName && (
                    <p className="text-xs text-destructive mt-1">{errors.cardholderName}</p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )

      case "paypal":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card className="p-4 sm:p-6 bg-card/50 backdrop-blur-sm">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                PayPal payment
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="p-4 sm:p-6 bg-secondary/50 rounded-lg border border-border text-center">
                  <Wallet className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-2 sm:mb-3" />
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                    You will be redirected to PayPal to complete your payment securely.
                  </p>
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
                    <Lock className="w-3 h-3" />
                    <span>Secured by PayPal</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )

      case "apple-pay":
      case "google-pay":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card className="p-4 sm:p-6 bg-card/50 backdrop-blur-sm">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                {paymentMethod === "apple-pay" ? "Apple Pay" : "Google Pay"}
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="p-4 sm:p-6 bg-secondary/50 rounded-lg border border-border text-center">
                  <Smartphone className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-2 sm:mb-3" />
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                    Click the button below to complete your payment with{" "}
                    {paymentMethod === "apple-pay" ? "Apple Pay" : "Google Pay"}.
                  </p>
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
                    <Lock className="w-3 h-3" />
                    <span>Secured by {paymentMethod === "apple-pay" ? "Apple" : "Google"}</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )

      case "bank-transfer":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card className="p-4 sm:p-6 bg-card/50 backdrop-blur-sm">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Bank transfer details
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="accountNumber" className="text-xs sm:text-sm font-medium">
                    Account number
                  </Label>
                  <Input
                    id="accountNumber"
                    type="text"
                    placeholder="Enter account number"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                    className="mt-1.5 h-9 sm:h-10 text-sm sm:text-base"
                  />
                  {errors.accountNumber && (
                    <p className="text-xs text-destructive mt-1">{errors.accountNumber}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="routingNumber" className="text-xs sm:text-sm font-medium">
                    Routing number
                  </Label>
                  <Input
                    id="routingNumber"
                    type="text"
                    placeholder="Enter routing number"
                    value={formData.routingNumber}
                    onChange={(e) => handleInputChange("routingNumber", e.target.value)}
                    className="mt-1.5 h-9 sm:h-10 text-sm sm:text-base"
                  />
                  {errors.routingNumber && (
                    <p className="text-xs text-destructive mt-1">{errors.routingNumber}</p>
                  )}
                </div>
                <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg border border-border">
                  <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                    Bank transfers typically take 1-2 business days to process. Your subscription will be activated once
                    payment is confirmed.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="p-4 sm:p-6 bg-card/50 backdrop-blur-sm">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Account information
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="email" className="text-xs sm:text-sm font-medium">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-1.5 h-9 sm:h-10 text-sm sm:text-base"
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email}</p>
                )}
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5">We'll send your receipt and account details here</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {renderPaymentForm()}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border"
        >
          <Checkbox
            id="terms"
            checked={formData.acceptTerms}
            onCheckedChange={(checked: boolean) => handleInputChange("acceptTerms", checked === true)}
            className="mt-0.5 sm:mt-1"
          />
          <div className="flex-1">
            <label htmlFor="terms" className="text-xs sm:text-sm text-muted-foreground leading-relaxed cursor-pointer">
              I agree to the{" "}
              <a href="#" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">
                Privacy Policy
              </a>
              . My subscription will automatically renew and I can cancel anytime.
            </label>
            {errors.acceptTerms && (
              <p className="text-xs text-destructive mt-1">{errors.acceptTerms}</p>
            )}
          </div>
        </motion.div>
      </form>
    </div>
  )
}
