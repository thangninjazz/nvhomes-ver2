"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";

interface Project {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  tags: string;
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data.slice(0, 4));
      } catch (error) {
        console.error("Lỗi fetch dự án:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-24 lg:py-32 bg-stone-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-red-500 mb-4 font-bold">Dự án chọn lọc</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stone-900 leading-tight">
              Dấu Ấn <span className="italic font-light">Kiến Trúc</span>
            </h2>
          </div>
          <Link 
            href="/projects" 
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-full px-8 py-6 group border-stone-200 text-stone-900 hover:bg-stone-900 hover:text-white transition-all"
            )}
          >
            Xem tất cả dự án
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[16/10] bg-stone-200 animate-pulse rounded-3xl" />
            ))
          ) : projects.length > 0 ? (
            projects.map((project, index) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group relative block"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] bg-stone-200 shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                  <Image
                    src={project.thumbnail || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/40 transition-colors duration-500" />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-8 lg:p-10 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <div className="flex items-end justify-between">
                      <div className="text-white">
                        <p className="text-xs tracking-[0.3em] uppercase mb-2 font-bold text-white/70">
                          {project.tags?.split(',')[0] || "Luxury Interior"}
                        </p>
                        <h3 className="font-serif text-2xl lg:text-3xl uppercase leading-tight">
                          {project.title}
                        </h3>
                      </div>
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-stone-900 shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                        <ArrowUpRight className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-24 text-center border-2 border-dashed border-stone-200 rounded-[2.5rem] bg-white">
               <p className="text-stone-400 italic">Chưa có dự án nào được cập nhật.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
