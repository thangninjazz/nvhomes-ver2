"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/services/api"

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  tags: string;
}

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState("Tất cả")
  const [projects, setProjects] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>(["Tất cả"])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch cả projects và categories song song
        const [projectsRes, categoriesRes] = await Promise.all([
          api.get('/projects'),
          api.get('/categories?type=Project')
        ]);

        const dbCategories = categoriesRes.data
          .filter((c: any) => c.parentId === null)
          .map((c: any) => c.name);
        
        const getPriority = (name: string) => {
          const lower = (name || "").toLowerCase();
          if (lower === "tủ bếp" || lower.includes("tủ bếp")) return 10;
          if (lower.includes("inox acrylic")) return 11;
          if (lower.includes("nhựa acrylic")) return 12;
          if (lower.includes("inox cánh kính")) return 13;
          return 99;
        };

        const sortedCategories = dbCategories.sort((a: string, b: string) => getPriority(a) - getPriority(b));
        const allCategories = ["Tất cả", ...sortedCategories];
        setCategories(allCategories);

        const mapped = projectsRes.data.map((p: any, idx: number) => {
          const actualCategory = p.categoryName || (p.tags?.split(',')[0]?.trim()) || "Khác";
          const matchedCategory = allCategories.find(c => c.toLowerCase() === actualCategory.toLowerCase()) || actualCategory;
          
          return {
            id: p.id,
            title: p.title,
            category: matchedCategory,
            location: "Việt Nam",
            image: p.thumbnail || `https://images.unsplash.com/photo-${[
              "1618221195710-dd6b41faaea6", 
              "1618219944342-824e40a13c05", 
              "1615874959474-d609969a20ed", 
              "1600607687920-4e2a09cf159d"  
            ][idx % 4]}?q=80&w=1200`,
            area: "Cao cấp",
            slug: p.slug,
            tags: p.tags,
            createdAt: p.createdAt || new Date().toISOString()
          };
        });

        mapped.sort((a: any, b: any) => {
          const aText = (a.category + " " + a.title + " " + (a.tags || "")).toLowerCase();
          const bText = (b.category + " " + b.title + " " + (b.tags || "")).toLowerCase();
          const pDiff = getPriority(aText) - getPriority(bText);
          if (pDiff !== 0) return pDiff;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        setProjects(mapped)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredProjects = activeCategory === "Tất cả" 
    ? projects 
    : projects.filter(p => p.category === activeCategory)

  return (
    <section id="projects" className="py-24 lg:py-32 bg-secondary">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-accent mb-4">Dự án thi công</p>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-balance">
              Dấu Ấn Kiến Trúc
            </h2>
          </div>
          <Link href="/projects">
            <Button variant="outline" className="rounded-none self-start lg:self-auto group">
              Xem tất cả dự án
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Category Filter - Premium Redesign */}
        <div className="flex flex-wrap gap-2 md:gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2 px-6 py-3 text-[11px] md:text-xs font-black uppercase tracking-widest transition-all duration-500 rounded-full border ${
                activeCategory === cat 
                  ? "bg-stone-900 text-white border-stone-900 shadow-xl scale-105" 
                  : "bg-white/50 backdrop-blur-sm text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-900 hover:bg-white"
              }`}
            >
              {activeCategory === cat && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {filteredProjects.map((project, index) => (
            <Link 
              key={project.id} 
              href={`/projects/${project.slug}`}
              className={`group block ${index === 0 ? "md:row-span-2" : ""}`}
            >
              <div className={`relative overflow-hidden bg-muted ${index === 0 ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-500" />
                
                {/* Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 bg-gradient-to-t from-foreground/80 to-transparent">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs tracking-widest uppercase text-background/70 mb-2">{project.category}</p>
                      <h3 className="font-serif text-xl lg:text-2xl text-background mb-1">{project.title}</h3>
                      <p className="text-sm text-background/80">{project.location} • {project.area}</p>
                    </div>
                    <div className="w-12 h-12 bg-background/10 backdrop-blur flex items-center justify-center group-hover:bg-accent transition-colors duration-300">
                      <ArrowUpRight className="w-5 h-5 text-background" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
