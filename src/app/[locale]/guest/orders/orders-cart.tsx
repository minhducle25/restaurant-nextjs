"use client";

import { useAppStore } from "@/components/app-provider";
import { OrderStatus } from "@/constants/type";
import { formatCurrency } from "@/lib/utils";
import { useGuestGetOrders } from "@/queries/useGuest";
import {
  PayGuestOrdersResType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  Processing: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  Delivered: "bg-green-500/20 text-green-300 border-green-500/40",
  Paid: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  Rejected: "bg-red-500/20 text-red-300 border-red-500/40",
};

export default function OrdersCart() {
  const t = useTranslations("GuestOrders");
  const tStatus = useTranslations("OrderStatusLabel");
  const { data, refetch } = useGuestGetOrders();
  const socket = useAppStore((state) => state.socket);
  const orders = data?.payload.data ?? [];

  const { waitingToPay, paid } = orders.reduce(
    (result, order) => {
      if (
        order.status === OrderStatus.Delivered ||
        order.status === OrderStatus.Processing ||
        order.status === OrderStatus.Pending
      ) {
        return {
          ...result,
          waitingToPay: {
            price: result.waitingToPay.price + order.dishSnapshot.price * order.quantity,
            quantity: result.waitingToPay.quantity + order.quantity,
          },
        };
      }
      if (order.status === OrderStatus.Paid) {
        return {
          ...result,
          paid: {
            price: result.paid.price + order.dishSnapshot.price * order.quantity,
            quantity: result.paid.quantity + order.quantity,
          },
        };
      }
      return result;
    },
    {
      waitingToPay: { price: 0, quantity: 0 },
      paid: { price: 0, quantity: 0 },
    }
  );

  useEffect(() => {
    if (socket?.connected) {
      onConnect();
      console.log("socket connected in orders cart");
    }

    function onConnect() {
      console.log(socket?.id);
    }
    function onDisconnect() {
      console.log("disconnected");
    }
    function onOrderUpdate(data: UpdateOrderResType["data"]) {
      const { dishSnapshot: { name }, quantity } = data;
      toast.message(t("orderUpdated"), {
        description: t("orderUpdatedDesc", { name, status: tStatus(data.status) }),
      });
      refetch();
    }
    function onPayment(data: PayGuestOrdersResType["data"]) {
      const { guest } = data[0];
      toast.message(t("orderPaid"), {
        description: t("paidDesc", { name: guest?.name ?? '', tableNumber: guest?.tableNumber ?? 0, count: data.length }),
      });
      refetch();
    }

    socket?.on("update-order", onOrderUpdate);
    socket?.on("connect", onConnect);
    socket?.on("disconnect", onDisconnect);
    socket?.on("payment", onPayment);

    return () => {
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.off("update-order", onOrderUpdate);
      socket?.off("payment", onPayment);
    };
  }, [refetch, socket]);

  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="h-full overflow-y-auto hide-scrollbar px-3 sm:px-6 md:px-8 pt-20 pb-32 space-y-3">
        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <span className="text-5xl mb-4">🍽️</span>
            <p className="text-lg font-medium">{t("title")}</p>
          </div>
        )}

        {orders.map((order, index) => (
          <div
            key={order.id}
            className="flex items-center gap-4 bg-[#1a2035]/80 border border-slate-700/50 backdrop-blur-sm rounded-2xl p-4"
          >
            <div className="text-xs font-bold text-slate-500 w-4 shrink-0">{index + 1}</div>
            <div className="shrink-0">
              <Image
                src={order.dishSnapshot.image}
                alt={order.dishSnapshot.name}
                height={100}
                width={100}
                quality={100}
                className="object-cover w-16 h-16 rounded-xl"
              />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <h3 className="text-sm font-semibold text-white truncate">{order.dishSnapshot.name}</h3>
              <p className="text-xs text-orange-400 font-bold">
                {formatCurrency(order.dishSnapshot.price)}
                <span className="text-slate-400 font-normal"> × {order.quantity}</span>
              </p>
            </div>
            <div className="shrink-0">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                statusColors[order.status] ?? "bg-slate-700/50 text-slate-300 border-slate-600"
              }`}>
                {tStatus(order.status)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary bar */}
      <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 py-3 sm:py-4 bg-[#0a0f1c]/95 border-t border-white/10 backdrop-blur-md">
        {paid.quantity > 0 && (
          <div className="flex justify-between items-center text-xs sm:text-sm text-emerald-400 font-medium mb-1.5">
            <span>{t("paid", { count: paid.quantity })}</span>
            <span className="font-bold">{formatCurrency(paid.price)}</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-sm sm:text-base font-bold text-white">{t("unpaid", { count: waitingToPay.quantity })}</span>
          <span className="text-lg sm:text-xl font-black text-orange-400">{formatCurrency(waitingToPay.price)}</span>
        </div>
      </div>
    </>
  );
}
