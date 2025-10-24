"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth, useUser } from "@clerk/nextjs"
import { useSearchParams, useRouter } from "next/navigation"
import LandingPagePricing from "../landingpage/LandingPagePricing"
import { PaymentMethodSelector, type PaymentMethod } from "./PaymentMethod"
import { CheckoutForm } from "./CheckoutForm"
import { OrderSummary } from "./OrderSummary"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Check, Loader2, Sparkles, Menu, X } from "lucide-react"
import { pricingPlans, getNumericPrice, requiresAuthentication, type PricingPlan } from "@/constants/pricing"
import Link from "next/link"
import ThemeSwitcher from "@/components/ThemeSwticher"

export type BillingPeriod = "monthly" | "yearly"

// Use the same interface as pricing plans for consistency
export interface Plan extends PricingPlan {
  monthlyPrice: number;
  yearlyPrice: number;
}

type CheckoutStep = "plans" | "payment-method" | "checkout"

// Convert pricing plan to checkout plan format
function convertToCheckoutPlan(pricingPlan: PricingPlan): Plan {
  return {
    ...pricingPlan,
    monthlyPrice: getNumericPrice(pricingPlan, 'monthly'),
    yearlyPrice: getNumericPrice(pricingPlan, 'yearly'),
  };
}

export function SubscriptionCheckout() {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [step, setStep] = useState<CheckoutStep>("plans")
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("yearly")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit-card")
  const [discount, setDiscount] = useState<number>(0)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!isLoaded) return

    const planId = searchParams.get('plan')
    const frequency = searchParams.get('frequency') as BillingPeriod || 'yearly'

    if (planId) {
      const pricingPlan = pricingPlans.find(p => p.id === planId)
      
      if (!pricingPlan) {
        router.push('/checkout')
        return
      }

      if (requiresAuthentication(planId) && !isSignedIn) {
        setShowAuthPrompt(true)
        setIsInitializing(false)
        return
      }

      if (planId === 'hobby') {
        if (!isSignedIn) {
          router.push('/sign-up')
          return
        }
        router.push('/dashboard')
        return
      }

      if (planId === 'enterprise') {
        router.push('/contact-us')
        return
      }

      if (isSignedIn) {
        setSelectedPlan(convertToCheckoutPlan(pricingPlan))
        setBillingPeriod(frequency)
        setStep("payment-method")
      }
    }

    setIsInitializing(false)
  }, [isLoaded, isSignedIn, searchParams, router])

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleAuthRequired = () => {
    const currentPlan = searchParams.get('plan')
    const currentFrequency = searchParams.get('frequency')
    const redirectUrl = `/checkout?plan=${currentPlan}&frequency=${currentFrequency}`
    
    router.push(`/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`)
  }

  const handleBack = () => {
    if (step === "checkout") {
      setStep("payment-method")
    } else if (step === "payment-method") {
      setStep("plans")
    }
  }

  const handlePaymentMethodContinue = () => {
    setStep("checkout")
  }

  const handleCompleteCheckout = async (formData: any) => {
    if (!selectedPlan) return;

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log("[Checkout] Payment simulation completed", {
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        billingPeriod,
        amount: total,
        paymentMethod,
        formData
      });

      // Create subscription in database
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
          billingPeriod,
          amount: total,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      const subscriptionData = await response.json();
      console.log("[Checkout] Subscription created:", subscriptionData);
      // Show success dialog
      setShowSuccessDialog(true);

    } catch (error) {
      console.error("[Checkout] Error:", error);
      // In production, show error toast/notification
      alert('Failed to complete purchase. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }

  const currentPrice = selectedPlan
    ? billingPeriod === "monthly"
      ? selectedPlan.monthlyPrice
      : selectedPlan.yearlyPrice
    : 0

  const subtotal = currentPrice
  const discountAmount = (subtotal * discount) / 100
  const total = subtotal - discountAmount

  const steps = [
    { id: "plans", label: "Choose Plan", completed: step !== "plans" },
    { id: "payment-method", label: "Payment Method", completed: step === "checkout" },
    { id: "checkout", label: "Complete Purchase", completed: false },
  ]

  // Show loading screen while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen min-w-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen min-w-screen bg-background  ">
      {/* Header */}
      <header
        className={`border-b border-border/50 backdrop-blur-md sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/95 shadow-lg shadow-primary/5"
            : "bg-background/80"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              WebBuilder
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {["Home", "Features", "Pricing"].map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : `/#${item.toLowerCase()}`}
                className="text-muted-foreground hover:text-foreground transition-all duration-300 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeSwitcher />
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                </span>
                <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>
                  Dashboard
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground transition-all duration-300"
                  asChild
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link href="/sign-up">Start Free Trial</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden transition-all duration-300 hover:bg-accent/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="relative w-5 h-5">
              <Menu
                className={`absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"}`}
              />
              <X
                className={`absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"}`}
              />
            </div>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md transition-all duration-500 ${
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="container mx-auto px-4 py-6 space-y-4">
            {["Home", "Features", "Pricing"].map((item, index) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : `/#${item.toLowerCase()}`}
                className={`block text-muted-foreground hover:text-foreground transition-all duration-300 transform ${
                  mobileMenuOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-4 opacity-0"
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <div className="flex flex-col space-y-3 pt-4 border-t border-border/50">
              {isSignedIn ? (
                <div className="flex flex-col space-y-3">
                  <span className="text-sm text-muted-foreground px-3">
                    Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                  </span>
                  <Button variant="outline" className="justify-start" onClick={() => router.push('/dashboard')}>
                    Dashboard
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                  <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold" asChild>
                    <Link href="/sign-up">Start Free Trial</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-3 sm:px-4 py-6 sm:py-8 md:py-12 max-w-screen-2xl mx-auto">
        {step !== "plans" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto mb-6 sm:mb-8"
          >
            <div className="flex justify-start pl-6 sm:justify-center overflow-x-auto pb-2 sm:pb-0 scrollbar-hide px-2">
              {steps.map((s, index) => (
                <div key={s.id} className="flex items-center flex-1 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className={cn(
                        "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-300 shrink-0",
                        s.completed
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : step === s.id
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                            : "bg-secondary text-muted-foreground",
                      )}
                    >
                      {s.completed ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : index + 1}
                    </div>
                    <span
                      className={cn(
                        "text-xs sm:text-sm font-medium hidden sm:block whitespace-nowrap",
                        step === s.id ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "h-px flex-1 mx-2 sm:mx-4 min-w-[20px] transition-all duration-300",
                        s.completed ? "bg-primary" : "bg-border",
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === "plans" ? (
            <motion.div
              key="plans"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <LandingPagePricing />
            </motion.div>
          ) : step === "payment-method" ? (
            <motion.div
              key="payment-method"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto"
            >
              <Button variant="ghost" size="sm" onClick={handleBack} className="mb-4 sm:mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden xs:inline">Back to plans</span>
                <span className="xs:hidden">Back</span>
              </Button>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_400px] gap-6 lg:gap-8">
                <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
                  <PaymentMethodSelector selectedMethod={paymentMethod} onMethodChange={setPaymentMethod} />
                  <Button
                    onClick={handlePaymentMethodContinue}
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg hover:shadow-primary/20"
                  >
                    Continue to payment details
                  </Button>
                </div>

                <div className="order-1 lg:order-2">
                  <OrderSummary
                    selectedPlan={selectedPlan!}
                    billingPeriod={billingPeriod}
                    subtotal={subtotal}
                    discount={discount}
                    total={total}
                    onDiscountApply={setDiscount}
                    paymentMethod={paymentMethod}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto"
            >
              <Button variant="ghost" size="sm" onClick={handleBack} className="mb-4 sm:mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden xs:inline">Back to payment method</span>
                <span className="xs:hidden">Back</span>
              </Button>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_400px] gap-6 lg:gap-8">
                <div className="order-2 lg:order-1">
                  <CheckoutForm
                    selectedPlan={selectedPlan!}
                    billingPeriod={billingPeriod}
                    paymentMethod={paymentMethod}
                    onBillingPeriodChange={setBillingPeriod}
                    onSubmit={handleCompleteCheckout}
                  />
                </div>
                <div className="order-1 lg:order-2">
                  <OrderSummary
                    selectedPlan={selectedPlan!}
                    billingPeriod={billingPeriod}
                    subtotal={subtotal}
                    discount={discount}
                    total={total}
                    onDiscountApply={setDiscount}
                    paymentMethod={paymentMethod}
                    onComplete={handleCompleteCheckout}
                    isProcessing={isProcessing}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Dialog open={showAuthPrompt} onOpenChange={setShowAuthPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>You need to sign in to subscribe to a paid plan. After signing in, you'll be redirected back to complete your purchase.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Button onClick={handleAuthRequired} className="w-full" size="lg">
              Sign in
            </Button>
            <Button 
              variant="outline" 
              className="w-full bg-transparent" 
              size="lg"
              onClick={() => router.push('/sign-up')}
            >
              Create account
            </Button>
            <Button 
              variant="ghost" 
              className="w-full" 
              size="sm"
              onClick={() => setShowAuthPrompt(false)}
            >
              Continue browsing plans
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Payment Successful!
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3 pt-4">
                Your subscription to the <strong>{selectedPlan?.name} plan</strong> has been confirmed.
                <div className="p-4 bg-primary/5 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan:</span>
                    <span className="font-semibold">{selectedPlan?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Billing:</span>
                    <span className="font-semibold capitalize">{billingPeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  You will be redirected to your dashboard in a few seconds...
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <Button 
              onClick={() => router.push('/dashboard')} 
              className="w-full" 
              size="lg"
            >
              Go to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
