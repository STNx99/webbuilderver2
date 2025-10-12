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
    title: 'Drag & Drop Builder',
    desc: 'Create websites visually with our intuitive drag-and-drop interface. No coding knowledge required.',
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: 'Pre-built Components',
    desc: 'Choose from hundreds of professionally designed components. Headers, footers, forms, and more.',
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: 'Clean Code Export',
    desc: 'Export production-ready React/Next.js code. No vendor lock-in - take your code anywhere.',
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: 'Mobile Responsive',
    desc: 'All designs automatically adapt to mobile, tablet, and desktop. Perfect on every device.',
  },
  {
    icon: <Search className="h-6 w-6" />,
    title: 'SEO Optimized',
    desc: 'Built-in SEO tools ensure your website ranks well on search engines from day one.',
  },
  {
    icon: <Rocket className="h-6 w-6" />,
    title: 'Fast Publishing',
    desc: 'Publish your website instantly or export code to deploy anywhere. Go live in minutes.',
  },
];
export default function LandingPageFeature() {
  return (
    <section className="relative py-14">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="relative mx-auto max-w-2xl sm:text-center">
          <div className="relative z-10">
            <h3 className="font-geist mt-4 text-3xl font-normal tracking-tighter sm:text-4xl md:text-5xl">
              Everything you need to build amazing websites
            </h3>
            <p className="font-geist text-foreground/60 mt-3">
                WebBuilder provides all the tools you need to create professional websites 
                without writing a single line of code. Design, customize, and publish with ease.
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
