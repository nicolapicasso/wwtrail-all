# Graph Report - wwtrail  (2026-07-12)

## Corpus Check
- 573 files · ~293,854 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3138 nodes · 7549 edges · 211 communities (123 shown, 88 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.57)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e1373cb6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- apiSuccess
- requireRole
- admin.service.ts
- button.tsx
- requireAuth
- AdminService
- useAuth
- homeConfiguration.schema.ts
- page.tsx
- index.ts
- layout.tsx
- user.service.ts
- edition.ts
- competition.ts
- page.tsx
- import.service.ts
- EventService
- post.ts
- event.service.ts
- ZancadasService
- CompetitionService
- rating.ts
- page.tsx
- page.tsx
- promotion.ts
- compilerOptions
- ImportService
- HomeService
- generateUniqueSlug
- Language
- use-toast.ts
- user.service.ts
- EditionService
- catalog.service.ts
- PromotionForm.tsx
- index.ts
- organizers.service.ts
- events.service.ts
- page.tsx
- ZancadasBalance.tsx
- errors.ts
- EditionPodiumService
- serviceCategories.service.ts
- home.ts
- user-competitions.service.ts
- apiClientV2
- email-templates.service.ts
- auth.schema.ts
- event.schema.ts
- index.ts
- ai-autofill.service.ts
- OrganizerService
- page.tsx
- page.tsx
- components.json
- HomeBlockRenderer.tsx
- page.tsx
- bulk-edit.service.ts
- SEOService
- useAuth
- EventList.tsx
- PromotionForm.tsx
- editionRating.schema.ts
- ExportService
- TranslationService
- PromotionService
- CompetitionActions.tsx
- Event
- services.service.ts
- LandingService
- route.ts
- EmailTemplateService
- page.tsx
- event.ts
- EventForm.tsx
- competition-admin.schema.ts
- SpecialSeries
- ContentBlockConfig
- page.tsx
- SpecialSeries
- user-competition.schema.ts
- OmniwalletService
- page.tsx
- userEdition.schema.ts
- User
- serviceCategories.service.ts
- admin.schema.ts
- CatalogService
- photos.service.ts
- devDependencies
- error-handler.ts
- competition-admin.service.ts
- page.tsx
- ServiceCategoriesService
- .deleteAllImportedData
- TranslationsService
- edition.schema.ts
- translation.schema.ts
- scripts
- dependencies
- next
- EventMap.tsx
- competition.schema.ts
- result.schema.ts
- @radix-ui/react-select
- route.ts
- review.schema.ts
- omniwallet.service.ts
- WeatherCard.tsx
- react-dom
- participant.schema.ts
- react-hook-form
- EventCard.tsx
- slugify
- useSlugValidation.ts
- route.ts
- package.json
- migrate-uploads-to-spaces.js
- @radix-ui/react-switch
- EventManagerService
- tailwind-merge
- tailwindcss-animate
- @tiptap/extension-text-style
- tailwind-merge
- page.tsx
- export-local.ts
- SEOService
- LayoutWrapper.tsx
- route.ts
- StatsCard.tsx
- StatsCard.tsx
- @types/node
- favorites.schema.ts
- next.config.js
- PATCH
- @tiptap/extension-underline
- EventSelect.tsx
- PATCH
- clsx
- date-fns
- entrypoint.sh
- eslint-config-next
- @tiptap/starter-kit
- leaflet
- uuid
- postcss
- next-intl
- nodemailer
- @prisma/client
- @radix-ui/react-accordion
- @radix-ui/react-alert-dialog
- @radix-ui/react-dialog
- @radix-ui/react-dropdown-menu
- @radix-ui/react-label
- prisma
- page.tsx
- @aws-sdk/client-s3
- @radix-ui/react-toast
- tailwindcss
- tsx
- PATCH
- page.tsx
- @types/bcryptjs
- LanguageSelector.tsx
- @types/leaflet
- @tiptap/extension-color
- @tiptap/extension-image
- @tiptap/extension-link
- @tiptap/extension-text-align
- @types/node
- @types/react-dom
- PATCH
- axios
- yet-another-react-lightbox
- zod
- PATCH
- @aws-sdk/client-s3
- InsiderBadge.tsx
- impersonation.ts
- UserCard.tsx
- CompetitionList.tsx
- footer.service.ts
- tailwind.config.ts
- apiClient
- cacheService
- @types/js-cookie
- DirectoryMapClient.tsx
- @types/nodemailer
- client.ts
- route.ts
- FooterService
- autoprefixer
- fetcher.ts
- @types/node
- PATCH
- PATCH
- PATCH
- eventManagers.service.ts
- TranslationsService
- CompetitionService
- EventManagersPanel.tsx
- editionRating.service.ts
- CatalogService
- ServiceCategoriesService
- date-fns

