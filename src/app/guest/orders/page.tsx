import OrdersCart from "@/app/guest/orders/orders-cart";

export default function OrdersPage() {
  return (
    <div>
    <div className='max-w-[400px] mx-auto space-y-4'>
      <h1 className='text-center text-xl font-bold'>Đơn Hàng</h1>
      <OrdersCart />
    </div>
    </div>
  )
}
