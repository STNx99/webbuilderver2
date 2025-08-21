import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { PlusIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion';

const items = [
  {
    id: '1',
    title: 'What is WebBuilder and who is it for?',
    content:
      'WebBuilder is a modern visual builder for React and Next.js apps. It lets you create web pages by dragging and dropping prebuilt, customizable components—no coding required. It’s perfect for developers, startups, and teams who want to build and ship faster.',
  },
  {
    id: '2',
    title: 'Can I export the code for my project?',
    content:
      'Yes! With WebBuilder, you can export clean, production-ready React/Next.js code for any project you create. There’s no vendor lock-in—take your code anywhere and continue development in your own workflow.',
  },
  {
    id: '3',
    title: 'How does the drag-and-drop builder work?',
    content:
      'Simply select from our library of prebuilt, customizable components and drag them onto your canvas. Arrange, configure, and preview your layout in real time—no manual coding required.',
  },
  {
    id: '4',
    title: 'Are the components customizable?',
    content:
      'Absolutely. All components are built with Tailwind CSS and can be customized visually or by editing the exported code. You can adjust styles, layouts, and even extend functionality as needed.',
  },
  {
    id: '5',
    title: 'Is WebBuilder free to use?',
    content:
      'WebBuilder offers a free tier for personal and hobby projects. For advanced features and unlimited exports, check out our Pro and Enterprise plans.',
  },
];

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 * index,
      duration: 0.4,
    },
  }),
};

export default function LandingPageFAQ() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <motion.h2
            className="mb-4 text-3xl font-bold tracking-tight md:text-4xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Frequently Asked{' '}
            <span className="from-primary bg-gradient-to-r to-rose-400 bg-clip-text text-transparent">
              Questions
            </span>
          </motion.h2>
          <motion.p
            className="text-muted-foreground mx-auto max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Everything you need to know about WebBuilder’s drag-and-drop builder, code export, and prebuilt components to help you launch your next project quickly.
          </motion.p>
        </div>

        <motion.div
          className="relative mx-auto max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Decorative gradient */}
          <div className="bg-primary/10 absolute -top-4 -left-4 -z-10 h-72 w-72 rounded-full blur-3xl" />
          <div className="bg-primary/10 absolute -right-4 -bottom-4 -z-10 h-72 w-72 rounded-full blur-3xl" />

          <Accordion
            type="single"
            collapsible
            className="border-border/40 bg-card/30 w-full rounded-xl border p-2 backdrop-blur-sm"
            defaultValue="1"
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                custom={index}
                variants={fadeInAnimationVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <AccordionItem
                  value={item.id}
                  className={cn(
                    'bg-card/50 my-1 overflow-hidden rounded-lg border-none px-2 shadow-sm transition-all',
                    'data-[state=open]:bg-card/80 data-[state=open]:shadow-md',
                  )}
                >
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger
                      className={cn(
                        'group flex flex-1 items-center justify-between gap-4 py-4 text-left text-base font-medium',
                        'hover:text-primary transition-all duration-300 outline-none',
                        'focus-visible:ring-primary/50 focus-visible:ring-2',
                        'data-[state=open]:text-primary',
                      )}
                    >
                      {item.title}
                      <PlusIcon
                        size={18}
                        className={cn(
                          'text-primary/70 shrink-0 transition-transform duration-300 ease-out',
                          'group-data-[state=open]:rotate-45',
                        )}
                        aria-hidden="true"
                      />
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent
                    className={cn(
                      'text-muted-foreground overflow-hidden pt-0 pb-4',
                      'data-[state=open]:animate-accordion-down',
                      'data-[state=closed]:animate-accordion-up',
                    )}
                  >
                    <div className="border-border/30 border-t pt-3">
                      {item.content}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