## God Nodes (most connected - your core abstractions)
1. `apiError` - 450 edges
2. `apiSuccess()` - 441 edges
3. `requireRole()` - 283 edges
4. `useAuth()` - 76 edges
5. `requireAuth()` - 66 edges
6. `AdminService` - 65 edges
7. `ZancadasService` - 47 edges
8. `Button` - 41 edges
9. `ImportService` - 37 edges
10. `apiClientV2` - 35 edges

## Surprising Connections (you probably didn't know these)
- `MagazineCategoryPage()` --indirect_call--> `PostCategory`  [INFERRED]
  app/[locale]/magazine/[category]/page.tsx → types/post.ts
- `MyEventsPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/events/page.tsx → hooks/useAuth.ts
- `OrganizerLayout()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/layout.tsx → contexts/AuthContext.tsx
- `OrganizerPostsPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/posts/page.tsx → contexts/AuthContext.tsx
- `PromotionCategoriesPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/promotions/categories/page.tsx → contexts/AuthContext.tsx

## Import Cycles
- None detected.

## Communities (211 total, 88 thin omitted)

### Community 0 - "apiSuccess"
Cohesion: 0.40
Nodes (3): EditionStatsCompactProps, EditionStatsProps, EditionStats

### Community 1 - "requireRole"
Cohesion: 0.04
Nodes (34): adminService, GET(), adminService, GET(), adminService, GET(), PUT(), adminService (+26 more)

### Community 2 - "admin.service.ts"
Cohesion: 0.07
Nodes (31): FilterRow(), getOperatorsForType(), EventApprovalQueueProps, roles, UserEditModalProps, UserTableProps, AdminStats, AdminUser (+23 more)

### Community 3 - "button.tsx"
Cohesion: 0.14
Nodes (13): RatingCardProps, RatingFormProps, RatingSummaryProps, RecentRatingsWidgetProps, StarRatingProps, ratingsService, CreateRatingDTO, EditionRating (+5 more)

### Community 4 - "requireAuth"
Cohesion: 0.07
Nodes (22): ORG_COLORS, OrganizersPublicPage(), orgColor(), orgInitials(), apiClientV2, Footer, FooterContent, FooterService (+14 more)

### Community 6 - "useAuth"
Cohesion: 0.06
Nodes (36): LoginPage(), RegisterPage(), DashboardPage(), NewEventPage(), NewLandingPage(), PromotionsAnalyticsPage(), EditPromotionPage(), NewPromotionPage() (+28 more)

### Community 7 - "homeConfiguration.schema.ts"
Cohesion: 0.14
Nodes (16): EditCompetitionPageProps, ConfirmDialog(), ConfirmDialogProps, EventOption, EventSelectProps, CompetitionFormProps, UseCompetitionResult, UseCompetitionsResult (+8 more)

### Community 8 - "page.tsx"
Cohesion: 0.09
Nodes (33): AdminUsersPage(), CategoryType, initialFormData, ParticipationFormData, ParticipationsPage(), ParticipationStatus, AddParticipationButtonProps, CategoryType (+25 more)

### Community 9 - "index.ts"
Cohesion: 0.14
Nodes (20): EditEditionPage(), EditEditionPageProps, EditionDetailTabs(), EditionDetailTabsProps, TODO: Get from API, TabKey, PodiumCardProps, PodiumPositionProps (+12 more)

### Community 10 - "layout.tsx"
Cohesion: 0.15
Nodes (15): Skeleton(), ZancadasBalance(), ZancadasBalanceProps, ACTION_ICONS, ACTION_LABELS, ZancadasHistory(), ZancadasHistoryProps, CompetitionMarker (+7 more)

### Community 11 - "user.service.ts"
Cohesion: 0.05
Nodes (39): autoFixEncoding(), fixCatalogEncoding(), fixCorruptedFaqs(), GET(), POST(), GET(), POST(), typeMap (+31 more)

### Community 12 - "edition.ts"
Cohesion: 0.12
Nodes (24): EditionCard(), EditionCardProps, EditionsGridProps, EditionFormProps, EditionBackendResponse, EditionStatus, RegistrationStatus, BulkCreateEditionsInput (+16 more)

