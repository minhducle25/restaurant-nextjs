"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale, useTranslations } from "next-intl";
import { locales, type Locale } from "@/config";
import { setUserLocale } from "@/services/locale";
export function SwitchLanguage() {
    const locale = useLocale()
  const t = useTranslations("SwitchLanguage");
  return (
    <Select value={locale} onValueChange={value => {setUserLocale(value as Locale)}}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t("label")} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {locales.map((locale) => (
            <SelectItem value={locale} key={locale}>
              {t(locale)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
