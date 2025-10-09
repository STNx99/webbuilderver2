"use client";

import { ArrowRight, Sparkles, Star, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import ThemeSwitcher from "@/components/ThemeSwticher";
import LandingPageHero from "@/components/landingpage/LandingPageHero";
import LandingPagePricing from "@/components/landingpage/LandingPagePricing";
import LandingPageFAQ from "@/components/landingpage/LandingPageFAQ";
import LandingPageFeature from "@/components/landingpage/LandingPageFeature";

function useInView(options = {}) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isInView] as const;
}

export default function CanvasLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection observer refs for each section
  const [heroRef, heroInView] = useInView();
  const [statsRef, statsInView] = useInView();
  const [featuresRef, featuresInView] = useInView();
  const [testimonialsRef, testimonialsInView] = useInView();
  const [pricingRef, pricingInView] = useInView();
  const [ctaRef, ctaInView] = useInView();
  const [footerRef, footerInView] = useInView();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // Trigger initial animations
    setIsVisible(true);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // features array removed - now using LandingPageFeature component

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Freelance Designer",
      avatar: "S",
      content:
        "Canvas transformed my workflow completely. The one-message theme switching saved me hours of design work. My clients love how quickly I can show them different looks.",
      rating: 5,
    },
    {
      name: "Mike Rodriguez",
      role: "Coffee Shop Owner",
      avatar: "M",
      content:
        "I'm not technical at all, but Canvas made it so easy. The mobile-ready design means my customers can order from their phones without any issues.",
      rating: 5,
    },
    {
      name: "Emma Thompson",
      role: "Marketing Consultant",
      avatar: "E",
      content:
        "The smooth animations and clean layout make every website feel premium. My conversion rates increased by 40% after switching to Canvas.",
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: 9,
      description: "Perfect for personal projects",
      features: [
        "1 website",
        "Basic theme switching",
        "Mobile responsive",
        "24/7 support",
        "SSL certificate",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: 29,
      description: "Best for small businesses",
      features: [
        "5 websites",
        "Advanced theme engine",
        "Custom animations",
        "E-commerce integration",
        "Priority support",
        "Analytics dashboard",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: 99,
      description: "For growing agencies",
      features: [
        "Unlimited websites",
        "White-label solution",
        "Custom theme creation",
        "Team collaboration",
        "API access",
        "Dedicated support",
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen min-w-screen bg-background text-foreground overflow-x-hidden">
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
              Canvas
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {["Features", "Pricing", "Testimonials"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
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
            {["Features", "Pricing", "Testimonials"].map((item, index) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
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
              <Button variant="ghost" className="justify-start" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold" asChild>
                <Link href="/sign-up">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className={` relative overflow-hidden transition-all duration-1000 ${
          heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <LandingPageHero />
      </section>

      {/* Stats Section */}
      <section
        ref={statsRef}
        className="py-16 bg-gradient-to-r from-accent/5 via-background to-primary/5"
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50K+", label: "Websites Created" },
              { value: "99.9%", label: "Uptime" },
              { value: "<2s", label: "Load Time" },
              { value: "4.9★", label: "User Rating" },
            ].map((stat, index) => (
              <div
                key={index}
                className={`space-y-2 group transition-all duration-700 ${
                  statsInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-24">
        <LandingPageFeature />
      </section>

      {/* Testimonials Section */}
      <section
        ref={testimonialsRef}
        id="testimonials"
        className="py-24 bg-gradient-to-r from-primary/5 via-background to-accent/5"
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div
            className={`text-center mb-20 transition-all duration-1000 ${
              testimonialsInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Loved by{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                creators worldwide
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our community is saying about Canvas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={`bg-card/40 backdrop-blur-sm border-border/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-700 hover:-translate-y-2 group ${
                  testimonialsInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-primary text-primary group-hover:scale-110 transition-transform duration-300"
                        style={{
                          transitionDelay: `${i * 100}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <CardDescription className="text-base leading-relaxed text-foreground/80 group-hover:text-foreground transition-colors duration-300">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground font-semibold text-lg group-hover:scale-110 transition-transform duration-300">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        ref={pricingRef}
        id="pricing"
        className={`py-24 transition-all duration-1000 ${
          pricingInView
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-12"
        }`}
      >
        <LandingPagePricing />
        <LandingPageFAQ />
      </section>

      {/* Call to Action Section */}
      <section
        ref={ctaRef}
        className="py-24 bg-gradient-to-r from-primary/10 via-background to-accent/10 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
        <div className="container mx-auto px-4 lg:px-6 text-center relative">
          <div
            className={`max-w-4xl mx-auto space-y-8 transition-all duration-1000 ${
              ctaInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <h2 className="text-3xl lg:text-6xl font-bold leading-tight">
              Ready to build your{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                dream website?
              </span>
            </h2>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Join thousands of creators who trust Canvas to bring their vision
              to life. Clean, fast, and beautifully animated—just the way it
              should be.
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-6 justify-center pt-8 transition-all duration-1000 delay-300 ${
                ctaInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold text-xl px-12 py-6 hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105 group"
                asChild
              >
                <Link href="/sign-up">
                  Start Your Free Trial
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border text-muted-foreground hover:bg-accent/10 hover:text-foreground hover:border-accent/50 transition-all duration-300 hover:scale-105 bg-transparent backdrop-blur-sm text-xl px-12 py-6"
              >
                Schedule a Demo
              </Button>
            </div>
            <p
              className={`text-sm text-muted-foreground pt-4 transition-all duration-1000 delay-500 ${
                ctaInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        ref={footerRef}
        className="border-t border-border/50 py-16 bg-background/50 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div
            className={`grid md:grid-cols-4 gap-12 transition-all duration-1000 ${
              footerInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold">Canvas</span>
              </div>
              <p className="text-muted-foreground leading-relaxed max-w-sm">
                The easiest way to build professional websites with one-message
                theme switching and smooth animations.
              </p>
            </div>

            {[
              {
                title: "Product",
                links: [
                  "Features",
                  "Templates",
                  "Integrations",
                  "API",
                  "Changelog",
                ],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact", "Press"],
              },
              {
                title: "Support",
                links: [
                  "Help Center",
                  "Community",
                  "Privacy Policy",
                  "Terms of Service",
                  "Status",
                ],
              },
            ].map((section, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  footerInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: `${(index + 1) * 150}ms`,
                }}
              >
                <h3 className="font-semibold text-lg mb-6">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href="#"
                        className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1 inline-block"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className={`border-t border-border/50 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 transition-all duration-1000 delay-300 ${
              footerInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-muted-foreground">
              © {new Date().getFullYear()} Canvas. All rights reserved.
            </p>
            <div className="flex space-x-8">
              {["Twitter", "LinkedIn", "GitHub", "Discord"].map(
                (social, index) => (
                  <Link
                    key={social}
                    href="#"
                    className={`text-muted-foreground hover:text-foreground transition-all duration-500 hover:scale-110 ${
                      footerInView
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                    style={{
                      transitionDelay: `${600 + index * 100}ms`,
                    }}
                  >
                    {social}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