### Community 14 - "page.tsx"
Cohesion: 0.15
Nodes (9): EventFilters, EventList(), EventListProps, EventListSimple(), EventListSimpleProps, PublicEventCard(), PaginationData, useEvents() (+1 more)

### Community 15 - "import.service.ts"
Cohesion: 0.11
Nodes (21): FullImport, FullImportResult, fullImportSchema, ImportCompetition, importCompetitionSchema, ImportEvent, importEventSchema, ImportOrganizer (+13 more)

### Community 16 - "EventService"
Cohesion: 0.10
Nodes (19): cache, memoryCache, GetOrganizerOptions, GetPendingOptions, PaginatedCompetitions, TODO: Enviar notificación al organizador, TODO: Enviar notificación al organizador con razón, CreateOrganizerInput (+11 more)

### Community 17 - "post.ts"
Cohesion: 0.22
Nodes (9): AuthContextType, AuthContextValue, AuthService, AuthResponse, LoginCredentials, RefreshTokenResponse, RegisterData, User (+1 more)

### Community 18 - "event.service.ts"
Cohesion: 0.13
Nodes (22): prisma, CreateEventInput, EventFilters, UpdateEventInput, CreatePostInput, PostFilters, UpdatePostInput, GenerateSEOInput (+14 more)

### Community 20 - "CompetitionService"
Cohesion: 0.04
Nodes (52): GET(), DELETE(), ALLOWED_CONTENT_TYPES, POST(), ALLOWED_TYPES, POST(), ALLOWED_TYPES, POST() (+44 more)

### Community 21 - "rating.ts"
Cohesion: 0.17
Nodes (11): CatalogService, catalogsService, competitionTypesService, CatalogType, CompetitionType, CreateCatalogDTO, CreateSpecialSeriesDTO, SpecialSeries (+3 more)

### Community 22 - "page.tsx"
Cohesion: 0.13
Nodes (10): PostForm(), PostFormProps, editionsService, PostsService, CreatePostInput, Post, PostImage, PostStatus (+2 more)

### Community 23 - "page.tsx"
Cohesion: 0.07
Nodes (28): getCountryName(), ROLE_LABELS, StatsPage(), STATUS_LABELS, TYPE_LABELS, ProfilePage(), INSIDER_COLORS, insiderColor() (+20 more)

### Community 24 - "promotion.ts"
Cohesion: 0.13
Nodes (17): PromotionsService, AddCodesResponse, AddCouponCodesInput, CouponAnalyticsResponse, CouponCode, CouponRedemption, CouponRedemptionResponse, CouponStats (+9 more)

### Community 25 - "compilerOptions"
Cohesion: 0.07
Nodes (28): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+20 more)

### Community 26 - "ImportService"
Cohesion: 0.07
Nodes (33): GET(), POST(), GET(), POST(), PUT(), ContentBlockConfig, ContentBlockConfigSchema, CreateHomeBlockInput (+25 more)

### Community 27 - "HomeService"
Cohesion: 0.09
Nodes (29): FooterAdminPage(), LANGUAGES, InsiderConfig, InsiderStats, EditLandingPage(), LandingsAdminPage(), SEOConfigPage(), GroupedSEO (+21 more)

### Community 28 - "generateUniqueSlug"
Cohesion: 0.09
Nodes (12): EventDetailPage(), getMonthName(), AdminEditButton(), AdminEditButtonFloating(), AdminEditButtonProps, EditionParticipants(), EventMap(), EventMapMarker (+4 more)

### Community 29 - "Language"
Cohesion: 0.12
Nodes (29): POST(), autoFillCompetition(), autoFillEvent(), classifyImage(), CompetitionAutoFillResult, EventAutoFillResult, extractImagesFromHtml(), fetchPageContent() (+21 more)

### Community 30 - "use-toast.ts"
Cohesion: 0.12
Nodes (22): Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle, toastVariants (+14 more)

### Community 31 - "user.service.ts"
Cohesion: 0.09
Nodes (19): POST(), userService, GET(), userService, ChangePasswordInput, changePasswordSchema, GetPublicUsersQuery, getPublicUsersSchema (+11 more)

### Community 32 - "EditionService"
Cohesion: 0.08
Nodes (13): POST(), GET(), POST(), GET(), DELETE(), GET(), PUT(), GET() (+5 more)

### Community 33 - "catalog.service.ts"
Cohesion: 0.13
Nodes (14): CreateCatalogInput, createCatalogSchema, CreateSpecialSeriesInput, createSpecialSeriesSchema, GetCatalogQuery, getCatalogQuerySchema, UpdateCatalogInput, updateCatalogSchema (+6 more)

