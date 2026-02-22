"use client";
import { useGetDishList } from "@/queries/useDish";
import { cn, formatCurrency, handleErrorApi } from "@/lib/utils";
import { useState } from "react";
import { GuestCreateOrdersBodyType } from "@/schemaValidations/guest.schema";
import { useGuestOrderMutation } from "@/queries/useGuest";
import { useRouter } from "next/navigation";
import { DishStatus } from "@/constants/type";
import { useTranslations } from "next-intl";
import { Heart, Star, ChevronUp, Plus, Minus } from "lucide-react";

const getRating = (id: number) => {
  const ratings = [4.5, 4.6, 4.7, 4.8, 4.9, 5.0];
  return ratings[id % ratings.length];
};

export default function MenuOrder() {
  const t = useTranslations("GuestMenu");
  const { data } = useGetDishList();
  const dishes = data?.payload.data ?? [];
  const [orders, setOrder] = useState<GuestCreateOrdersBodyType>([]);
  const [likedItems, setLikedItems] = useState<Record<number, boolean>>({});
  const router = useRouter();
  const { mutateAsync } = useGuestOrderMutation();

  const totalPrice = dishes.reduce((result, dish) => {
    const order = orders.find((o) => o.dishId === dish.id);
    if (!order) return result;
    return result + order.quantity * dish.price;
  }, 0);

  const totalItems = orders.reduce((sum, o) => sum + o.quantity, 0);

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrder((prevOrders) => {
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId);
      }
      const index = prevOrders.findIndex((order) => order.dishId === dishId);
      if (index === -1) {
        return [...prevOrders, { dishId, quantity }];
      }
      const newOrders = [...prevOrders];
      newOrders[index] = { ...newOrders[index], quantity };
      return newOrders;
    });
  };
  console.log(orders);

  const handleOrder = async () => {
    try {
      await mutateAsync(orders);
      router.push(`/guest/orders/`);
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const visibleDishes = dishes.filter((dish) => dish.status !== DishStatus.Hidden);

  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slide-up { from { transform: translate(-50%, 100%); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
        .slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* Scroll hint */}
      {totalItems === 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center animate-pulse pointer-events-none text-white/60">
          <span className="text-xs uppercase tracking-widest font-semibold mb-1 drop-shadow-md">{t("swipe")}</span>
          <ChevronUp size={24} className="drop-shadow-md" />
        </div>
      )}

      {/* Floating order bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md p-4 rounded-2xl shadow-2xl flex items-center justify-between backdrop-blur-xl border slide-up bg-[#1a2035]/90 border-slate-700">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-300">{t("placeOrder", { count: totalItems })}</span>
            <span className="text-xl font-bold text-orange-400">{formatCurrency(totalPrice)}</span>
          </div>
          <button
            onClick={handleOrder}
            disabled={orders.length === 0}
            className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-[0_4px_15px_rgba(249,115,22,0.4)] transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {t("orderNow")}
          </button>
        </div>
      )}

      {/* Snap scroll container */}
      <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar">
        {visibleDishes.map((dish) => {
          const isUnavailable = dish.status === DishStatus.Unavailable;
          const currentQty = orders.find((o) => o.dishId === dish.id)?.quantity ?? 0;
          return (
            <div key={dish.id} className="h-full w-full snap-start relative">
              {/* Background */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dish.image}
                alt={dish.name}
                className={cn(
                  "absolute inset-0 w-full h-full object-cover z-0",
                  isUnavailable && "grayscale-[80%] brightness-50"
                )}
              />
              {/* Overlays */}
              <div className="absolute inset-0 z-10 bg-linear-to-t from-black via-black/50 to-transparent" />
              <div className="absolute inset-0 z-10 bg-linear-to-r from-black/70 via-transparent to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-12 pb-28 md:pb-24">
                <div className="flex justify-between items-end w-full max-w-7xl mx-auto">
                  {/* Left: info + controls */}
                  <div className="w-[80%] md:w-2/3 pr-4">
                    <div className="mb-4">
                      {isUnavailable ? (
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-500/90 text-white shadow-md backdrop-blur-sm">
                          {t("outOfStock")}
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-orange-500/90 text-white shadow-md backdrop-blur-sm">
                          {t("available")}
                        </span>
                      )}
                    </div>

                    <h2 className="text-4xl md:text-6xl font-extrabold mb-2 leading-tight text-white drop-shadow-lg">
                      {dish.name}
                    </h2>
                    <p className="text-base md:text-lg mb-6 line-clamp-3 text-slate-300 drop-shadow-md max-w-xl">
                      {dish.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-6">
                      <div className={cn(
                        "text-3xl md:text-5xl font-black drop-shadow-md",
                        isUnavailable ? "text-slate-500" : "text-orange-400"
                      )}>
                        {formatCurrency(dish.price)}
                      </div>

                      {/* +/- control */}
                      <div className={cn(
                        "flex items-center gap-3 px-2 py-1.5 rounded-full backdrop-blur-md border bg-black/50 border-slate-700",
                        isUnavailable && "opacity-50 pointer-events-none"
                      )}>
                        <button
                          onClick={() => handleQuantityChange(dish.id, Math.max(0, currentQty - 1))}
                          disabled={currentQty === 0 || isUnavailable}
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                            currentQty > 0 ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-transparent text-slate-500"
                          )}
                        >
                          <Minus size={20} />
                        </button>
                        <span className="text-xl font-bold w-6 text-center text-white">{currentQty}</span>
                        <button
                          onClick={() => handleQuantityChange(dish.id, currentQty + 1)}
                          disabled={isUnavailable}
                          className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-500 text-white hover:bg-orange-600 transition-transform active:scale-95"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Like + Rating */}
                  <div className="flex flex-col items-center gap-6 pb-4">
                    <button
                      onClick={() => setLikedItems((prev) => ({ ...prev, [dish.id]: !prev[dish.id] }))}
                      className="flex flex-col items-center group/btn"
                    >
                      <div className="w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center bg-black/50 group-hover/btn:bg-black/80 shadow-sm">
                        <Heart
                          size={24}
                          className={cn(
                            "transition-colors duration-300",
                            likedItems[dish.id] ? "fill-red-500 text-red-500" : "text-white"
                          )}
                        />
                      </div>
                      <span className="text-xs font-semibold mt-1 text-white drop-shadow-md">
                        {likedItems[dish.id] ? t("liked") : t("like")}
                      </span>
                    </button>

                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center bg-black/50 shadow-sm">
                        <Star size={24} className="text-yellow-500 fill-yellow-500" />
                      </div>
                      <span className="text-xs font-semibold mt-1 text-white drop-shadow-md">
                        {getRating(dish.id)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
