# خطة رفع أداء الموقع إلى `90+` على `PageSpeed Insights` بدون تغيير الديزاين أو الأنيميشن أو الثيم

## Summary
- الهدف هو رفع `Mobile PSI` لكل الصفحات العامة إلى `90+` على Vercel، مع الحفاظ الكامل على الشكل الحالي وسلوك الأنيميشن نفسه، والتركيز على تقليل `LCP` و`INP` و`JS hydration` و`TTFB`.
- التنفيذ يكون على 4 أولويات: إلغاء الشغل غير الضروري على كل request، تقليل مساحة الـ client-side، تحسين تحميل الميديا والخطوط، ثم إضافة قياس واضح يمنع أي regression.
- قبل أي profiling نهائي: إصلاح خطأ الـ build الحالي في صفحة المشروع الداخلية لأن `next build` متوقف حالياً عند `app/projects/[slug]/page.tsx` وهذا يمنع قياس production build بشكل موثوق.

## Key Changes
- **فصل public عن admin على مستوى الـ layout**
  - نقل الصفحات العامة إلى route group مستقل مثل `(public)`، والـ admin إلى `(admin)`، بحيث الـ public layout يضم `Navbar` و`Footer` و`WhatsApp` و`SmoothScroll` فقط، والـ admin لا يحمّل أي شيء من هذا.
  - حذف الاعتماد على `usePathname()` داخل wrappers العامة كآلية لإخفاء عناصر الـ admin/public، لأن هذا يفرض hydration غير لازم على كل الصفحات.

- **تقليل `TTFB` والشغل على كل request**
  - تعديل `proxy.ts` ليعمل فقط على `/admin` وما يحتاج auth فعلاً، وعدم تشغيله على الصفحات العامة أو ملفات مثل `mp4`, `pdf`, `webp`.
  - إيقاف نمط `getAllSiteContent()` من `app/layout.tsx` لكل الصفحات، واستبداله بتحميل route-level للبيانات المطلوبة فقط.
  - إزالة public refetch الحالي من `LanguageProvider` إلى `/api/content` مع `cache: 'no-store'` عند `focus` وتغيير route.
  - اعتماد `cache + revalidateTag/revalidatePath` فقط بعد حفظ المحتوى من الـ admin، بما يتوافق مع قرار `Revalidate ذكي`.

- **تقليل الـ client JS مع الحفاظ على نفس التجربة**
  - تحويل الصفحات العامة الأساسية (`/`, `/about`, `/projects`, `/blog`, `/contact`, والصفحات الداخلية العامة) إلى server-first pages.
  - الإبقاء على الأنيميشن داخل client islands صغيرة فقط: hero parallax، scroll-trigger sections، navbar motion، gallery interactions.
  - نقل منطق جلب البيانات والبحث عن `slug` وتهيئة المحتوى من client إلى server في صفحات `/projects/[slug]` و`/blog/[slug]`.
  - استخدام `generateStaticParams` و`generateMetadata` للصفحات الديناميكية العامة، مع `revalidate` مناسب بدلاً من `useParams + useLanguage` كاعتماد أساسي للعرض.
  - تخفيف `LanguageProvider` ليصبح مسؤولاً عن locale toggle وcookie/localStorage sync فقط، من غير data fetching أو global refresh side effects.

- **تحسين `LCP` للميديا والخطوط**
  - اعتماد `poster-first hero`: تحميل poster مضغوط كعنصر الـ `LCP` الأساسي، ثم تشغيل فيديو الهيرو بعد أول paint/idle من غير تغيير بصري ملحوظ.
  - إعادة ترميز `hero-video.mp4` إلى نسخ أخف مخصصة للويب، مع نسخة موبايل أخف وposter ثابت مطابق بصرياً.
  - إعادة تصدير الصور المحلية الكبيرة الحالية إلى نسخ أصغر بصرياً مكافئة، لأن عدة صور حالياً بين `1.4MB` و`1.9MB`.
  - الحفاظ على نفس الخطوط، لكن preload للزوج النشط فقط حسب اللغة الحالية، وعدم تحميل/تجهيز 4 خطوط كاملة لكل زائر من root layout.
  - مراجعة جميع `Image` usages للتأكد من `priority` فقط لعناصر فوق الـ fold، وضبط `sizes` بدقة، وعدم جعل عناصر غير حرجة تنافس الـ hero على الشبكة.

- **تنظيم الأنيميشن بدون تغيير مظهره**
  - الإبقاء على `GSAP/Motion/Lenis` لكن تفعيلهم فقط في sections التي تحتاجهم فعلاً.
  - عدم تسجيل/تشغيل scroll listeners عالمياً إلا عند وجود section مرئي.
  - تقليل re-renders الناتجة عن locale changes عبر تمرير props جاهزة من server بدلاً من إعادة بناء tree كبيرة داخل provider.
  - تطبيق `content-visibility: auto` أو lazy section boundaries للأجزاء البعيدة أسفل fold حيث لا يغيّر ذلك الشكل.

## Public APIs / Interfaces
- `LanguageProvider` يتغير من `{ defaultLocale, dynamicContent }` إلى واجهة أخف تعتمد على locale وcopy جاهز للصفحة الحالية فقط.
- إضافة route-level loaders عامة مثل `getPublicPageContent(locale, route)` أو ما يعادلها، بدلاً من تحميل كل المحتوى العام في root layout.
- الصفحات الديناميكية العامة تضيف `generateStaticParams` و`generateMetadata` وتصبح server-rendered مع islands تفاعلية فقط.
- `app/api/content` يتوقف عن كونه bootstrap endpoint للواجهة العامة؛ يبقى فقط لو احتجناه للـ admin preview أو يُزال تماماً.
- `proxy.ts` matcher يصبح admin/auth-only.

## Test Plan
- `next build` ينجح بدون type errors.
- قياس `Lighthouse/PageSpeed` على Vercel Preview وProduction للروابط:
  - `/`
  - `/about`
  - `/projects`
  - `/projects/[slug]`
  - `/blog`
  - `/blog/[slug]`
  - `/contact`
- قبول الأداء:
  - `PSI Mobile >= 90` لكل الصفحات العامة
  - `LCP <= 2.5s`
  - `INP <= 200ms`
  - `CLS <= 0.1`
- اختبارات سلوكية:
  - لا يوجد اختلاف بصري مقصود في layout أو theme أو motion sequencing.
  - locale switch ما زال يعمل ويحدث الاتجاه والخطوط بشكل صحيح.
  - تحديث من الـ admin يظهر على الواجهة العامة بعد الحفظ عبر `revalidate`.
  - الـ middleware لا يُستدعى لملفات static/video العامة.
  - poster يظهر فوراً في الهيرو ثم الفيديو يكتمل فوقه بدون layout shift.

## Assumptions
- النطاق هو كل الصفحات العامة، مع أولوية `Mobile PSI` أولاً.
- الاستضافة المستهدفة هي `Vercel`.
- مسموح ضغط الصور وإعادة ترميز الفيديو طالما النتيجة البصرية مكافئة.
- غير مسموح أي redesign أو إزالة animation؛ المسموح فقط هو تحسين delivery/hydration/caching وترتيب التحميل.