### Community 34 - "PromotionForm.tsx"
Cohesion: 0.16
Nodes (8): EventsService, CreateEventData, EventFilters, EventResponse, EventsResponse, EventStatsResponse, RejectEventData, UpdateEventData

### Community 35 - "index.ts"
Cohesion: 0.12
Nodes (14): FeaturedEvents(), LargeCard(), mediaUrl(), SmallCard(), Result, ResultType, SearchResultsHero(), toArray() (+6 more)

### Community 36 - "organizers.service.ts"
Cohesion: 0.14
Nodes (19): BlockConfigModal(), HeroConfigForm(), HeroConfigFormProps, LinksBlock(), LinksBlockProps, MAP_TILES, MapBlockProps, TextBlock() (+11 more)

### Community 37 - "events.service.ts"
Cohesion: 0.12
Nodes (14): MyEventsPage(), ViewMode, BulkActionsBar(), BulkActionsBarProps, EventStatusBadge(), EventStatusBadgeProps, COUNTRY_FLAGS, EventCard() (+6 more)

### Community 38 - "page.tsx"
Cohesion: 0.31
Nodes (4): GET(), PUT(), GET(), SiteConfigService

### Community 39 - "ZancadasBalance.tsx"
Cohesion: 0.11
Nodes (30): EventMap, ExportStats, ACTION_ICONS, TODO: Implement actual API call to change password, FilterState, CompetitionGridSkeleton(), EditionParticipantsProps, Participant (+22 more)

### Community 40 - "errors.ts"
Cohesion: 0.14
Nodes (10): prisma, EditionWeather, AppError, BadRequestError, ConflictError, ForbiddenError, InternalServerError, NotFoundError (+2 more)

### Community 41 - "EditionPodiumService"
Cohesion: 0.19
Nodes (8): AgendaRow(), CalEdition, CalView, editionHref(), effDistance(), effElevation(), MONTHS_ES, MonthView()

### Community 42 - "serviceCategories.service.ts"
Cohesion: 0.16
Nodes (9): BlockConfigModalProps, HomeBlockRendererProps, HomeService, CreateHomeBlockDTO, HomeBlock, HomeConfiguration, UpdateFullHomeConfigDTO, UpdateHomeBlockDTO (+1 more)

### Community 44 - "user-competitions.service.ts"
Cohesion: 0.13
Nodes (12): MyRegistrationsPage(), UserStatsCards(), useUserCompetitions(), useUserStats(), userCompetitionsService, AddResultData, MarkCompetitionData, RankingEntry (+4 more)

### Community 45 - "apiClientV2"
Cohesion: 0.14
Nodes (13): CompetitionCard(), CompetitionCardCompactProps, CompetitionCardProps, COUNTRY_FLAGS, COMPETITION_TYPES, CompetitionFilters(), CompetitionFiltersProps, COUNTRIES (+5 more)

### Community 46 - "email-templates.service.ts"
Cohesion: 0.18
Nodes (11): EmailTemplatesPage(), EmailTemplatesService, CreateEmailTemplateInput, EMAIL_TEMPLATE_TYPES, EmailTemplate, EmailTemplatePreviewResponse, EmailTemplateResponse, EmailTemplatesResponse (+3 more)

### Community 47 - "auth.schema.ts"
Cohesion: 0.22
Nodes (13): CompetitionsBlock(), CompetitionsBlockProps, EditionsBlock(), EditionsBlockProps, EventsBlock(), EventsBlockProps, MapBlock, PostsBlock() (+5 more)

### Community 48 - "event.schema.ts"
Cohesion: 0.10
Nodes (19): CreateEventInput, createEventSchema, eventIdSchema, EventsByCountryParams, EventsByCountryQuery, eventsByCountrySchema, eventSlugSchema, FeaturedEventsQuery (+11 more)

### Community 49 - "index.ts"
Cohesion: 0.31
Nodes (9): importService, POST(), NativeImportOptions, ENCODING_FIXES, fixEncoding(), fixString(), normalizeUnicode(), parseJsonWithEncoding() (+1 more)

### Community 50 - "ai-autofill.service.ts"
Cohesion: 0.18
Nodes (13): CompetitionDetailPage(), OrganizerDetailPage(), EventMap, ServiceDetailPage(), EventGallery(), EventGalleryProps, OrganizerCard(), OrganizerCardProps (+5 more)

### Community 51 - "OrganizerService"
Cohesion: 0.09
Nodes (14): POST(), POST(), GET(), POST(), POST(), DELETE(), GET(), PUT() (+6 more)

