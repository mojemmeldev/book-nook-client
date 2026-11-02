"use client";

import Image from "next/image";
import Link from "next/link";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/** Banner slides — swap the images/text for your own content any time. */
const slides = [
  {
    id: "discover",
    title: "Find Your Next Favorite Book",
    text: "Browse hundreds of titles across fiction, science, history and more — all in one quiet little library.",
    image: "https://picsum.photos/seed/booknook-hero-1/1600/700",
  },
  {
    id: "borrow",
    title: "Borrow in a Few Clicks",
    text: "Pick a book, choose how many days you need it for, and it is yours. No queues, no paperwork.",
    image: "https://picsum.photos/seed/booknook-hero-2/1600/700",
  },
  {
    id: "arrivals",
    title: "Fresh Reads Every Week",
    text: "Our shelves grow every week with brand new arrivals. Check back often for your next read.",
    image: "https://picsum.photos/seed/booknook-hero-3/1600/700",
  },
];

export function HeroSlider() {
  return (
    <section aria-label="Featured" className="border-b">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        slidesPerView={1}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        className="h-[400px] w-full sm:h-[480px] [&_.swiper-button-next]:text-white [&_.swiper-button-prev]:text-white [&_.swiper-pagination-bullet-active]:bg-white [&_.swiper-pagination-bullet]:bg-white/50"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              <Image
                src={slide.image}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
              {/* Dark overlay so the text stays readable on any photo */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/25" />

              <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-4 sm:px-6">
                <h1 className="max-w-xl text-3xl font-bold text-white sm:text-5xl">
                  {slide.title}
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
                  {slide.text}
                </p>
                <Link
                  href="/all-books"
                  className="mt-7 inline-flex w-fit items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/90"
                >
                  Browse Books
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
