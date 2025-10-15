import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function MarketplaceHero() {
  return (
    <section className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Build Faster with Templates</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-balance">
            Browse professional website templates, sections, and blocks. Start building your next project in minutes.
          </p>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search landing pages, sections, blocks..."
              className="pl-12 h-12 text-base bg-card"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