### Community 52 - "page.tsx"
Cohesion: 0.29
Nodes (7): DRY, main(), prisma, repairValue(), Rule, RULES, TEXT_KEYS

### Community 53 - "page.tsx"
Cohesion: 0.09
Nodes (22): EventCardProps, ApiResponse, EventFilters, EventResponseV1, EventsResponseV1, PaginationData, CreateEventInput, Event (+14 more)

### Community 54 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 55 - "HomeBlockRenderer.tsx"
Cohesion: 0.22
Nodes (8): DirectoryFilters, DirectoryMapClient(), ItemType, MAP_TILES, MapMode, spreadOverlappingMarkers(), DirectoryPage(), terrainTypesService

### Community 56 - "page.tsx"
Cohesion: 0.15
Nodes (13): InsidersAdminPage(), ParticipationCard(), profileInitials(), UserProfilePage(), InsiderBadge(), InsiderBadgeProps, positionClasses, sizeClasses (+5 more)

### Community 57 - "bulk-edit.service.ts"
Cohesion: 0.09
Nodes (16): POST(), POST(), GET(), POST(), POST(), GET(), BulkEditEntityType, BulkEditFilters (+8 more)

### Community 59 - "useAuth"
Cohesion: 0.13
Nodes (13): ALL_LANGUAGES, PageProps, LandingFormProps, LANGUAGES, CreateLandingInput, GetLandingsParams, GetLandingsResponse, Landing (+5 more)

### Community 61 - "PromotionForm.tsx"
Cohesion: 0.18
Nodes (11): FileUpload(), FileUploadProps, LANGUAGES, PromotionForm(), RichTextEditor(), RichTextEditorProps, apiClientFiles, filesService (+3 more)

### Community 62 - "editionRating.schema.ts"
Cohesion: 0.17
Nodes (9): GET(), POST(), GET(), GET(), GET(), GET(), POST(), CreateEditionRatingInput (+1 more)

### Community 64 - "TranslationService"
Cohesion: 0.12
Nodes (8): GET(), POST(), AutoTranslateInput, getOpenAIKey(), LANGUAGE_NAMES, TranslationRequest, TranslationResult, TranslationService

### Community 65 - "PromotionService"
Cohesion: 0.13
Nodes (10): GET(), POST(), POST(), DELETE(), GET(), PUT(), GET(), POST() (+2 more)

### Community 66 - "CompetitionActions.tsx"
Cohesion: 0.13
Nodes (19): CompetitionActions(), CompetitionActionsProps, GenerateTranslationsButton(), GenerateTranslationsButtonProps, TranslationStatus, LanguageSelector(), Button, ButtonProps (+11 more)

### Community 67 - "Event"
Cohesion: 0.18
Nodes (3): GET(), POST(), EventService

### Community 68 - "services.service.ts"
Cohesion: 0.13
Nodes (14): OrganizerServicesPage(), COUNTRY_FLAGS, ServiceCard(), ServiceCardProps, ServicesService, CategoriesResponse, CreateServiceInput, Service (+6 more)

### Community 69 - "LandingService"
Cohesion: 0.15
Nodes (9): CreateLandingInput, createLandingSchema, GetLandingsQuery, getLandingsSchema, TranslateLandingInput, translateLandingSchema, UpdateLandingInput, updateLandingSchema (+1 more)

### Community 70 - "route.ts"
Cohesion: 0.12
Nodes (11): ForgotPasswordInput, forgotPasswordSchema, LoginInput, loginSchema, RefreshTokenInput, refreshTokenSchema, RegisterInput, registerSchema (+3 more)

### Community 71 - "EmailTemplateService"
Cohesion: 0.21
Nodes (3): GET(), EmailService, EmailTemplateService

### Community 72 - "page.tsx"
Cohesion: 0.13
Nodes (14): GET(), POST(), DELETE(), GET(), PUT(), GET(), POST(), CreatePodiumInput (+6 more)

### Community 74 - "EventForm.tsx"
Cohesion: 0.13
Nodes (13): EventForm(), EventFormProps, ImageAssignment, ImageImportSelector(), ImageRole, Props, ROLE_COLORS, ROLE_LABELS (+5 more)

### Community 75 - "competition-admin.schema.ts"
Cohesion: 0.12
Nodes (15): ApproveCompetitionInput, ApproveCompetitionParams, approveCompetitionSchema, GetOrganizerCompetitionsQuery, getOrganizerCompetitionsSchema, GetPendingCompetitionsQuery, getPendingCompetitionsSchema, GetStatsQuery (+7 more)

