# 📋 Hướng Dẫn Setup i18n Routing với next-intl (Next.js 16)

> **Ngày tạo:** 28/12/2024  
> **Next.js version:** 16.0.1  
> **next-intl version:** Theo package.json

---

## 🎯 Mục Tiêu

Tạo website đa ngôn ngữ với URL theo locale:
- `localhost:3000/en/...` → Tiếng Anh
- `localhost:3000/vi/...` → Tiếng Việt

---

## 📁 Cấu Trúc Files

```
client/
├── messages/                    ← 📝 Chứa text đa ngôn ngữ
│   ├── en.json                  
│   └── vi.json                  
├── src/
│   ├── proxy.ts                 ← 🔀 Middleware (Next.js 16)
│   ├── i18n/
│   │   ├── routing.ts           ← ⚙️ Cấu hình locales
│   │   ├── request.ts           ← 📦 Load messages
│   │   └── navigation.ts        ← 🧭 Navigation APIs
│   └── app/
│       ├── layout.tsx           ← Root layout (fonts, providers)
│       └── [locale]/            ← ⭐ FOLDER QUAN TRỌNG
│           ├── layout.tsx       ← Wrap NextIntlClientProvider
│           ├── (public)/        ← Trang công khai
│           ├── manage/          ← Trang quản lý
│           └── guest/           ← Trang khách
```

---

## 🔧 Chi Tiết Từng File

### 1️⃣ `messages/en.json` & `messages/vi.json`

**Mục đích:** Chứa tất cả text hiển thị cho từng ngôn ngữ

```json
// messages/en.json
{
  "HomePage": { "title": "Big Boy Restaurant" },
  "Login": { "title": "Login" },
  "SwitchLanguage": {
    "label": "Change Language",
    "en": "English",
    "vi": "Vietnamese"
  }
}
```

```json
// messages/vi.json
{
  "HomePage": { "title": "Nhà Hàng Big Boy" },
  "Login": { "title": "Đăng Nhập" },
  "SwitchLanguage": {
    "label": "Đổi Ngôn ngữ",
    "en": "English",
    "vi": "Vietnamese"
  }
}
```

---

### 2️⃣ `src/i18n/routing.ts`

**Mục đích:** Định nghĩa những locale nào được hỗ trợ

```typescript
import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  locales: ['en', 'vi'],    // Các ngôn ngữ hỗ trợ
  defaultLocale: 'en'       // Ngôn ngữ mặc định
});
```

---

### 3️⃣ `src/i18n/request.ts`

**Mục đích:** Load file messages tương ứng với locale

```typescript
import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';
 
export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
 
  return {
    locale,
    // 👇 Load file messages theo locale (en.json hoặc vi.json)
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
```

---

### 4️⃣ `src/i18n/navigation.ts`

**Mục đích:** Tạo navigation APIs có locale-aware

```typescript
import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';
 
// Export các hàm navigation đã được wrap với locale
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
```

---

### 5️⃣ `src/proxy.ts` (Next.js 16)

> ⚠️ **Lưu ý:** Next.js 16 đổi `middleware.ts` thành `proxy.ts`

**Mục đích:** Xử lý routing + auth + i18n

```typescript
import createIntlMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Remove locale prefix để check paths
  const pathnameWithoutLocale = pathname.replace(/^\/(en|vi)/, '') || '/';

  // ... logic auth của bạn ...
  
  // Cuối cùng, chạy intl middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
```

---

### 6️⃣ `src/app/[locale]/layout.tsx`

**Mục đích:** Wrap app với `NextIntlClientProvider`

```tsx
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
```

---

## 🔄 Flow Hoạt Động

