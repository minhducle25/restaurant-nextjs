"use client";

import { useState, useSyncExternalStore } from "react";
import {
  Heart,
  Star,
  Share2,
  ChevronUp,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { DishListResType } from "@/schemaValidations/dish.schema";
import { formatCurrency } from "@/lib/utils";
import { DishStatus } from "@/constants/type";
import NavItems from "@/app/[locale]/(public)/nav-items";
import { SwitchLanguage } from "@/components/switch-language";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

type DishItem = DishListResType["data"][number];

// Hardcode placeholder rating dựa theo id để nhất quán
const getRating = (id: number) => {
  const ratings = [4.5, 4.6, 4.7, 4.8, 4.9, 5.0];
  return ratings[id % ratings.length];
};

export default function MenuTikTok({
  dishList,
}: {
  dishList: DishListResType["data"];
}) {
  const t = useTranslations("GuestMenu");
  const tf = useTranslations("Footer");
  const locale = useLocale();
  const [likedItems, setLikedItems] = useState<Record<number, boolean>>({});
  const [themeMode, setThemeMode] = useState<"dark" | "light" | "system">(
    "system"
  );
  const [copied, setCopied] = useState<number | null>(null);

  // Subscribe to system color scheme preference (React 18 pattern)
  const systemDark = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
    () => true // SSR snapshot
  );

  const isDark =
    themeMode === "system" ? systemDark : themeMode === "dark";

  const toggleLike = (id: number) => {
    setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = (dish: DishItem) => {
    const url = window.location.href;
    navigator.clipboard.writeText(`${dish.name} - ${url}`).then(() => {
      setCopied(dish.id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden font-sans transition-colors duration-500 ${
        isDark ? "bg-black text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 px-4 md:px-6 py-3 flex items-center justify-between bg-linear-to-b from-black/80 to-transparent pointer-events-none">
        {/* Left: Logo + Nav links */}
        <div className="flex items-center gap-4 md:gap-8 pointer-events-auto">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-linear-to-tr from-orange-600 to-orange-400 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-[0_0_15px_rgba(249,115,22,0.5)] hover:scale-105 transition-transform">
              BB
            </div>
            <span className="text-white text-xl font-black tracking-tight drop-shadow-md hidden sm:block">
              Big Boy
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-5 text-sm font-semibold text-slate-200">
            <NavItems className="hover:text-orange-400 transition-colors drop-shadow-sm" />
          </div>
        </div>

        {/* Right: Language + Theme */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <SwitchLanguage />
          <div className="flex items-center p-1 rounded-full border bg-white/10 border-white/20 shadow-lg backdrop-blur-md">
            <button
              onClick={() => setThemeMode("light")}
              className={`p-1.5 rounded-full transition-all ${
                themeMode === "light"
                  ? "bg-orange-500 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Light Mode"
            >
              <Sun size={14} />
            </button>
            <button
              onClick={() => setThemeMode("system")}
              className={`p-1.5 rounded-full transition-all ${
                themeMode === "system"
                  ? "bg-slate-700 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
              title="System Mode"
            >
              <Monitor size={14} />
            </button>
            <button
              onClick={() => setThemeMode("dark")}
              className={`p-1.5 rounded-full transition-all ${
                themeMode === "dark"
                  ? "bg-slate-800 text-white shadow-md border border-slate-600"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Dark Mode"
            >
              <Moon size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* Scroll hint */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center animate-pulse pointer-events-none ${
          isDark ? "text-white/60" : "text-slate-900/60"
        }`}
      >
        <span className="text-xs uppercase tracking-widest font-semibold mb-1 drop-shadow-md">
          {t("swipe")}
        </span>
        <ChevronUp size={24} className="drop-shadow-md" />
      </div>

      {/* SNAP SCROLL CONTAINER */}
      <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar relative z-0">
        {dishList.map((dish) => (
          <div
            key={dish.id}
            className="h-screen w-full snap-start relative group"
          >
            {/* Background image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dish.image}
              alt={dish.name}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />

            {/* Gradient overlay — luôn dùng dark overlay để ảnh không bị chóa */}
            <div className="absolute inset-0 z-10 bg-linear-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 z-10 bg-linear-to-r from-black/70 via-transparent to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-12 pb-24 md:pb-20">
              <div className="flex justify-between items-end w-full max-w-7xl mx-auto">
                {/* Left: dish info */}
                <div className="w-[75%] md:w-1/2 pr-4">
                  {/* Status badge */}
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full mb-4 inline-block shadow-md backdrop-blur-sm ${
                      dish.status === DishStatus.Available
                        ? isDark
                          ? "bg-orange-500/90 text-white"
                          : "bg-orange-100 text-orange-700 border border-orange-200"
                        : isDark
                        ? "bg-red-600/80 text-white"
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                  >
                    {dish.status === DishStatus.Available
                      ? t("available")
                      : dish.status === DishStatus.Unavailable
                      ? t("outOfStock")
                      : t("hidden")}
                  </span>

                  <h2 className="text-4xl md:text-6xl font-extrabold mb-2 leading-tight text-white drop-shadow-lg">
                    {dish.name}
                  </h2>

                  <p className="text-base md:text-lg mb-4 line-clamp-3 text-slate-200 drop-shadow-md">
                    {dish.description}
                  </p>

                  <div className="text-3xl md:text-5xl font-black drop-shadow-md text-orange-400">
                    {formatCurrency(dish.price)}
                  </div>
                </div>

                {/* Right: action buttons (TikTok style) */}
                <div className="flex flex-col items-center gap-6 pb-4">
                  {/* Like */}
                  <button
                    onClick={() => toggleLike(dish.id)}
                    className="flex flex-col items-center group/btn"
                  >
                    <div className="w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-sm bg-black/40 group-hover/btn:bg-black/60">
                      <Heart
                        size={24}
                        className={`transition-colors duration-300 ${
                          likedItems[dish.id]
                            ? "fill-red-500 text-red-500"
                            : "text-white"
                        }`}
                      />
                    </div>
                    <span className="text-xs font-semibold mt-1 drop-shadow-md text-white">
                      {likedItems[dish.id] ? t("liked") : t("like")}
                    </span>
                  </button>

                  {/* Rating (placeholder) */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center shadow-sm bg-black/40">
                      <Star
                        size={24}
                        className="text-yellow-500 fill-yellow-500"
                      />
                    </div>
                    <span className="text-xs font-semibold mt-1 drop-shadow-md text-white">
                      {getRating(dish.id)}
                    </span>
                  </div>

                  {/* Share */}
                  <button
                    onClick={() => handleShare(dish)}
                    className="flex flex-col items-center group/btn"
                  >
                    <div className="w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-sm bg-black/40 group-hover/btn:bg-black/60">
                      <Share2 size={22} className="text-white" />
                    </div>
                    <span className="text-xs font-semibold mt-1 drop-shadow-md text-white">
                      {copied === dish.id ? t("copied") : t("share")}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* FOOTER SLIDE */}
        <div className="h-screen w-full snap-start relative flex flex-col items-center justify-center px-6 bg-black">
          {/* Subtle radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.12)_0%,transparent_70%)] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-md">
            {/* Logo */}
            <div className="w-20 h-20 bg-linear-to-tr from-orange-600 to-orange-400 rounded-2xl flex items-center justify-center text-white font-extrabold text-3xl shadow-[0_0_40px_rgba(249,115,22,0.5)]">
              BB
            </div>

            <div>
              <p className="text-3xl font-black text-white tracking-tight">Big Boy</p>
              <p className="text-sm text-slate-400 mt-1">
                {locale === 'vi' ? 'Vị ngon, trọn khoảnh khắc' : 'Delicious food, unforgettable experience'}
              </p>
            </div>

            {/* Links */}
            <nav className="flex flex-wrap justify-center gap-6 text-sm font-semibold">
              <Link href='/about' className="text-slate-400 hover:text-orange-400 transition-colors">
                {tf('about')}
              </Link>
              <Link href='/terms' className="text-slate-400 hover:text-orange-400 transition-colors">
                {tf('terms')}
              </Link>
              <Link href='/privacy' className="text-slate-400 hover:text-orange-400 transition-colors">
                {tf('privacy')}
              </Link>
            </nav>

            <p className="text-xs text-slate-600">
              {tf('rights', { year: new Date().getFullYear() })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
