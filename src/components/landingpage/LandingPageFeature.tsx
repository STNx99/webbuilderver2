import {
  Palette,
  Sparkles,
  Search,
  Smartphone,
  Code,
  Rocket,
} from 'lucide-react';

const features = [
  {
    icon: <Palette className="h-6 w-6" />,
    title: 'One-Message Theme Changes',
    desc: 'Switch from light to dark or any theme instantly with a simple prompt. No config files, no settings panels.',
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: 'Smooth Natural Animations',
    desc: 'Everything fades, slides, and shifts in ways that feel right. Nothing jerky or overdone.',
  },
  {
    icon: <Search className="h-6 w-6" />,
    title: 'Built-in SEO Tools',
    desc: 'Get found on Google with our integrated SEO optimization tools and real-time analytics.',
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: 'Mobile-Ready Without Effort',
    desc: 'Looks stunning on phones and tablets out of the box. Responsive design that just works.',
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: 'Quick Start, Easy Edit',
    desc: "Make it your own in minutes. Clean code that doesn't fall apart when you customize it.",
  },
  {
    icon: <Rocket className="h-6 w-6" />,
    title: 'Lightning Fast Performance',
    desc: 'Optimized for speed with under 2-second load times and smooth 60fps animations.',
  },
];
export default function LandingPageFeature() {
  return (
    <section className="relative py-14">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="relative mx-auto max-w-2xl sm:text-center">
          <div className="relative z-10">
            <h3 className="font-geist mt-4 text-3xl font-normal tracking-tighter sm:text-4xl md:text-5xl">
              Let’s help build your next project
            </h3>
            <p className="font-geist text-foreground/60 mt-3">
                A modern UI component library designed to help developers create
                stunning web applications with minimal effort. Fully customizable,
                responsive, and accessible.
            </p>
          </div>
          <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px] bg-gradient-to-br from-primary/20 via-primary/30 to-primary/10"
          ></div>
        </div>
        <hr className="bg-foreground/30 mx-auto mt-5 h-px w-1/2" />
        <div className="relative mt-12">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item, idx) => {
              // Assign a unique gradient for each feature
              const gradients = [
                "bg-gradient-to-br from-purple-500/20 via-pink-500/30 to-pink-500/10",
                "bg-gradient-to-br from-blue-500/20 via-cyan-500/30 to-blue-500/10",
                "bg-gradient-to-br from-green-500/20 via-emerald-500/30 to-green-500/10",
                "bg-gradient-to-br from-orange-500/20 via-red-500/30 to-orange-500/10",
                "bg-gradient-to-br from-indigo-500/20 via-purple-500/30 to-indigo-500/10",
                "bg-gradient-to-br from-yellow-500/20 via-orange-500/30 to-yellow-500/10",
              ];
              return (
                <li
                  key={idx}
                  className="transform-gpu space-y-3 rounded-xl border bg-transparent p-4"
                >
                  <div
                    className={`w-fit transform-gpu rounded-full border p-4 ${gradients[idx % gradients.length]}`}
                  >
                    {item.icon}
                  </div>
                  <h4 className="font-geist text-lg font-bold tracking-tighter">
                    {item.title}
                  </h4>
                  <p className="text-gray-500">{item.desc}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
