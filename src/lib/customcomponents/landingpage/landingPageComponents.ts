import { v4 as uuidv4 } from "uuid";
import { CustomComponent } from "../customComponents";

export const landingPageTemplateComponent: CustomComponent = {
  component: {
    type: "Frame",
    name: "LandingPageTemplate",
    content: "",

    styles: {
      width: "100%",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    },
    tailwindStyles: "w-full min-h-screen flex flex-col bg-white",
    elements: [
      {
        type: "Frame",
        name: "NavbarSection",
        content: "",

        styles: {
          width: "100%",
          height: "auto",
          minHeight: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "15px 30px",
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          zIndex: "10",
        },
        tailwindStyles:
          "w-full py-4 px-6 md:px-8 flex flex-col md:flex-row items-center justify-between bg-white shadow-sm sticky top-0 z-10 gap-4 md:gap-0",
        elements: [
          {
            type: "Image",
            content: "Logo",

            styles: {
              width: "100px",
              height: "40px",
              objectFit: "contain",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
              borderRadius: "4px",
            },
            tailwindStyles:
              "w-24 h-10 object-contain bg-white flex items-center justify-center p-2 rounded",
            href: "",
            src: "",
          },
          {
            type: "Frame",
            name: "NavLinks",
            content: "",
            styles: {
              display: "flex",
              gap: "20px",
              alignItems: "center",
            },
            tailwindStyles:
              "flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-5",
            elements: [
              {
                type: "Link",
                content: "Home",
                styles: {
                  color: "#333333",
                  fontWeight: "500",
                },
                tailwindStyles:
                  "text-gray-800 font-medium hover:text-sky-500 transition-colors",
                href: "/",
                src: "",
              },
              {
                type: "Link",
                content: "Features",
                styles: {
                  color: "#333333",
                  fontWeight: "500",
                },
                tailwindStyles:
                  "text-gray-800 font-medium hover:text-sky-500 transition-colors",
                href: "#features",
                src: "",
              },
              {
                type: "Link",
                content: "Pricing",
                styles: {
                  color: "#333333",
                  fontWeight: "500",
                },
                tailwindStyles:
                  "text-gray-800 font-medium hover:text-sky-500 transition-colors",
                href: "/pricing",
                src: "",
              },
              {
                type: "Link",
                content: "About",
                styles: {
                  color: "#333333",
                  fontWeight: "500",
                },
                tailwindStyles:
                  "text-gray-800 font-medium hover:text-sky-500 transition-colors",
                href: "/about",
                src: "",
              },
              {
                type: "Button",
                content: "Get Started",
                styles: {
                  backgroundColor: "#0ea5e9",
                  color: "white",
                  fontWeight: "500",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                },
                tailwindStyles:
                  "bg-sky-500 text-white font-medium px-4 py-2 rounded-md hover:bg-sky-600 transition-colors",
                href: "",
                src: "",
              },
            ],
            href: "",
            src: "",
          },
        ],
        href: "",
        src: "",
      },

      {
        type: "Frame",
        name: "HeroSection",
        content: "",
        styles: {
          width: "100%",
          minHeight: "600px",
          backgroundColor: "#f0f9ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 20px",
        },
        tailwindStyles:
          "w-full min-h-[600px] bg-sky-50 flex items-center justify-center py-16 px-4 md:px-8",
        elements: [
          {
            type: "Frame",
            name: "HeroContent",
            content: "",
            styles: {
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              textAlign: "center",
              maxWidth: "1200px",
              width: "100%",
              gap: "24px",
            },
            tailwindStyles:
              "flex flex-row items-center justify-between gap-10 md:gap-16 w-full max-w-6xl mx-auto",
            elements: [
              {
                type: "Frame",
                name: "HeroText",
                content: "",
                styles: {
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  textAlign: "left",
                  maxWidth: "600px",
                },
                tailwindStyles: "flex flex-col gap-4 text-left w-1/2",
                elements: [
                  {
                    type: "Text",
                    content: "Build your website visually without code",
                    styles: {
                      fontSize: "40px",
                      fontWeight: "bold",
                      color: "#111827",
                      lineHeight: "1.2",
                    },
                    tailwindStyles:
                      "text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight",
                    href: "",
                    src: "",
                  },
                  {
                    type: "Text",
                    content:
                      "Our drag-and-drop web builder makes creating professional websites easy and enjoyable. Get started in minutes, no coding required.",
                    styles: {
                      fontSize: "18px",
                      color: "#4b5563",
                      lineHeight: "1.6",
                    },
                    tailwindStyles:
                      "text-base md:text-lg text-gray-600 leading-relaxed mt-2",
                    href: "",
                    src: "",
                  },
                  {
                    type: "Button",
                    content: "Start Building Now",
                    styles: {
                      backgroundColor: "#0ea5e9",
                      color: "white",
                      fontWeight: "600",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "16px",
                      marginTop: "12px",
                    },
                    tailwindStyles:
                      "bg-sky-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-sky-600 transition-colors text-base md:text-lg mt-4 md:mt-6 self-start",
                    href: "",
                    src: "",
                  },
                ],
                href: "",
                src: "",
              },
              {
                type: "Image",
                content: "Hero Image",
                styles: {
                  width: "100%",
                  maxWidth: "500px",
                  borderRadius: "12px",
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                },
                tailwindStyles: "w-1/2 max-w-[500px] rounded-xl shadow-xl",
                href: "",
                src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
              },
            ],
            href: "",
            src: "",
          },
        ],
        href: "",
        src: "",
      },
      {
        type: "Frame",
        name: "FeaturesSection",
        content: "",

        styles: {
          width: "100%",
          padding: "80px 20px",
          backgroundColor: "white",
        },
        tailwindStyles: "w-full py-20 px-4 md:px-8 bg-white",
        elements: [
          {
            type: "Frame",
            name: "FeaturesContainer",
            content: "",

            styles: {
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "60px",
            },
            tailwindStyles: "max-w-6xl mx-auto flex flex-col gap-16",
            elements: [
              {
                type: "Frame",
                name: "FeaturesHeader",
                content: "",

                styles: {
                  textAlign: "center",
                  marginBottom: "20px",
                },
                tailwindStyles: "text-center mb-10",
                elements: [
                  {
                    type: "Text",
                    content: "Key Features",

                    styles: {
                      color: "#0ea5e9",
                      fontWeight: "600",
                      fontSize: "16px",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    },
                    tailwindStyles:
                      "text-sky-500 font-semibold text-sm uppercase tracking-wider",
                    href: "",
                    src: "",
                  },
                  {
                    type: "Text",
                    content: "Why Choose Our Platform",

                    styles: {
                      fontSize: "36px",
                      fontWeight: "bold",
                      color: "#111827",
                      marginTop: "8px",
                    },
                    tailwindStyles:
                      "text-3xl md:text-4xl font-bold text-gray-900 mt-2",
                    href: "",
                    src: "",
                  },
                  {
                    type: "Text",
                    content:
                      "Our platform offers everything you need to build beautiful, functional websites with ease.",

                    styles: {
                      fontSize: "18px",
                      color: "#4b5563",
                      maxWidth: "600px",
                      margin: "16px auto 0",
                    },
                    tailwindStyles:
                      "text-lg text-gray-600 max-w-xl mx-auto mt-4",
                    href: "",
                    src: "",
                  },
                ],
                href: "",
                src: "",
              },
              {
                type: "Frame",
                name: "FeaturesGrid",
                content: "",

                styles: {
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "30px",
                },
                tailwindStyles:
                  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
                elements: [
                  {
                    type: "Frame",
                    name: "FeatureCard1",
                    content: "",

                    styles: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                      padding: "30px",
                      borderRadius: "8px",
                      backgroundColor: "#f9fafb",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    },
                    tailwindStyles:
                      "flex flex-col gap-4 p-6 rounded-lg bg-gray-50 hover:shadow-md hover:-translate-y-1 transition-all",
                    elements: [
                      {
                        type: "Text",
                        content: "✓",

                        styles: {
                          fontSize: "24px",
                          color: "#0ea5e9",
                          fontWeight: "bold",
                        },
                        tailwindStyles: "text-sky-500 text-2xl font-bold",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content: "Drag & Drop Builder",

                        styles: {
                          fontSize: "20px",
                          fontWeight: "600",
                          color: "#111827",
                        },
                        tailwindStyles: "text-xl font-semibold text-gray-900",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content:
                          "Build your website visually with our intuitive drag and drop interface. No coding required.",

                        styles: {
                          fontSize: "16px",
                          color: "#4b5563",
                          lineHeight: "1.6",
                        },
                        tailwindStyles:
                          "text-base text-gray-600 leading-relaxed",
                        href: "",
                        src: "",
                      },
                    ],
                    href: "",
                    src: "",
                  },
                  {
                    type: "Frame",
                    name: "FeatureCard2",
                    content: "",

                    styles: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                      padding: "30px",
                      borderRadius: "8px",
                      backgroundColor: "#f9fafb",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    },
                    tailwindStyles:
                      "flex flex-col gap-4 p-6 rounded-lg bg-gray-50 hover:shadow-md hover:-translate-y-1 transition-all",
                    elements: [
                      {
                        type: "Text",
                        content: "✓",

                        styles: {
                          fontSize: "24px",
                          color: "#0ea5e9",
                          fontWeight: "bold",
                        },
                        tailwindStyles: "text-sky-500 text-2xl font-bold",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content: "Responsive Design",

                        styles: {
                          fontSize: "20px",
                          fontWeight: "600",
                          color: "#111827",
                        },
                        tailwindStyles: "text-xl font-semibold text-gray-900",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content:
                          "All websites are fully responsive, ensuring they look great on any device, from desktop to mobile.",

                        styles: {
                          fontSize: "16px",
                          color: "#4b5563",
                          lineHeight: "1.6",
                        },
                        tailwindStyles:
                          "text-base text-gray-600 leading-relaxed",
                        href: "",
                        src: "",
                      },
                    ],
                    href: "",
                    src: "",
                  },
                  {
                    type: "Frame",
                    name: "FeatureCard3",

                    content: "",

                    styles: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                      padding: "30px",
                      borderRadius: "8px",
                      backgroundColor: "#f9fafb",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    },
                    tailwindStyles:
                      "flex flex-col gap-4 p-6 rounded-lg bg-gray-50 hover:shadow-md hover:-translate-y-1 transition-all",
                    elements: [
                      {
                        type: "Text",
                        content: "✓",

                        styles: {
                          fontSize: "24px",
                          color: "#0ea5e9",
                          fontWeight: "bold",
                        },
                        tailwindStyles: "text-sky-500 text-2xl font-bold",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content: "Ready-made Templates",

                        styles: {
                          fontSize: "20px",
                          fontWeight: "600",
                          color: "#111827",
                        },
                        tailwindStyles: "text-xl font-semibold text-gray-900",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content:
                          "Start with professionally designed templates or build from scratch - the choice is yours.",

                        styles: {
                          fontSize: "16px",
                          color: "#4b5563",
                          lineHeight: "1.6",
                        },
                        tailwindStyles:
                          "text-base text-gray-600 leading-relaxed",
                        href: "",
                        src: "",
                      },
                    ],
                    href: "",
                    src: "",
                  },
                ],
                href: "",
                src: "",
              },
            ],
            href: "",
            src: "",
          },
        ],
        href: "",
        src: "",
      },

      {
        type: "Frame",
        name: "AboutSection",
        content: "",

        styles: {
          width: "100%",
          padding: "80px 20px",
          backgroundColor: "#f8fafc",
        },
        tailwindStyles: "w-full py-20 px-4 md:px-8 bg-slate-50",
        elements: [
          {
            type: "Frame",
            name: "AboutContainer",
            content: "",

            styles: {
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "60px",
            },
            tailwindStyles: "max-w-6xl mx-auto flex flex-col gap-16",
            elements: [
              {
                type: "Frame",
                name: "AboutHeader",
                content: "",

                styles: {
                  textAlign: "center",
                  marginBottom: "40px",
                },
                tailwindStyles: "text-center mb-14",
                elements: [
                  {
                    type: "Text",
                    content: "About Us",

                    styles: {
                      color: "#0ea5e9",
                      fontWeight: "600",
                      fontSize: "16px",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    },
                    tailwindStyles:
                      "text-sky-500 font-semibold text-sm uppercase tracking-wider",
                    href: "",
                    src: "",
                  },
                  {
                    type: "Text",
                    content: "Meet the Team Behind the Platform",

                    styles: {
                      fontSize: "36px",
                      fontWeight: "bold",
                      color: "#111827",
                      marginTop: "8px",
                    },
                    tailwindStyles:
                      "text-3xl md:text-4xl font-bold text-gray-900 mt-2",
                    href: "",
                    src: "",
                  },
                  {
                    type: "Text",
                    content:
                      "We're a passionate team of designers, developers, and innovators dedicated to making website creation accessible to everyone.",

                    styles: {
                      fontSize: "18px",
                      color: "#4b5563",
                      maxWidth: "700px",
                      margin: "16px auto 0",
                    },
                    tailwindStyles:
                      "text-lg text-gray-600 max-w-2xl mx-auto mt-4",
                    href: "",
                    src: "",
                  },
                ],
                href: "",
                src: "",
              },
              {
                type: "Frame",
                name: "TeamProfiles",
                content: "",

                styles: {
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "30px",
                },
                tailwindStyles:
                  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8",
                elements: [
                  {
                    type: "Frame",
                    name: "TeamMember1",
                    content: "",

                    styles: {
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "16px",
                      textAlign: "center",
                    },
                    tailwindStyles:
                      "flex flex-col items-center gap-4 text-center",
                    elements: [
                      {
                        type: "Image",
                        content: "Team Member 1",

                        styles: {
                          width: "150px",
                          height: "150px",
                          borderRadius: "9999px",
                          objectFit: "cover",
                          border: "4px solid white",
                          boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        },
                        tailwindStyles:
                          "w-36 h-36 rounded-full object-cover border-4 border-white shadow-md",
                        href: "",
                        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                      },
                      {
                        type: "Text",
                        content: "Sarah Johnson",

                        styles: {
                          fontSize: "20px",
                          fontWeight: "600",
                          color: "#111827",
                        },
                        tailwindStyles: "text-xl font-semibold text-gray-900",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content: "CEO & Founder",

                        styles: {
                          fontSize: "16px",
                          color: "#0ea5e9",
                          fontWeight: "500",
                        },
                        tailwindStyles: "text-sky-500 font-medium",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content:
                          "10+ years of experience in web development and product management.",

                        styles: {
                          fontSize: "14px",
                          color: "#6b7280",
                          lineHeight: "1.6",
                        },
                        tailwindStyles: "text-sm text-gray-500 leading-relaxed",
                        href: "",
                        src: "",
                      },
                    ],
                    href: "",
                    src: "",
                  },
                  {
                    type: "Frame",
                    name: "TeamMember2",
                    content: "",

                    styles: {
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "16px",
                      textAlign: "center",
                    },
                    tailwindStyles:
                      "flex flex-col items-center gap-4 text-center",
                    elements: [
                      {
                        type: "Image",
                        content: "Team Member 2",

                        styles: {
                          width: "150px",
                          height: "150px",
                          borderRadius: "9999px",
                          objectFit: "cover",
                          border: "4px solid white",
                          boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        },
                        tailwindStyles:
                          "w-36 h-36 rounded-full object-cover border-4 border-white shadow-md",
                        href: "",
                        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                      },
                      {
                        type: "Text",
                        content: "David Chen",

                        styles: {
                          fontSize: "20px",
                          fontWeight: "600",
                          color: "#111827",
                        },
                        tailwindStyles: "text-xl font-semibold text-gray-900",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content: "Lead Developer",

                        styles: {
                          fontSize: "16px",
                          color: "#0ea5e9",
                          fontWeight: "500",
                        },
                        tailwindStyles: "text-sky-500 font-medium",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content:
                          "Expert in frontend frameworks with a passion for creating intuitive user experiences.",

                        styles: {
                          fontSize: "14px",
                          color: "#6b7280",
                          lineHeight: "1.6",
                        },
                        tailwindStyles: "text-sm text-gray-500 leading-relaxed",
                        href: "",
                        src: "",
                      },
                    ],
                    href: "",
                    src: "",
                  },
                  {
                    type: "Frame",
                    name: "TeamMember3",
                    content: "",

                    styles: {
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "16px",
                      textAlign: "center",
                    },
                    tailwindStyles:
                      "flex flex-col items-center gap-4 text-center",
                    elements: [
                      {
                        type: "Image",
                        content: "Team Member 3",

                        styles: {
                          width: "150px",
                          height: "150px",
                          borderRadius: "9999px",
                          objectFit: "cover",
                          border: "4px solid white",
                          boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        },
                        tailwindStyles:
                          "w-36 h-36 rounded-full object-cover border-4 border-white shadow-md",
                        href: "",
                        src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80",
                      },
                      {
                        type: "Text",
                        content: "Michelle Taylor",

                        styles: {
                          fontSize: "20px",
                          fontWeight: "600",
                          color: "#111827",
                        },
                        tailwindStyles: "text-xl font-semibold text-gray-900",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content: "UI/UX Designer",

                        styles: {
                          fontSize: "16px",
                          color: "#0ea5e9",
                          fontWeight: "500",
                        },
                        tailwindStyles: "text-sky-500 font-medium",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content:
                          "Creates beautiful, functional designs that make our platform a joy to use.",

                        styles: {
                          fontSize: "14px",
                          color: "#6b7280",
                          lineHeight: "1.6",
                        },
                        tailwindStyles: "text-sm text-gray-500 leading-relaxed",
                        href: "",
                        src: "",
                      },
                    ],
                    href: "",
                    src: "",
                  },
                  {
                    type: "Frame",
                    name: "TeamMember4",
                    content: "",

                    styles: {
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "16px",
                      textAlign: "center",
                    },
                    tailwindStyles:
                      "flex flex-col items-center gap-4 text-center",
                    elements: [
                      {
                        type: "Image",
                        content: "Team Member 4",

                        styles: {
                          width: "150px",
                          height: "150px",
                          borderRadius: "9999px",
                          objectFit: "cover",
                          border: "4px solid white",
                          boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        },
                        tailwindStyles:
                          "w-36 h-36 rounded-full object-cover border-4 border-white shadow-md",
                        href: "",
                        src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                      },
                      {
                        type: "Text",
                        content: "Robert Wilson",

                        styles: {
                          fontSize: "20px",
                          fontWeight: "600",
                          color: "#111827",
                        },
                        tailwindStyles: "text-xl font-semibold text-gray-900",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content: "Customer Success",

                        styles: {
                          fontSize: "16px",
                          color: "#0ea5e9",
                          fontWeight: "500",
                        },
                        tailwindStyles: "text-sky-500 font-medium",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content:
                          "Dedicated to ensuring our customers get the most out of our platform.",

                        styles: {
                          fontSize: "14px",
                          color: "#6b7280",
                          lineHeight: "1.6",
                        },
                        tailwindStyles: "text-sm text-gray-500 leading-relaxed",
                        href: "",
                        src: "",
                      },
                    ],
                    href: "",
                    src: "",
                  },
                ],
                href: "",
                src: "",
              },
              {
                type: "Frame",
                name: "CompanyStory",
                content: "",

                styles: {
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  marginTop: "60px",
                  backgroundColor: "white",
                  padding: "40px",
                  borderRadius: "12px",
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
                },
                tailwindStyles:
                  "flex flex-col gap-6 mt-16 bg-white p-8 rounded-xl shadow-sm",
                elements: [
                  {
                    type: "Text",
                    content: "Our Story",

                    styles: {
                      fontSize: "24px",
                      fontWeight: "600",
                      color: "#111827",
                    },
                    tailwindStyles: "text-2xl font-semibold text-gray-900",
                    href: "",
                    src: "",
                  },
                  {
                    type: "Text",
                    content:
                      "WebBuilder was founded in 2020 with a simple mission: to make web development accessible to everyone. We believe that creating a professional online presence shouldn't require technical expertise or a large budget.",

                    styles: {
                      fontSize: "16px",
                      color: "#4b5563",
                      lineHeight: "1.7",
                    },
                    tailwindStyles: "text-base text-gray-600 leading-relaxed",
                    href: "",
                    src: "",
                  },
                  {
                    type: "Text",
                    content:
                      "What started as a small project has grown into a full-featured platform used by thousands of individuals and businesses worldwide. Our team has expanded, but our mission remains the same: empowering people to bring their ideas to life on the web.",

                    styles: {
                      fontSize: "16px",
                      color: "#4b5563",
                      lineHeight: "1.7",
                    },
                    tailwindStyles: "text-base text-gray-600 leading-relaxed",
                    href: "",
                    src: "",
                  },
                  {
                    type: "Frame",
                    name: "CompanyStats",
                    content: "",

                    styles: {
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "20px",
                      marginTop: "20px",
                    },
                    tailwindStyles:
                      "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-8",
                    elements: [
                      {
                        type: "Frame",
                        name: "Stat1",

                        content: "",

                        styles: {
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                        },
                        tailwindStyles:
                          "flex flex-col items-center text-center",
                        elements: [
                          {
                            type: "Text",
                            content: "10,000+",

                            styles: {
                              fontSize: "28px",
                              fontWeight: "bold",
                              color: "#0ea5e9",
                            },
                            tailwindStyles:
                              "text-2xl md:text-3xl font-bold text-sky-500",
                            href: "",
                            src: "",
                          },
                          {
                            type: "Text",
                            content: "Websites Built",

                            styles: {
                              fontSize: "14px",
                              color: "#6b7280",
                            },
                            tailwindStyles: "text-sm text-gray-500",
                            href: "",
                            src: "",
                          },
                        ],
                        href: "",
                        src: "",
                      },
                      {
                        type: "Frame",
                        name: "Stat3",
                        content: "",

                        styles: {
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                        },
                        tailwindStyles:
                          "flex flex-col items-center text-center",
                        elements: [
                          {
                            type: "Text",
                            content: "5,000+",

                            styles: {
                              fontSize: "28px",
                              fontWeight: "bold",
                              color: "#0ea5e9",
                            },
                            tailwindStyles:
                              "text-2xl md:text-3xl font-bold text-sky-500",
                            href: "",
                            src: "",
                          },
                          {
                            type: "Text",
                            content: "Happy Customers",

                            styles: {
                              fontSize: "14px",
                              color: "#6b7280",
                            },
                            tailwindStyles: "text-sm text-gray-500",
                            href: "",
                            src: "",
                          },
                        ],
                        href: "",
                        src: "",
                      },
                      {
                        type: "Frame",
                        name: "Stat3",

                        content: "",

                        styles: {
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                        },
                        tailwindStyles:
                          "flex flex-col items-center text-center",
                        elements: [
                          {
                            type: "Text",
                            content: "15",

                            styles: {
                              fontSize: "28px",
                              fontWeight: "bold",
                              color: "#0ea5e9",
                            },
                            tailwindStyles:
                              "text-2xl md:text-3xl font-bold text-sky-500",
                            href: "",
                            src: "",
                          },
                          {
                            type: "Text",
                            content: "Team Members",

                            styles: {
                              fontSize: "14px",
                              color: "#6b7280",
                            },
                            tailwindStyles: "text-sm text-gray-500",
                            href: "",
                            src: "",
                          },
                        ],
                        href: "",
                        src: "",
                      },
                      {
                        type: "Frame",
                        name: "Stat4",

                        content: "",

                        styles: {
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                        },
                        tailwindStyles:
                          "flex flex-col items-center text-center",
                        elements: [
                          {
                            type: "Text",
                            content: "24/7",

                            styles: {
                              fontSize: "28px",
                              fontWeight: "bold",
                              color: "#0ea5e9",
                            },
                            tailwindStyles:
                              "text-2xl md:text-3xl font-bold text-sky-500",
                            href: "",
                            src: "",
                          },
                          {
                            type: "Text",
                            content: "Customer Support",

                            styles: {
                              fontSize: "14px",
                              color: "#6b7280",
                            },
                            tailwindStyles: "text-sm text-gray-500",
                            href: "",
                            src: "",
                          },
                        ],
                        href: "",
                        src: "",
                      },
                    ],
                    href: "",
                    src: "",
                  },
                ],
                href: "",
                src: "",
              },
            ],
            href: "",
            src: "",
          },
        ],
        href: "",
        src: "",
      },

      {
        type: "Frame",
        name: "CTASection",
        content: "",

        styles: {
          width: "100%",
          backgroundColor: "#0ea5e9",
          padding: "80px 20px",
          color: "white",
        },
        tailwindStyles: "w-full bg-sky-500 py-20 px-4 md:px-8 text-white",
        elements: [
          {
            type: "Frame",
            name: "CTAContainer",
            content: "",

            styles: {
              maxWidth: "1000px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "24px",
            },
            tailwindStyles:
              "max-w-4xl mx-auto flex flex-col items-center text-center gap-6",
            elements: [
              {
                type: "Text",
                content: "Ready to Build Your Website?",

                styles: {
                  fontSize: "36px",
                  fontWeight: "bold",
                  color: "white",
                },
                tailwindStyles: "text-3xl md:text-4xl font-bold",
                href: "",
                src: "",
              },
              {
                type: "Text",
                content:
                  "Start your free trial today and see how easy it is to create a professional website with our platform.",

                styles: {
                  fontSize: "18px",
                  maxWidth: "700px",
                  marginTop: "10px",
                },
                tailwindStyles: "text-lg md:text-xl max-w-2xl mt-2 text-sky-50",
                href: "",
                src: "",
              },
              {
                type: "Button",
                content: "Start Free Trial",

                styles: {
                  backgroundColor: "white",
                  color: "#0ea5e9",
                  fontWeight: "600",
                  padding: "14px 28px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  marginTop: "20px",
                  border: "none",
                  cursor: "pointer",
                },
                tailwindStyles:
                  "bg-white text-sky-500 font-semibold px-7 py-3.5 rounded-lg hover:bg-sky-50 transition-colors text-lg mt-6",
                href: "",
                src: "",
              },
              {
                type: "Text",
                content: "No credit card required. Free for 14 days.",

                styles: {
                  fontSize: "14px",
                  marginTop: "10px",
                  opacity: "0.9",
                },
                tailwindStyles: "text-sm mt-3 text-sky-100",
                href: "",
                src: "",
              },
            ],
            href: "",
            src: "",
          },
        ],
        href: "",
        src: "",
      },

      {
        type: "Frame",
        name: "FooterSection",

        content: "",

        styles: {
          width: "100%",
          backgroundColor: "white",
          color: "#333333",
          padding: "60px 20px 30px",
        },
        tailwindStyles:
          "w-full bg-white text-gray-800 py-14 px-4 md:px-8 mt-auto shadow-md",
        elements: [
          {
            type: "Frame",
            name: "FooterContainer",

            content: "",

            styles: {
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "40px",
            },
            tailwindStyles: "max-w-6xl mx-auto flex flex-col gap-10",
            elements: [
              {
                type: "Frame",
                name: "FooterMain",

                content: "",

                styles: {
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "30px",
                },
                tailwindStyles: "grid grid-cols-1 md:grid-cols-4 gap-8",
                elements: [
                  {
                    type: "Frame",
                    name: "CompanyInfo",

                    content: "",

                    styles: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    },
                    tailwindStyles: "flex flex-col gap-4",
                    elements: [
                      {
                        type: "Image",
                        content: "Logo",

                        styles: {
                          width: "100px",
                          height: "40px",
                          objectFit: "contain",
                          backgroundColor: "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        },
                        tailwindStyles:
                          "w-24 h-10 object-contain flex items-center justify-center",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content:
                          "Create beautiful websites easily with our drag-and-drop website builder.",

                        styles: {
                          fontSize: "14px",
                          color: "#9ca3af",
                          lineHeight: "1.6",
                        },
                        tailwindStyles: "text-sm text-gray-400 leading-relaxed",
                        href: "",
                        src: "",
                      },
                    ],
                    href: "",
                    src: "",
                  },
                  {
                    type: "Frame",
                    name: "FooterLinks1",
                    content: "",

                    styles: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    },
                    tailwindStyles: "flex flex-col gap-3",
                    elements: [
                      {
                        type: "Text",
                        content: "PRODUCT",

                        styles: {
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#333333",
                          marginBottom: "8px",
                        },
                        tailwindStyles:
                          "text-sm font-semibold text-gray-800 mb-2",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Link",
                        content: "Features",

                        styles: {
                          fontSize: "14px",
                          color: "#9ca3af",
                        },
                        tailwindStyles:
                          "text-sm text-gray-400 hover:text-sky-500 transition-colors",
                        href: "#",
                        src: "",
                      },
                      {
                        type: "Link",
                        content: "Pricing",

                        styles: {
                          fontSize: "14px",
                          color: "#9ca3af",
                        },
                        tailwindStyles:
                          "text-sm text-gray-400 hover:text-sky-500 transition-colors",
                        href: "#",
                        src: "",
                      },
                      {
                        type: "Link",
                        content: "Templates",

                        styles: {
                          fontSize: "14px",
                          color: "#9ca3af",
                        },
                        tailwindStyles:
                          "text-sm text-gray-400 hover:text-sky-500 transition-colors",
                        href: "#",
                        src: "",
                      },
                    ],
                    href: "",
                    src: "",
                  },
                  {
                    type: "Frame",
                    name: "FooterLinks2",
                    content: "",

                    styles: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    },
                    tailwindStyles: "flex flex-col gap-3",
                    elements: [
                      {
                        type: "Text",
                        content: "COMPANY",

                        styles: {
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#333333",
                          marginBottom: "8px",
                        },
                        tailwindStyles:
                          "text-sm font-semibold text-gray-800 mb-2",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Link",
                        content: "About Us",

                        styles: {
                          fontSize: "14px",
                          color: "#9ca3af",
                        },
                        tailwindStyles:
                          "text-sm text-gray-400 hover:text-sky-500 transition-colors",
                        href: "#",
                        src: "",
                      },
                      {
                        type: "Link",
                        content: "Careers",

                        styles: {
                          fontSize: "14px",
                          color: "#9ca3af",
                        },
                        tailwindStyles:
                          "text-sm text-gray-400 hover:text-sky-500 transition-colors",
                        href: "#",
                        src: "",
                      },
                      {
                        type: "Link",
                        content: "Blog",

                        styles: {
                          fontSize: "14px",
                          color: "#9ca3af",
                        },
                        tailwindStyles:
                          "text-sm text-gray-400 hover:text-sky-500 transition-colors",
                        href: "#",
                        src: "",
                      },
                    ],
                    href: "",
                    src: "",
                  },
                  {
                    type: "Frame",
                    name: "FooterLinks3",
                    content: "",

                    styles: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    },
                    tailwindStyles: "flex flex-col gap-3",
                    elements: [
                      {
                        type: "Text",
                        content: "SUPPORT",

                        styles: {
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#333333",
                          marginBottom: "8px",
                        },
                        tailwindStyles:
                          "text-sm font-semibold text-gray-800 mb-2",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Link",
                        content: "Help Center",

                        styles: {
                          fontSize: "14px",
                          color: "#9ca3af",
                        },
                        tailwindStyles:
                          "text-sm text-gray-400 hover:text-sky-500 transition-colors",
                        href: "#",
                        src: "",
                      },
                      {
                        type: "Link",
                        content: "Contact Us",

                        styles: {
                          fontSize: "14px",
                          color: "#9ca3af",
                        },
                        tailwindStyles:
                          "text-sm text-gray-400 hover:text-sky-500 transition-colors",
                        href: "#",
                        src: "",
                      },
                      {
                        type: "Link",
                        content: "Privacy Policy",

                        styles: {
                          fontSize: "14px",
                          color: "#9ca3af",
                        },
                        tailwindStyles:
                          "text-sm text-gray-400 hover:text-sky-500 transition-colors",
                        href: "#",
                        src: "",
                      },
                    ],
                    href: "",
                    src: "",
                  },
                ],
                href: "",
                src: "",
              },
              {
                type: "Frame",
                name: "FooterBottom",
                content: "",

                styles: {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid #e5e7eb",
                  paddingTop: "20px",
                  flexWrap: "wrap",
                  gap: "20px",
                },
                tailwindStyles:
                  "flex flex-col md:flex-row justify-between items-center border-t border-gray-200 pt-6 gap-4",
                elements: [
                  {
                    type: "Text",
                    content: "© 2025 WebBuilder. All rights reserved.",

                    styles: {
                      fontSize: "14px",
                      color: "#9ca3af",
                    },
                    tailwindStyles: "text-sm text-gray-400",
                    href: "",
                    src: "",
                  },
                  {
                    type: "Frame",
                    name: "SocialLinks",

                    content: "",

                    styles: {
                      display: "flex",
                      gap: "16px",
                    },
                    tailwindStyles: "flex gap-4",
                    elements: [
                      {
                        type: "Link",
                        content: "Twitter",

                        styles: {
                          fontSize: "14px",
                          color: "#9ca3af",
                        },
                        tailwindStyles:
                          "text-sm text-gray-400 hover:text-sky-500 transition-colors",
                        href: "#",
                        src: "",
                      },
                      {
                        type: "Link",
                        content: "Facebook",

                        styles: {
                          fontSize: "14px",
                          color: "#9ca3af",
                        },
                        tailwindStyles:
                          "text-sm text-gray-400 hover:text-sky-500 transition-colors",
                        href: "#",
                        src: "",
                      },
                      {
                        type: "Link",
                        content: "Instagram",

                        styles: {
                          fontSize: "14px",
                          color: "#9ca3af",
                        },
                        tailwindStyles:
                          "text-sm text-gray-400 hover:text-sky-500 transition-colors",
                        href: "#",
                        src: "",
                      },
                    ],
                    href: "",
                    src: "",
                  },
                ],
                href: "",
                src: "",
              },
            ],
            href: "",
            src: "",
          },
        ],
        href: "",
        src: "",
      },
    ],
    href: "",
    src: "",
  },
};
export const landingPageTemplateComponent2: CustomComponent = {
  component: {
    type: "Frame",
    name: "LandingPageTemplate2",
    content: "",

    styles: {
      width: "100%",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#0f172a",
      color: "white",
    },
    tailwindStyles: "w-full min-h-screen flex flex-col bg-slate-900 text-white",
    elements: [
      {
        type: "Frame",
        name: "NavbarSection",
        content: "",

        styles: {
          width: "100%",
          height: "auto",
          minHeight: "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 40px",
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
          position: "sticky",
          top: "0",
          zIndex: "50",
        },
        tailwindStyles:
          "w-full py-5 px-8 md:px-10 flex items-center justify-between bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50",
        elements: [
          {
            type: "Frame",
            name: "LogoSection",

            content: "",

            styles: {
              display: "flex",
              alignItems: "center",
              gap: "12px",
            },
            tailwindStyles: "flex items-center gap-3",
            elements: [
              {
                type: "Image",
                content: "Logo",

                styles: {
                  height: "32px",
                  width: "auto",
                },
                tailwindStyles: "h-8 w-auto",
                href: "",
                src: "",
              },
            ],
            href: "",
            src: "",
          },
          {
            type: "Frame",
            name: "NavLinks",
            content: "",

            styles: {
              display: "flex",
              gap: "32px",
              alignItems: "center",
            },
            tailwindStyles: "hidden md:flex items-center gap-8",
            elements: [
              {
                type: "Link",
                content: "Home",

                styles: {
                  color: "#e2e8f0",
                  fontWeight: "500",
                  fontSize: "16px",
                },
                tailwindStyles:
                  "text-slate-200 font-medium hover:text-white transition-colors",
                href: "/",
                src: "",
              },
              {
                type: "Link",
                content: "Services",

                styles: {
                  color: "#e2e8f0",
                  fontWeight: "500",
                  fontSize: "16px",
                },
                tailwindStyles:
                  "text-slate-200 font-medium hover:text-white transition-colors",
                href: "#services",
                src: "",
              },
              {
                type: "Link",
                content: "Portfolio",

                styles: {
                  color: "#e2e8f0",
                  fontWeight: "500",
                  fontSize: "16px",
                },
                tailwindStyles:
                  "text-slate-200 font-medium hover:text-white transition-colors",
                href: "#portfolio",
                src: "",
              },
              {
                type: "Link",
                content: "Contact",

                styles: {
                  color: "#e2e8f0",
                  fontWeight: "500",
                  fontSize: "16px",
                },
                tailwindStyles:
                  "text-slate-200 font-medium hover:text-white transition-colors",
                href: "#contact",
                src: "",
              },
              {
                type: "Button",
                content: "Get Started",

                styles: {
                  backgroundColor: "#3b82f6",
                  color: "white",
                  fontWeight: "600",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                },
                tailwindStyles:
                  "bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-600 transition-colors",
                href: "",
                src: "",
              },
            ],
            href: "",
            src: "",
          },
        ],
        href: "",
        src: "",
      },

      {
        type: "Frame",
        name: "HeroSection",
        content: "",

        styles: {
          width: "100%",
          minHeight: "calc(100vh - 80px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "100px 20px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          position: "relative",
        },
        tailwindStyles:
          "w-full min-h-[calc(100vh-80px)] flex items-center justify-center py-24 px-4 md:px-8 bg-gradient-to-br from-slate-900 to-slate-800 relative",
        elements: [
          {
            type: "Frame",
            name: "HeroContent",
            content: "",

            styles: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              maxWidth: "900px",
              width: "100%",
              gap: "32px",
              zIndex: "10",
            },
            tailwindStyles:
              "flex flex-col items-center text-center w-full max-w-4xl mx-auto gap-8 z-10",
            elements: [
              {
                type: "Text",
                content: "Build the Future of Web",

                styles: {
                  fontSize: "56px",
                  fontWeight: "bold",
                  color: "#f8fafc",
                  lineHeight: "1.1",
                  background:
                    "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                },
                tailwindStyles:
                  "text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-50 to-slate-300 bg-clip-text text-transparent leading-tight",
                href: "",
                src: "",
              },
              {
                type: "Text",
                content:
                  "Create stunning, modern websites with cutting-edge technology. Transform your ideas into digital experiences that captivate and convert.",

                styles: {
                  fontSize: "20px",
                  color: "#cbd5e1",
                  lineHeight: "1.6",
                  maxWidth: "700px",
                },
                tailwindStyles:
                  "text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl",
                href: "",
                src: "",
              },
              {
                type: "Frame",
                name: "HeroButtons",
                content: "",

                styles: {
                  display: "flex",
                  gap: "16px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  marginTop: "16px",
                },
                tailwindStyles:
                  "flex flex-col sm:flex-row gap-4 justify-center mt-4",
                elements: [
                  {
                    type: "Button",
                    content: "Start Building",

                    styles: {
                      backgroundColor: "#3b82f6",
                      color: "white",
                      fontWeight: "600",
                      padding: "16px 32px",
                      borderRadius: "12px",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "18px",
                      boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.4)",
                    },
                    tailwindStyles:
                      "bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25 text-lg",
                    href: "",
                    src: "",
                  },
                  {
                    type: "Button",
                    content: "View Demo",

                    styles: {
                      backgroundColor: "transparent",
                      color: "#e2e8f0",
                      fontWeight: "600",
                      padding: "16px 32px",
                      borderRadius: "12px",
                      border: "2px solid #475569",
                      cursor: "pointer",
                      fontSize: "18px",
                    },
                    tailwindStyles:
                      "bg-transparent text-slate-200 font-semibold px-8 py-4 rounded-xl border-2 border-slate-600 hover:border-slate-500 hover:bg-slate-800/50 transition-all text-lg",
                    href: "",
                    src: "",
                  },
                ],
                href: "",
                src: "",
              },
            ],
            href: "",
            src: "",
          },
          {
            type: "Frame",
            name: "BackgroundDecoration",

            content: "",

            styles: {
              position: "absolute",
              top: "20%",
              right: "10%",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
              filter: "blur(40px)",
            },
            tailwindStyles:
              "absolute top-1/4 right-1/10 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl",
            elements: [],
            href: "",
            src: "",
          },
        ],
        href: "",
        src: "",
      },

      {
        type: "Frame",
        name: "ServicesSection",
        content: "",

        styles: {
          width: "100%",
          padding: "100px 20px",
          backgroundColor: "#1e293b",
        },
        tailwindStyles: "w-full py-24 px-4 md:px-8 bg-slate-800",
        elements: [
          {
            type: "Frame",
            name: "ServicesContainer",
            content: "",

            styles: {
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "80px",
            },
            tailwindStyles: "max-w-6xl mx-auto flex flex-col gap-20",
            elements: [
              {
                type: "Frame",
                name: "ServicesHeader",
                content: "",

                styles: {
                  textAlign: "center",
                  marginBottom: "20px",
                },
                tailwindStyles: "text-center mb-16",
                elements: [
                  {
                    type: "Text",
                    content: "Our Services",

                    styles: {
                      color: "#3b82f6",
                      fontWeight: "600",
                      fontSize: "16px",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                    },
                    tailwindStyles:
                      "text-blue-500 font-semibold text-sm uppercase tracking-widest",
                    href: "",
                    src: "",
                  },
                  {
                    type: "Text",
                    content: "What We Offer",

                    styles: {
                      fontSize: "42px",
                      fontWeight: "bold",
                      color: "#f8fafc",
                      marginTop: "12px",
                    },
                    tailwindStyles:
                      "text-3xl md:text-4xl lg:text-5xl font-bold text-slate-50 mt-3",
                    href: "",
                    src: "",
                  },
                ],
                href: "",
                src: "",
              },
              {
                type: "Frame",
                name: "ServicesGrid",
                content: "",

                styles: {
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "40px",
                },
                tailwindStyles:
                  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
                elements: [
                  {
                    type: "Frame",
                    name: "ServiceCard1",
                    content: "",

                    styles: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px",
                      padding: "40px",
                      borderRadius: "16px",
                      backgroundColor: "#334155",
                      border: "1px solid #475569",
                      transition: "all 0.3s ease",
                    },
                    tailwindStyles:
                      "flex flex-col gap-6 p-8 rounded-2xl bg-slate-700 border border-slate-600 hover:bg-slate-600 hover:-translate-y-2 hover:shadow-xl transition-all group",
                    elements: [
                      {
                        type: "Image",
                        content: "🎨",

                        styles: {
                          fontSize: "48px",
                        },
                        tailwindStyles:
                          "text-4xl group-hover:scale-110 transition-transform",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content: "UI/UX Design",

                        styles: {
                          fontSize: "24px",
                          fontWeight: "600",
                          color: "#f8fafc",
                        },
                        tailwindStyles: "text-2xl font-semibold text-slate-50",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content:
                          "Create beautiful, intuitive designs that users love. From wireframes to high-fidelity prototypes.",

                        styles: {
                          fontSize: "16px",
                          color: "#cbd5e1",
                          lineHeight: "1.6",
                        },
                        tailwindStyles:
                          "text-base text-slate-300 leading-relaxed",
                        href: "",
                        src: "",
                      },
                    ],
                    href: "",
                    src: "",
                  },
                  {
                    type: "Frame",
                    name: "ServiceCard2",

                    content: "",

                    styles: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px",
                      padding: "40px",
                      borderRadius: "16px",
                      backgroundColor: "#334155",
                      border: "1px solid #475569",
                      transition: "all 0.3s ease",
                    },
                    tailwindStyles:
                      "flex flex-col gap-6 p-8 rounded-2xl bg-slate-700 border border-slate-600 hover:bg-slate-600 hover:-translate-y-2 hover:shadow-xl transition-all group",
                    elements: [
                      {
                        type: "Image",
                        content: "⚡",

                        styles: {
                          fontSize: "48px",
                        },
                        tailwindStyles:
                          "text-4xl group-hover:scale-110 transition-transform",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content: "Web Development",

                        styles: {
                          fontSize: "24px",
                          fontWeight: "600",
                          color: "#f8fafc",
                        },
                        tailwindStyles: "text-2xl font-semibold text-slate-50",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content:
                          "Build fast, scalable websites using the latest technologies and best practices for optimal performance.",

                        styles: {
                          fontSize: "16px",
                          color: "#cbd5e1",
                          lineHeight: "1.6",
                        },
                        tailwindStyles:
                          "text-base text-slate-300 leading-relaxed",
                        href: "",
                        src: "",
                      },
                    ],
                    href: "",
                    src: "",
                  },
                  {
                    type: "Frame",
                    name: "ServiceCard3",

                    content: "",

                    styles: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px",
                      padding: "40px",
                      borderRadius: "16px",
                      backgroundColor: "#334155",
                      border: "1px solid #475569",
                      transition: "all 0.3s ease",
                    },
                    tailwindStyles:
                      "flex flex-col gap-6 p-8 rounded-2xl bg-slate-700 border border-slate-600 hover:bg-slate-600 hover:-translate-y-2 hover:shadow-xl transition-all group",
                    elements: [
                      {
                        type: "Image",
                        content: "📱",

                        styles: {
                          fontSize: "48px",
                        },
                        tailwindStyles:
                          "text-4xl group-hover:scale-110 transition-transform",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content: "Mobile Apps",

                        styles: {
                          fontSize: "24px",
                          fontWeight: "600",
                          color: "#f8fafc",
                        },
                        tailwindStyles: "text-2xl font-semibold text-slate-50",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content:
                          "Develop native and cross-platform mobile applications that engage users across all devices.",

                        styles: {
                          fontSize: "16px",
                          color: "#cbd5e1",
                          lineHeight: "1.6",
                        },
                        tailwindStyles:
                          "text-base text-slate-300 leading-relaxed",
                        href: "",
                        src: "",
                      },
                    ],
                    href: "",
                    src: "",
                  },
                ],
                href: "",
                src: "",
              },
            ],
            href: "",
            src: "",
          },
        ],
        href: "",
        src: "",
      },

      {
        type: "Frame",
        name: "CommendationsSection",

        content: "",

        styles: {
          width: "100%",
          padding: "100px 20px",
          backgroundColor: "#0f172a",
        },
        tailwindStyles: "w-full py-24 px-4 md:px-8 bg-slate-900",
        elements: [
          {
            type: "Frame",
            name: "CommendationsContainer",
            content: "",

            styles: {
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "60px",
            },
            tailwindStyles: "max-w-6xl mx-auto flex flex-col gap-16",
            elements: [
              {
                type: "Frame",
                name: "CommendationsHeader",

                content: "",

                styles: {
                  textAlign: "center",
                },
                tailwindStyles: "text-center",
                elements: [
                  {
                    type: "Text",
                    content: "Client Commendations",

                    styles: {
                      fontSize: "42px",
                      fontWeight: "bold",
                      color: "#f8fafc",
                    },
                    tailwindStyles:
                      "text-3xl md:text-4xl lg:text-5xl font-bold text-slate-50",
                    href: "",
                    src: "",
                  },
                  {
                    type: "Text",
                    content: "What our clients say about working with us",

                    styles: {
                      fontSize: "18px",
                      color: "#cbd5e1",
                      marginTop: "16px",
                    },
                    tailwindStyles: "text-lg text-slate-300 mt-4",
                    href: "",
                    src: "",
                  },
                ],
                href: "",
                src: "",
              },
              {
                type: "Frame",
                name: "CommendationsGrid",
                content: "",

                styles: {
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "40px",
                },
                tailwindStyles: "grid grid-cols-1 lg:grid-cols-2 gap-8",
                elements: [
                  {
                    type: "Frame",
                    name: "CommendationCard1",
                    content: "",

                    styles: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px",
                      padding: "40px",
                      borderRadius: "16px",
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                    },
                    tailwindStyles:
                      "flex flex-col gap-6 p-8 rounded-2xl bg-slate-800 border border-slate-700",
                    elements: [
                      {
                        type: "Image",
                        content: "⭐⭐⭐⭐⭐",

                        styles: {
                          fontSize: "24px",
                        },
                        tailwindStyles: "text-xl",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content:
                          '"The team delivered an exceptional website that exceeded our expectations. Their attention to detail and technical expertise is outstanding."',

                        styles: {
                          fontSize: "18px",
                          color: "#e2e8f0",
                          lineHeight: "1.6",
                          fontStyle: "italic",
                        },
                        tailwindStyles:
                          "text-lg text-slate-200 leading-relaxed italic",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Frame",
                        name: "ClientInfo1",

                        content: "",

                        styles: {
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                        },
                        tailwindStyles: "flex items-center gap-4",
                        elements: [
                          {
                            type: "Image",
                            content: "Client Avatar",

                            styles: {
                              width: "60px",
                              height: "60px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            },
                            tailwindStyles:
                              "w-12 h-12 rounded-full object-cover",
                            href: "",
                            src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                          },
                          {
                            type: "Frame",
                            name: "ClientDetails1",

                            content: "",

                            styles: {
                              display: "flex",
                              flexDirection: "column",
                            },
                            tailwindStyles: "flex flex-col",
                            elements: [
                              {
                                type: "Text",
                                content: "John Smith",

                                styles: {
                                  fontSize: "16px",
                                  fontWeight: "600",
                                  color: "#f8fafc",
                                },
                                tailwindStyles:
                                  "text-base font-semibold text-slate-50",
                                href: "",
                                src: "",
                              },
                              {
                                type: "Text",
                                content: "CEO, TechCorp",

                                styles: {
                                  fontSize: "14px",
                                  color: "#94a3b8",
                                },
                                tailwindStyles: "text-sm text-slate-400",
                                href: "",
                                src: "",
                              },
                            ],
                            href: "",
                            src: "",
                          },
                        ],
                        href: "",
                        src: "",
                      },
                    ],
                    href: "",
                    src: "",
                  },
                  {
                    type: "Frame",
                    name: "CommendationCard2",

                    content: "",

                    styles: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px",
                      padding: "40px",
                      borderRadius: "16px",
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                    },
                    tailwindStyles:
                      "flex flex-col gap-6 p-8 rounded-2xl bg-slate-800 border border-slate-700",
                    elements: [
                      {
                        type: "Image",
                        content: "⭐⭐⭐⭐⭐",

                        styles: {
                          fontSize: "24px",
                        },
                        tailwindStyles: "text-xl",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content:
                          '"Professional, responsive, and incredibly talented. They transformed our vision into a beautiful digital reality."',

                        styles: {
                          fontSize: "18px",
                          color: "#e2e8f0",
                          lineHeight: "1.6",
                          fontStyle: "italic",
                        },
                        tailwindStyles:
                          "text-lg text-slate-200 leading-relaxed italic",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Frame",
                        name: "ClientInfo2",

                        content: "",

                        styles: {
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                        },
                        tailwindStyles: "flex items-center gap-4",
                        elements: [
                          {
                            type: "Image",
                            content: "Client Avatar",

                            styles: {
                              width: "60px",
                              height: "60px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            },
                            tailwindStyles:
                              "w-12 h-12 rounded-full object-cover",
                            href: "",
                            src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                          },
                          {
                            type: "Frame",
                            name: "ClientDetails2",

                            content: "",

                            styles: {
                              display: "flex",
                              flexDirection: "column",
                            },
                            tailwindStyles: "flex flex-col",
                            elements: [
                              {
                                type: "Text",
                                content: "Sarah Wilson",

                                styles: {
                                  fontSize: "16px",
                                  fontWeight: "600",
                                  color: "#f8fafc",
                                },
                                tailwindStyles:
                                  "text-base font-semibold text-slate-50",
                                href: "",
                                src: "",
                              },
                              {
                                type: "Text",
                                content: "Founder, StartupXYZ",

                                styles: {
                                  fontSize: "14px",
                                  color: "#94a3b8",
                                },
                                tailwindStyles: "text-sm text-slate-400",
                                href: "",
                                src: "",
                              },
                            ],
                            href: "",
                            src: "",
                          },
                        ],
                        href: "",
                        src: "",
                      },
                    ],
                    href: "",
                    src: "",
                  },
                ],
                href: "",
                src: "",
              },
            ],
            href: "",
            src: "",
          },
        ],
        href: "",
        src: "",
      },

      {
        type: "Frame",
        name: "ContactSection",

        content: "",

        styles: {
          width: "100%",
          padding: "100px 20px",
          backgroundColor: "#1e293b",
        },
        tailwindStyles: "w-full py-24 px-4 md:px-8 bg-slate-800",
        elements: [
          {
            type: "Frame",
            name: "ContactContainer",

            content: "",

            styles: {
              maxWidth: "800px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "60px",
            },
            tailwindStyles: "max-w-3xl mx-auto flex flex-col gap-16",
            elements: [
              {
                type: "Frame",
                name: "ContactHeader",

                content: "",

                styles: {
                  textAlign: "center",
                },
                tailwindStyles: "text-center",
                elements: [
                  {
                    type: "Text",
                    content: "Let's Work Together",

                    styles: {
                      fontSize: "42px",
                      fontWeight: "bold",
                      color: "#f8fafc",
                    },
                    tailwindStyles:
                      "text-3xl md:text-4xl lg:text-5xl font-bold text-slate-50",
                    href: "",
                    src: "",
                  },
                  {
                    type: "Text",
                    content:
                      "Ready to start your project? Get in touch and let's create something amazing together.",

                    styles: {
                      fontSize: "18px",
                      color: "#cbd5e1",
                      marginTop: "16px",
                    },
                    tailwindStyles: "text-lg text-slate-300 mt-4",
                    href: "",
                    src: "",
                  },
                ],
                href: "",
                src: "",
              },
              {
                type: "Frame",
                name: "ContactButtons",

                content: "",

                styles: {
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  alignItems: "center",
                },
                tailwindStyles: "flex flex-col gap-5 items-center",
                elements: [
                  {
                    type: "Button",
                    content: "Start Your Project",

                    styles: {
                      backgroundColor: "#3b82f6",
                      color: "white",
                      fontWeight: "600",
                      padding: "16px 32px",
                      borderRadius: "12px",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "18px",
                      boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.4)",
                    },
                    tailwindStyles:
                      "bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25 text-lg",
                    href: "",
                    src: "",
                  },
                  {
                    type: "Text",
                    content: "or email us at hello@modernweb.com",

                    styles: {
                      fontSize: "16px",
                      color: "#94a3b8",
                    },
                    tailwindStyles: "text-base text-slate-400",
                    href: "",
                    src: "",
                  },
                ],
                href: "",
                src: "",
              },
            ],
            href: "",
            src: "",
          },
        ],
        href: "",
        src: "",
      },

      {
        type: "Frame",
        name: "FooterSection",
        content: "",

        styles: {
          width: "100%",
          backgroundColor: "#0f172a",
          color: "#94a3b8",
          padding: "60px 20px 30px",
          borderTop: "1px solid #334155",
        },
        tailwindStyles:
          "w-full bg-slate-900 text-slate-400 py-16 px-4 md:px-8 border-t border-slate-700",
        elements: [
          {
            type: "Frame",
            name: "FooterContainer",
            content: "",

            styles: {
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "40px",
            },
            tailwindStyles: "max-w-6xl mx-auto flex flex-col gap-10",
            elements: [
              {
                type: "Frame",
                name: "FooterMain",

                content: "",

                styles: {
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "40px",
                },
                tailwindStyles: "grid grid-cols-1 md:grid-cols-3 gap-10",
                elements: [
                  {
                    type: "Frame",
                    name: "CompanyInfo",

                    content: "",

                    styles: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                      width: "450px",
                    },
                    tailwindStyles: "flex flex-col gap-5",
                    elements: [
                      {
                        type: "Frame",
                        name: "FooterLogo",

                        content: "",

                        styles: {
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        },
                        tailwindStyles: "flex items-center gap-3",
                        elements: [
                          {
                            type: "Image",
                            content: "Logo",

                            styles: {
                              height: "24px",
                              width: "auto",
                            },
                            tailwindStyles: "h-6 w-auto",
                            href: "",
                            src: "",
                          },
                        ],
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content:
                          "Creating digital experiences that inspire and engage. We transform ideas into beautiful, functional websites.",

                        styles: {
                          fontSize: "14px",
                          color: "#94a3b8",
                          lineHeight: "1.6",
                        },
                        tailwindStyles:
                          "text-sm text-slate-400 leading-relaxed",
                        href: "",
                        src: "",
                      },
                    ],
                    href: "",
                    src: "",
                  },
                  {
                    type: "Frame",
                    name: "FooterLinks1",
                    content: "",

                    styles: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    },
                    tailwindStyles: "flex flex-col gap-4",
                    elements: [
                      {
                        type: "Text",
                        content: "Quick Links",

                        styles: {
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#f8fafc",
                          marginBottom: "8px",
                        },
                        tailwindStyles:
                          "text-base font-semibold text-slate-50 mb-2",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Link",
                        content: "Services",

                        styles: {
                          fontSize: "14px",
                          color: "#94a3b8",
                        },
                        tailwindStyles:
                          "text-sm text-slate-400 hover:text-blue-400 transition-colors",
                        href: "#services",
                        src: "",
                      },
                      {
                        type: "Link",
                        content: "Portfolio",

                        styles: {
                          fontSize: "14px",
                          color: "#94a3b8",
                        },
                        tailwindStyles:
                          "text-sm text-slate-400 hover:text-blue-400 transition-colors",
                        href: "#portfolio",
                        src: "",
                      },
                      {
                        type: "Link",
                        content: "About",

                        styles: {
                          fontSize: "14px",
                          color: "#94a3b8",
                        },
                        tailwindStyles:
                          "text-sm text-slate-400 hover:text-blue-400 transition-colors",
                        href: "#about",
                        src: "",
                      },
                    ],
                    href: "",
                    src: "",
                  },
                  {
                    type: "Frame",
                    name: "ContactInfo",

                    content: "",

                    styles: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    },
                    tailwindStyles: "flex flex-col gap-4",
                    elements: [
                      {
                        type: "Text",
                        content: "Get in Touch",

                        styles: {
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#f8fafc",
                          marginBottom: "8px",
                        },
                        tailwindStyles:
                          "text-base font-semibold text-slate-50 mb-2",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content: "hello@modernweb.com",

                        styles: {
                          fontSize: "14px",
                          color: "#94a3b8",
                        },
                        tailwindStyles: "text-sm text-slate-400",
                        href: "",
                        src: "",
                      },
                      {
                        type: "Text",
                        content: "+1 (555) 123-4567",

                        styles: {
                          fontSize: "14px",
                          color: "#94a3b8",
                        },
                        tailwindStyles: "text-sm text-slate-400",
                        href: "",
                        src: "",
                      },
                    ],
                    href: "",
                    src: "",
                  },
                ],
                href: "",
                src: "",
              },
              {
                type: "Frame",
                name: "FooterBottom",

                content: "",

                styles: {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid #334155",
                  paddingTop: "30px",
                  flexWrap: "wrap",
                  gap: "20px",
                },
                tailwindStyles:
                  "flex flex-col md:flex-row justify-between items-center border-t border-slate-700 pt-8 gap-4",
                elements: [
                  {
                    type: "Image",
                    content: "Logo",
                    src: "",

                    styles: {
                      height: "24px",
                      width: "auto",
                    },
                    tailwindStyles: "h-6 w-auto",
                    href: "",
                  },
                  {
                    type: "Frame",
                    name: "SocialLinks",

                    content: "",

                    styles: {
                      display: "flex",
                      gap: "20px",
                    },
                    tailwindStyles: "flex gap-5",
                    elements: [
                      {
                        type: "Link",
                        content: "Twitter",

                        styles: {
                          fontSize: "14px",
                          color: "#64748b",
                        },
                        tailwindStyles:
                          "text-sm text-slate-500 hover:text-blue-400 transition-colors",
                        href: "#",
                        src: "",
                      },
                      {
                        type: "Link",
                        content: "LinkedIn",

                        styles: {
                          fontSize: "14px",
                          color: "#64748b",
                        },
                        tailwindStyles:
                          "text-sm text-slate-500 hover:text-blue-400 transition-colors",
                        href: "#",
                        src: "",
                      },
                      {
                        type: "Link",
                        content: "GitHub",

                        styles: {
                          fontSize: "14px",
                          color: "#64748b",
                        },
                        tailwindStyles:
                          "text-sm text-slate-500 hover:text-blue-400 transition-colors",
                        href: "#",
                        src: "",
                      },
                    ],
                    href: "",
                    src: "",
                  },
                ],
                href: "",
                src: "",
              },
            ],
            href: "",
            src: "",
          },
        ],
        href: "",
        src: "",
      },
    ],
    href: "",
    src: "",
  },
};
