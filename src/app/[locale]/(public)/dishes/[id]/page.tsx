import dishApiRequest from "@/apiRequests/dish";
import DishDetail from "@/app/[locale]/(public)/dishes/[id]/dish-detail";
import { formatCurrency, wrapServerApi } from "@/lib/utils";
import Image from "next/image";

export default async function DishPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await wrapServerApi(() => dishApiRequest.get(Number(id)));

  const dish = data?.payload?.data;
    return (
        <DishDetail dish={dish} />
    )
}