### Community 76 - "SpecialSeries"
Cohesion: 0.24
Nodes (4): SpecialSeriesService, CreateSpecialSeriesInput, SpecialSeries, UpdateSpecialSeriesInput

### Community 77 - "ContentBlockConfig"
Cohesion: 0.16
Nodes (7): editionIdParamSchema, participationIdParamSchema, SearchEditionsQuery, searchEditionsSchema, UserEditionInput, userEditionSchema, UserEditionService

### Community 78 - "page.tsx"
Cohesion: 0.13
Nodes (24): annotateExisting(), bigrams(), dice(), distSim(), jaccard(), nameSim(), norm(), pct() (+16 more)

### Community 80 - "user-competition.schema.ts"
Cohesion: 0.13
Nodes (14): AddResultInput, addResultSchema, competitionIdParamSchema, GetMyCompetitionsQuery, getMyCompetitionsSchema, GetUserCompetitionsParams, getUserCompetitionsSchema, GlobalRankingParams (+6 more)

### Community 82 - "page.tsx"
Cohesion: 0.39
Nodes (7): base64UrlDecodeToString(), base64UrlToUint8Array(), EdgeTokenPayload, verifyJwtEdge(), config, intlMiddleware, middleware()

### Community 85 - "serviceCategories.service.ts"
Cohesion: 0.18
Nodes (10): PromotionCategoriesPage(), AdminPromotionsPage(), PromotionCardProps, PromotionFormProps, CreateServiceCategoryInput, ServiceCategory, UpdateServiceCategoryInput, Promotion (+2 more)

### Community 86 - "admin.schema.ts"
Cohesion: 0.14
Nodes (13): DeleteUserInput, deleteUserSchema, getStatsSchema, GetUserByIdInput, getUserByIdSchema, GetUsersInput, getUsersSchema, GetUserStatsInput (+5 more)

### Community 88 - "photos.service.ts"
Cohesion: 0.28
Nodes (7): EditionGalleryProps, photosService, EditionPhoto, PHOTO_UPLOAD_CONFIG, ReorderPhotosDTO, UpdatePhotoDTO, UploadPhotoDTO

### Community 89 - "devDependencies"
Cohesion: 0.15
Nodes (13): eslint, devDependencies, eslint, @types/js-cookie, @types/nodemailer, @types/react, @types/uuid, typescript (+5 more)

### Community 90 - "error-handler.ts"
Cohesion: 0.17
Nodes (5): ApiError, ApiResponse, Language, LANGUAGE_NAMES, LANGUAGES

### Community 92 - "page.tsx"
Cohesion: 0.25
Nodes (11): CompetitionDetailPage(), EditionSelector(), EditionSelectorCompact(), EditionSelectorProps, FAQItem, SEOFaqSchema(), SEOFaqSchemaProps, useCompetition() (+3 more)

### Community 93 - "ServiceCategoriesService"
Cohesion: 0.16
Nodes (7): DELETE(), GET(), PUT(), GET(), POST(), GET(), ServiceCategoryService

### Community 94 - ".deleteAllImportedData"
Cohesion: 0.15
Nodes (14): DashboardLayout(), DashboardLayoutProps, OrganizerLayout(), CollapsibleUserInfo(), CollapsibleUserInfoProps, DashboardNav(), NavItem, navItems (+6 more)

### Community 96 - "edition.schema.ts"
Cohesion: 0.17
Nodes (11): competitionIdSchema, CreateBulkEditionsInput, createBulkEditionsSchema, CreateEditionInput, createEditionSchema, EditionByYearParams, editionByYearSchema, editionIdSchema (+3 more)

### Community 97 - "translation.schema.ts"
Cohesion: 0.17
Nodes (11): AutoTranslateInput, autoTranslateSchema, CreateTranslationInput, createTranslationSchema, GetTranslationsQuery, getTranslationsSchema, translationIdSchema, UpdateTranslationInput (+3 more)

### Community 98 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, db:export, db:fix-home-encoding, db:import, dev, lint, prisma:generate (+5 more)

### Community 101 - "EventMap.tsx"
Cohesion: 0.20
Nodes (11): competitionsService, ApiError, ApiResponse, AuthResponse, Competition, CompetitionFilters, LoginCredentials, PaginatedResponse (+3 more)

### Community 102 - "competition.schema.ts"
Cohesion: 0.20
Nodes (9): competitionIdSchema, competitionSlugSchema, CreateCompetitionInput, createCompetitionSchema, eventIdSchema, ReorderCompetitionsInput, reorderCompetitionsSchema, UpdateCompetitionInput (+1 more)