```
┌─────────────────────────────────────────────────────────────┐
│  User truy cập: localhost:3000/vi/login                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  proxy.ts                                                   │
│  - Kiểm tra auth                                            │
│  - intlMiddleware xác định locale = "vi"                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  request.ts                                                 │
│  - Load messages/vi.json                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  [locale]/layout.tsx                                        │
│  - setRequestLocale("vi")                                   │
│  - Wrap với NextIntlClientProvider                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  [locale]/(public)/(auth)/login/page.tsx                    │
│  - useTranslations('Login') → lấy từ vi.json                │
│  - t('title') → "Đăng Nhập"                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📖 Cách Sử Dụng

### ✅ Hiển thị text đa ngôn ngữ

```tsx
import {useTranslations} from 'next-intl';

function MyComponent() {
  const t = useTranslations('HomePage');
  return <h1>{t('title')}</h1>;  
  // "Big Boy Restaurant" (en) hoặc "Nhà Hàng Big Boy" (vi)
}
```

### ✅ Link giữa các trang

```tsx
// ❌ KHÔNG DÙNG
import Link from 'next/link';

// ✅ DÙNG CÁI NÀY
import {Link} from '@/i18n/navigation';

<Link href="/login">Login</Link>  // Tự động thêm /en hoặc /vi
```

### ✅ Navigate bằng code

```tsx
import {useRouter} from '@/i18n/navigation';

function MyComponent() {
  const router = useRouter();
  
  const handleClick = () => {
    router.push('/dashboard');  // → /en/dashboard hoặc /vi/dashboard
  };
}
```

### ✅ Đổi ngôn ngữ

```tsx
'use client';
import {useRouter, usePathname} from '@/i18n/navigation';

function SwitchLanguage() {
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = (newLocale: string) => {
    router.replace(pathname, {locale: newLocale});
    // URL đổi từ /en/login → /vi/login
  };

  return (
    <button onClick={() => changeLocale('vi')}>
      Tiếng Việt
    </button>
  );
}
```

### ✅ Sử dụng trong Server Component

```tsx
import {getTranslations} from 'next-intl/server';

export async function generateMetadata({params}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Metadata'});

  return {
    title: t('title')
  };
}
```

---

## ⚠️ Lưu Ý Quan Trọng

| Quy tắc | Giải thích |
|---------|------------|
| Tất cả pages phải nằm trong `[locale]/` | Nếu không sẽ không có i18n |
| Import từ `@/i18n/navigation` | Không dùng `next/link` hay `next/navigation` |
| Import trong `[locale]` phải có prefix `@/app/[locale]/` | VD: `@/app/[locale]/manage/...` |
| Next.js 16 dùng `proxy.ts` | Không phải `middleware.ts` |
| Gọi `setRequestLocale(locale)` trong layouts/pages | Để enable static rendering |

---

## 🛠️ Thêm Ngôn Ngữ Mới

1. **Tạo file messages:**
   ```
   messages/ja.json  (Japanese)
   ```

2. **Cập nhật routing.ts:**
   ```typescript
   export const routing = defineRouting({
     locales: ['en', 'vi', 'ja'],  // Thêm 'ja'
     defaultLocale: 'en'
   });
   ```

3. **Cập nhật proxy.ts matcher:**
   ```typescript
   const pathnameWithoutLocale = pathname.replace(/^\/(en|vi|ja)/, '') || '/';
   ```

---

## 📚 Tài Liệu Tham Khảo

- [next-intl Documentation](https://next-intl.dev/docs/routing/setup)
- [Next.js App Router i18n](https://nextjs.org/docs/app/building-your-application/routing/internationalization)

---

## ✅ Checklist Khi Setup

- [ ] Tạo folder `messages/` với các file `.json`
- [ ] Tạo `src/i18n/routing.ts`
- [ ] Tạo `src/i18n/request.ts` 
- [ ] Tạo `src/i18n/navigation.ts`
- [ ] Tạo/Cập nhật `src/proxy.ts`
- [ ] Di chuyển tất cả pages vào `src/app/[locale]/`
- [ ] Cập nhật tất cả import paths (`@/app/...` → `@/app/[locale]/...`)
- [ ] Tạo `src/app/[locale]/layout.tsx` với `NextIntlClientProvider`
- [ ] Thay thế `next/link` bằng `@/i18n/navigation`
- [ ] Test: `npm run build` thành công
