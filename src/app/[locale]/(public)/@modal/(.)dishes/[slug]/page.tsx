import dishApiRequest from "@/apiRequests/dish";
import Modal from "@/app/[locale]/(public)/@modal/(.)dishes/[slug]/modal";
import DishDetail from "@/app/[locale]/(public)/dishes/[slug]/dish-detail";
import { generateSlugUrl, getIdFromSlugUrl, wrapServerApi } from "@/lib/utils";

export async function generateStaticParams() {
  const data = await wrapServerApi(() => dishApiRequest.list());
 const list = data?.payload?.data || [];
  return list.map((dish) => ({
    slug: generateSlugUrl({ name: dish.name, id: dish.id }),
  }))
}

export default async function DishPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const id = getIdFromSlugUrl((await params).slug);

  const data = await wrapServerApi(() => dishApiRequest.get(Number(id)));

  const dish = data?.payload?.data;
    return(
        <Modal>
        <DishDetail dish={dish} />
        </Modal>
    )
}
