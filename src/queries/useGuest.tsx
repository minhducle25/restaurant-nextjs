import guestApiRequests from "@/apiRequests/guest";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGuestLoginMutation = () => {
  return useMutation({
    mutationFn: guestApiRequests.login,
  });
}
export const useGuestLogoutMutation = () => {
  return useMutation({
    mutationFn: guestApiRequests.logout,
  });
}

export const useGuestOrderMutation = () => {
  return useMutation({
    mutationFn: guestApiRequests.placeOrder,
  });
}

export const useGuestGetOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: guestApiRequests.getOrderList,
  });
}