### Community 103 - "result.schema.ts"
Cohesion: 0.20
Nodes (9): CreateResultInput, createResultSchema, GetResultsQuery, getResultsSchema, ImportResultsInput, importResultsSchema, resultIdSchema, UpdateResultInput (+1 more)

### Community 106 - "review.schema.ts"
Cohesion: 0.22
Nodes (8): CreateReviewInput, createReviewSchema, GetReviewsParams, GetReviewsQuery, getReviewsSchema, reviewIdSchema, UpdateReviewInput, updateReviewSchema

### Community 107 - "omniwallet.service.ts"
Cohesion: 0.08
Nodes (26): getEntitiesWithoutSEO(), POST(), globalForPrisma, TokenPayload, SendCouponEmailParams, CreateEmailTemplateInput, DEFAULT_TEMPLATES, UpdateEmailTemplateInput (+18 more)

### Community 108 - "WeatherCard.tsx"
Cohesion: 0.22
Nodes (9): WeatherCardProps, WeatherDetailProps, WeatherResponse, weatherService, EditionWeather, WEATHER_COLORS, WEATHER_ICONS, WeatherCondition (+1 more)

### Community 110 - "participant.schema.ts"
Cohesion: 0.25
Nodes (7): CreateParticipantInput, createParticipantSchema, GetParticipantsQuery, getParticipantsSchema, participantIdSchema, UpdateParticipantInput, updateParticipantSchema

### Community 114 - "useSlugValidation.ts"
Cohesion: 0.38
Nodes (5): SlugInput(), SlugInputProps, SlugValidationResult, useSlugValidation(), UseSlugValidationOptions

### Community 116 - "package.json"
Cohesion: 0.29
Nodes (6): description, engines, node, name, private, version

### Community 117 - "migrate-uploads-to-spaces.js"
Cohesion: 0.18
Nodes (14): convertUrl(), DRY_RUN, fileExistsOnSpaces(), fs, getAllFiles(), main(), MIME_TYPES, path (+6 more)

### Community 124 - "page.tsx"
Cohesion: 0.19
Nodes (9): fetchTotal(), HeroSection(), HeroSectionProps, Stat, HomeBlockRenderer(), MapBand(), PINS, ITEMS (+1 more)

### Community 125 - "export-local.ts"
Cohesion: 0.67
Nodes (3): exportAll(), getCoordinates(), prisma

### Community 126 - "SEOService"
Cohesion: 0.14
Nodes (4): GenerateSEOInput, SEOConfig, SEOService, UpsertConfigInput

### Community 127 - "LayoutWrapper.tsx"
Cohesion: 0.15
Nodes (11): archivo, barlow, metadata, IntlProvider(), Props, SHADOW_MAP, SiteStyles, SiteStylesProvider() (+3 more)

### Community 131 - "@types/node"
Cohesion: 0.15
Nodes (14): MagazineCategoryPage(), OrganizerPostsPage(), ArticleCard(), ArticleCardProps, ArticleGrid(), ArticleGridProps, RelatedArticles(), RelatedArticlesProps (+6 more)

### Community 138 - "EventSelect.tsx"
Cohesion: 0.15
Nodes (8): PATCH(), DELETE(), GET(), PUT(), GET(), GET(), GET(), ServiceService

### Community 140 - "clsx"
Cohesion: 0.18
Nodes (11): @aws-sdk/client-s3, js-cookie, jsonwebtoken, dependencies, @aws-sdk/client-s3, js-cookie, jsonwebtoken, @radix-ui/react-tabs (+3 more)

### Community 141 - "date-fns"
Cohesion: 0.17
Nodes (9): Competition, Edition, EventNode, FetchMode, Graph, MatchInfo, ScanResult, ScraperPage() (+1 more)

### Community 143 - "eslint-config-next"
Cohesion: 0.03
Nodes (90): POST(), DELETE(), PUT(), GET(), POST(), GET(), entityAliases, GET() (+82 more)

### Community 146 - "uuid"
Cohesion: 0.29
Nodes (8): abbreviate(), colorFor(), HEADER_COLORS, SpecialSeriesCard(), SpecialSeriesCardProps, SpecialSeriesGrid(), SpecialSeriesGridProps, SpecialSeriesListItem

### Community 152 - "@radix-ui/react-alert-dialog"
Cohesion: 0.17
Nodes (14): DELETE(), GET(), POST(), BORDER_RADIUS_OPTIONS, FONT_OPTIONS, SHADOW_OPTIONS, SiteConfig, SiteConfigPage() (+6 more)

