"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

const heroSlides = [
  { tag: "the dining room", g: "from-stone-300 via-amber-100 to-stone-200" },
  { tag: "amuse-bouche", g: "from-emerald-100 via-stone-100 to-stone-300" },
  { tag: "the chef's table", g: "from-amber-200 via-stone-200 to-stone-400" },
];

export default function RestaurantHome() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((s, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ opacity: i === slide ? 1 : 0 }}
            transition={{ duration: 1.2, ease }}
            className="absolute inset-0"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${s.g}`} />
            <div className="absolute inset-0 bg-stone-900/15" />
          </motion.div>
        ))}

        <div className="relative h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease }}
            className="text-center px-6"
          >
            <h1 className="text-7xl md:text-[10rem] leading-[0.95] font-light tracking-[-0.02em] text-stone-50">
              Maison
              <br />
              <em className="not-italic font-normal">Noir</em>
            </h1>
            <p
              className="mt-8 text-[11px] tracking-[0.5em] uppercase text-stone-50/80"
              style={{ fontFamily: "system-ui" }}
            >
              Seoul · Est. 2018
            </p>
          </motion.div>
        </div>

        <div
          className="absolute bottom-10 left-10 text-[11px] tracking-[0.3em] uppercase text-stone-50/80"
          style={{ fontFamily: "system-ui" }}
        >
          {heroSlides[slide].tag}
        </div>
        <div className="absolute bottom-10 right-10 flex gap-1.5">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`w-6 h-px transition ${i === slide ? "bg-stone-50" : "bg-stone-50/30"}`}
            />
          ))}
        </div>
      </section>

      {/* Welcome */}
      <section className="max-w-3xl mx-auto px-6 py-32 md:py-40 text-center">
        <p
          className="text-[10px] tracking-[0.4em] uppercase text-stone-500 mb-10"
          style={{ fontFamily: "system-ui" }}
        >
          Welcome
        </p>
        <p className="text-2xl md:text-4xl leading-[1.5] font-light">
          Maison Noir is a fine dining restaurant in the heart of Hannam-dong,
          offering a contemporary French tasting menu rooted in seasonal Korean produce.
        </p>
        <p
          className="mt-12 text-base md:text-lg text-stone-600 leading-relaxed"
          style={{ fontFamily: "system-ui" }}
        >
          Founded in 2018 by chef Doyun Kim, Maison Noir was awarded its first Michelin
          star in 2021 and has been recognized on the Asia&apos;s 50 Best Restaurants list since 2022.
        </p>
      </section>

      {/* Photo grid */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-12 gap-3 md:gap-4">
        {[
          { c: "col-span-7 aspect-[4/3]", g: "from-stone-200 via-amber-50 to-stone-300" },
          { c: "col-span-5 aspect-[3/4]", g: "from-emerald-50 via-stone-100 to-stone-300" },
          { c: "col-span-5 aspect-[3/4]", g: "from-amber-50 via-stone-100 to-amber-200" },
          { c: "col-span-7 aspect-[4/3]", g: "from-stone-100 via-stone-300 to-stone-500" },
        ].map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: i * 0.08, ease }}
            className={`${it.c} bg-gradient-to-br ${it.g} relative overflow-hidden`}
          />
        ))}
      </section>

      {/* CTA strip */}
      <section className="max-w-3xl mx-auto px-6 py-32 text-center">
        <p
          className="text-[10px] tracking-[0.4em] uppercase text-stone-500 mb-6"
          style={{ fontFamily: "system-ui" }}
        >
          Discover
        </p>
        <h2 className="text-4xl md:text-6xl font-light italic mb-10">Begin a story.</h2>
        <div
          className="flex flex-col md:flex-row items-center justify-center gap-4"
          style={{ fontFamily: "system-ui" }}
        >
          <Link
            href="/demo/restaurant/menu"
            className="inline-flex items-center h-12 px-8 border border-stone-900 text-xs tracking-[0.3em] uppercase hover:bg-stone-900 hover:text-stone-50 transition-all"
          >
            View Menu
          </Link>
          <Link
            href="/demo/restaurant/reservations"
            className="inline-flex items-center h-12 px-8 bg-stone-900 text-stone-50 text-xs tracking-[0.3em] uppercase hover:bg-stone-700 transition-all"
          >
            Reserve a Table
          </Link>
        </div>
      </section>

      {/* Press */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <p
          className="text-[10px] tracking-[0.4em] uppercase text-stone-500 mb-12"
          style={{ fontFamily: "system-ui" }}
        >
          Press
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 items-center">
          {["MICHELIN", "Asia 50 Best", "Forbes", "GQ Korea"].map((p) => (
            <div key={p} className="text-xl md:text-2xl text-stone-400">
              {p}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
