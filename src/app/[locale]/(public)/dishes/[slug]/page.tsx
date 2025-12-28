import dishApiRequest from "@/apiRequests/dish";
import DishDetail from "@/app/[locale]/(public)/dishes/[slug]/dish-detail";
import { formatCurrency, getIdFromSlugUrl, wrapServerApi } from "@/lib/utils";
import Image from "next/image";

export default async function DishPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const id = getIdFromSlugUrl((await params).slug);

  const data = await wrapServerApi(() => dishApiRequest.get(Number(id)));

  const dish = data?.payload?.data;
    return (
        <DishDetail dish={dish} />
    )
}
