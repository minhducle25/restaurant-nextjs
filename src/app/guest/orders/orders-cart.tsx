"use client";

import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/constants/type";
import socket from "@/lib/socket";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGuestGetOrders } from "@/queries/useGuest";
import { UpdateOrderResType } from "@/schemaValidations/order.schema";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "sonner";

export default function OrdersCart() {
  const { data, refetch } = useGuestGetOrders();
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
            price:
              result.waitingToPay.price +
              order.dishSnapshot.price * order.quantity,
            quantity: result.waitingToPay.quantity + order.quantity,
          },
        };
      }
      if (order.status === OrderStatus.Paid) {
        return {
          ...result,
          paid: {
            price:
              result.paid.price + order.dishSnapshot.price * order.quantity,
            quantity: result.paid.quantity + order.quantity,
          },
        };
      }
      return result;
    },
    {
      waitingToPay: {
        price: 0,
        quantity: 0,
      },
      paid: {
        price: 0,
        quantity: 0,
      },
    }
  );

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log(socket.id);
    }

    function onDisconnect() {
      console.log("disconnected");
    }

    function onOrderUpdate(data: UpdateOrderResType["data"]) {
      const {
        dishSnapshot: { name },
        quantity,
      } = data;
      toast.message("Đơn hàng vừa được cập nhật", {
        description: `Món ${name} vừa được cập nhật sang "${getVietnameseOrderStatus(
          data.status
        )}"`,
      });
      refetch();
    }
    socket.on("update-order", onOrderUpdate);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("update-order", onOrderUpdate);
    };
  }, [refetch]);

  return (
    <>
      {orders.map((order, index) => (
        <div key={order.id} className="flex gap-4">
          <div className="text-xs font-semibold">{index + 1}</div>
          <div className="flex-shrink-0 relative">
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-[80px] h-[80px] rounded-md"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm">{order.dishSnapshot.name}</h3>
            <div className="text-xs font-semibold">
              {formatCurrency(order.dishSnapshot.price)} x{" "}
              <Badge className="px-1">{order.quantity}</Badge>
            </div>
          </div>
          <div className="flex-shrink-0 ml-auto flex justify-center items-center">
            <Badge variant={"outline"}>
              {getVietnameseOrderStatus(order.status)}
            </Badge>
          </div>
        </div>
      ))}
      {paid.quantity !== 0  && (<div className="sticky bottom-0 flex">
        <div className="w-full flex space-x-4 text-xl font-semibold">
          <span>Đơn đã thanh toán: - {paid.quantity} món</span>
          <span>{formatCurrency(paid.price)}</span>
        </div>
      </div>)}
      <div className="sticky bottom-0 flex">
        <div className="w-full flex space-x-4 text-xl font-semibold">
          <span>Đơn chưa thanh toán: - {waitingToPay.quantity} món</span>
          <span>{formatCurrency(waitingToPay.price)}</span>
        </div>
      </div>
    </>
  );
}