### Community 179 - "InsiderBadge.tsx"
Cohesion: 0.08
Nodes (21): OrganizerCompetitionsPage(), OrganizerEditionsPage(), EditEventPage(), EditOrganizerPage(), OrganizersListPage(), OrganizerDashboard(), SpecialSeriesListPage(), CountrySelect() (+13 more)

### Community 180 - "impersonation.ts"
Cohesion: 0.25
Nodes (4): DELETE(), GET(), PUT(), UpdateEditionRatingInput

### Community 181 - "UserCard.tsx"
Cohesion: 0.31
Nodes (6): Avatar(), AVATAR_COLORS, colorFor(), initialsOf(), UserCardProps, PublicUser

### Community 183 - "CompetitionList.tsx"
Cohesion: 0.32
Nodes (6): CompetitionCardProps, CompetitionList(), CompetitionListCompact(), CompetitionListCompactProps, CompetitionListProps, useCompetitions()

### Community 185 - "footer.service.ts"
Cohesion: 0.19
Nodes (10): COMMUNITY, EXPLORE, Footer(), FOOTER_EXCLUDED_ROUTES, FooterLink, SOCIAL, BACKOFFICE_ROUTES, LayoutWrapper() (+2 more)

### Community 191 - "@types/js-cookie"
Cohesion: 0.33
Nodes (5): Locale, localeFlags, localeNames, locales, { Link, redirect, usePathname, useRouter }

### Community 193 - "@types/nodemailer"
Cohesion: 0.14
Nodes (19): loginSchema, POST(), POST(), POST(), registerSchema, POST(), POST(), POST() (+11 more)

### Community 195 - "route.ts"
Cohesion: 0.67
Nodes (3): POST(), SUPPORTED, SupportedType

### Community 206 - "eventManagers.service.ts"
Cohesion: 0.17
Nodes (7): AddManagerResponse, AvailableOrganizer, AvailableOrganizersResponse, EventManager, EventManagersService, ManagersResponse, RemoveManagerResponse

### Community 208 - "CompetitionService"
Cohesion: 0.09
Nodes (14): POST(), POST(), DELETE(), GET(), PATCH(), PUT(), POST(), GET() (+6 more)

### Community 209 - "EventManagersPanel.tsx"
Cohesion: 0.09
Nodes (17): ENTITY_OPTIONS, EXAMPLE_JSON, FullImportResult, ImportData, ImportResult, ImportStats, NativeImportTab(), EventManagersPanelProps (+9 more)

### Community 210 - "editionRating.service.ts"
Cohesion: 0.25
Nodes (7): createEditionRatingSchema, GetRatingsQuery, getRatingsQuerySchema, GetRecentRatingsQuery, getRecentRatingsSchema, ratingSchema, updateEditionRatingSchema

## Knowledge Gaps
- **751 isolated node(s):** `CalView`, `CalEdition`, `MONTHS_ES`, `EventMap`, `DashboardLayoutProps` (+746 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **88 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `apiClientV2` connect `requireAuth` to `admin.service.ts`, `button.tsx`, `homeConfiguration.schema.ts`, `index.ts`, `layout.tsx`, `edition.ts`, `date-fns`, `rating.ts`, `page.tsx`, `@radix-ui/react-alert-dialog`, `promotion.ts`, `PromotionForm.tsx`, `ZancadasBalance.tsx`, `serviceCategories.service.ts`, `email-templates.service.ts`, `page.tsx`, `useAuth`, `client.ts`, `services.service.ts`, `EventForm.tsx`, `eventManagers.service.ts`, `serviceCategories.service.ts`, `photos.service.ts`, `page.tsx`, `.deleteAllImportedData`, `EventMap.tsx`, `WeatherCard.tsx`, `SEOService`?**
  _High betweenness centrality (0.252) - this node is a cross-community bridge._
- **What connects `CalView`, `CalEdition`, `MONTHS_ES` to the rest of the system?**
  _760 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `requireRole` be split into smaller, more focused modules?**
  _Cohesion score 0.035379369138959935 - nodes in this community are weakly interconnected._
- **Should `admin.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06504065040650407 - nodes in this community are weakly interconnected._
- **Should `button.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14039408866995073 - nodes in this community are weakly interconnected._
- **Should `requireAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.07399577167019028 - nodes in this community are weakly interconnected._
- **Should `AdminService` be split into smaller, more focused modules?**
  _Cohesion score 0.038461538461538464 - nodes in this community are weakly interconnected._