import { formatCurrency } from "@/lib/utils";
import { DishResType } from "@/schemaValidations/dish.schema";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getDishKey, hasDishTranslation } from "@/lib/dish-i18n";

export default async function DishDetail({
  dish,
}: {
  dish: DishResType['data'] | undefined;
}) {
  const tDishes = await getTranslations("Dishes");
  
  if (!dish) {
    return <div><h1 className="text-2xl lg:text-3xl font-semibold">Dish Not Found</h1></div>
  }
  
  const dishName = hasDishTranslation(dish.name) ? tDishes(`${getDishKey(dish.name)}.name`) : dish.name;
  const dishDesc = hasDishTranslation(dish.name) ? tDishes(`${getDishKey(dish.name)}.description`) : dish.description;
  
  return (
    <div className="space-y-4">
      <h1 className="text-2xl lg:text-3xl font-semibold">{dishName}</h1>
      <div className="font-semibold">Giá: {formatCurrency(dish.price)}</div>
      <Image
        src={dish.image}
        width={700}
        height={700}
        quality={100}
        alt={dishName}
        className="object-cover w-full h-full max-w-[1080px] max-h-[1080px] rounded-md"
      />
      <p>{dishDesc}</p>
    </div>
  );
}
