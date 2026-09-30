import React, { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import { GalleryImage } from '../types';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Download, Calendar, Tag } from 'lucide-react';

export const EventGallerySection: React.FC = () => {
  const { gallery } = usePortal();
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Get distinct months & categories
  const months = Array.from(new Set(gallery.map((g) => g.monthYear)));
  const categories = Array.from(new Set(gallery.map((g) => g.category)));

  const filteredImages = gallery.filter((img) => {
    const matchesMonth = selectedMonth === 'all' || img.monthYear === selectedMonth;
    const matchesCategory = selectedCategory === 'all' || img.category === selectedCategory;
    return matchesMonth && matchesCategory;
  });

  const activeImage: GalleryImage | null =
    activeLightboxIndex !== null && filteredImages[activeLightboxIndex]
      ? filteredImages[activeLightboxIndex]
      : null;

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') setActiveLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % filteredImages.length : null
        );
      }
      if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : null
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, filteredImages.length]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest">
            <ImageIcon className="w-4 h-4" />
            Visual Documentation
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display mt-0.5">
            Event Gallery & Award Ceremonies
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Photographic records of monthly plaque presentations, clinical grand rounds, and hospital celebrations.
          </p>
        </div>

        {/* Filter Bar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Month selector */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setSelectedMonth('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedMonth === 'all'
                  ? 'bg-white text-slate-950 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Months
            </button>
            {months.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedMonth === m
                    ? 'bg-white text-slate-950 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-slate-900/10"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredImages.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500">
          <p className="text-sm">No photos found for the selected filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              onClick={() => setActiveLightboxIndex(index)}
              className="group relative bg-slate-900 rounded-xl overflow-hidden aspect-4/3 cursor-pointer shadow-xs hover:shadow-lg transition-all"
            >
              <img
                src={image.imageUrl}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                <span className="text-[10px] text-amber-300 font-medium block">
                  {image.category} · {image.monthYear}
                </span>
                <p className="text-xs font-semibold text-white line-clamp-1 leading-snug">
                  {image.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation previous */}
          <button
            onClick={() =>
              setActiveLightboxIndex((prev) =>
                prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : null
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-10 hidden sm:block"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Navigation next */}
          <button
            onClick={() =>
              setActiveLightboxIndex((prev) =>
                prev !== null ? (prev + 1) % filteredImages.length : null
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-10 hidden sm:block"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Image & Caption Container */}
          <div className="max-w-4xl w-full flex flex-col items-center">
            <div className="relative max-h-[75vh] rounded-lg overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={activeImage.imageUrl}
                alt={activeImage.title}
                className="max-h-[75vh] w-auto object-contain mx-auto"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="mt-4 text-center max-w-2xl text-white">
              <h3 className="text-base sm:text-lg font-bold">{activeImage.title}</h3>
              <div className="flex items-center justify-center gap-4 text-xs text-slate-300 mt-1 font-medium">
                <span>{activeImage.category}</span>
                <span>·</span>
                <span>{activeImage.monthYear}</span>
                <span>·</span>
                <span>
                  Photo {activeLightboxIndex! + 1} of {filteredImages.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
