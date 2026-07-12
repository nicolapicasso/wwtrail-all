# Graph Report - wwtrail  (2026-07-12)

## Corpus Check
- 573 files · ~278,656 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3147 nodes · 7552 edges · 199 communities (112 shown, 87 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `13c87f5e`
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
- useAuth.ts
- bulk-edit.service.ts
- SEOService
- useAuth
- EventList.tsx
- EventForm.tsx
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
- v2.ts
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
- catalogs.service.ts
- admin.schema.ts
- CatalogService
- photos.service.ts
- devDependencies
- error-handler.ts
- competition-admin.service.ts
- CountrySelect.tsx
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
- react-dom
- participant.schema.ts
- react-hook-form
- EventCard.tsx
- slugify
- useSlugValidation.ts
- route.ts
- package.json
- EditionStats.tsx
- @radix-ui/react-switch
- EventManagerService
- tailwind-merge
- tailwindcss-animate
- @tiptap/extension-text-style
- tailwind-merge
- FooterService
- export-local.ts
- page.tsx
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
- omniwallet.service.ts
- UserCompetitionService
- WeatherService
- route.ts
- useMyStats.ts
- axios
- footer.service.ts
- tailwind.config.ts
- apiClient
- cacheService
- @types/js-cookie
- DirectoryMapClient.tsx
- @types/nodemailer
- bcryptjs
- impersonation.ts
- PATCH
- PATCH
- PATCH

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
- `OrganizerCompetitionsPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/competitions/page.tsx → hooks/useAuth.ts
- `OrganizerEditionsPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/editions/page.tsx → hooks/useAuth.ts
- `MyEventsPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/events/page.tsx → hooks/useAuth.ts
- `OrganizerLayout()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/layout.tsx → contexts/AuthContext.tsx

## Import Cycles
- None detected.

## Communities (199 total, 87 thin omitted)

### Community 0 - "apiSuccess"
Cohesion: 0.10
Nodes (33): CompetitionDetailPage(), EditionCard(), EditionCardProps, EditionsGridProps, EditionSelector(), EditionSelectorCompact(), EditionSelectorProps, useCompetition() (+25 more)

### Community 1 - "requireRole"
Cohesion: 0.04
Nodes (34): adminService, GET(), adminService, GET(), adminService, GET(), PUT(), adminService (+26 more)

### Community 2 - "admin.service.ts"
Cohesion: 0.04
Nodes (41): FilterRow(), getOperatorsForType(), OPERATOR_LABELS, ENTITY_OPTIONS, EXAMPLE_JSON, FullImportResult, ImportData, ImportResult (+33 more)

### Community 3 - "button.tsx"
Cohesion: 0.13
Nodes (20): EditEditionPage(), EditEditionPageProps, EditionDetailTabs(), EditionDetailTabsProps, TODO: Get from API, TabKey, PodiumCardProps, PodiumPositionProps (+12 more)

### Community 4 - "requireAuth"
Cohesion: 0.06
Nodes (25): ORG_COLORS, OrganizersPublicPage(), orgColor(), orgInitials(), apiClientV2, Footer, FooterContent, FooterService (+17 more)

### Community 6 - "useAuth"
Cohesion: 0.06
Nodes (38): LoginPage(), RegisterPage(), DashboardPage(), NewEventPage(), NewLandingPage(), PromotionsAnalyticsPage(), EditPromotionPage(), NewPromotionPage() (+30 more)

### Community 7 - "homeConfiguration.schema.ts"
Cohesion: 0.15
Nodes (15): cache, memoryCache, CreateOrganizerInput, OrganizerFilters, UpdateOrganizerInput, CreatePromotionInput, PromotionFilters, RedeemCouponInput (+7 more)

### Community 8 - "page.tsx"
Cohesion: 0.13
Nodes (29): AdminUsersPage(), ROLE_OPTIONS, CategoryType, initialFormData, ParticipationFormData, ParticipationStatus, AddParticipationButton(), AddParticipationButtonProps (+21 more)

### Community 9 - "index.ts"
Cohesion: 0.21
Nodes (8): EditCompetitionPageProps, GenerateTranslationsButton(), GenerateTranslationsButtonProps, TranslationStatus, Button, ButtonProps, buttonVariants, TranslatableEntityType

### Community 10 - "layout.tsx"
Cohesion: 0.15
Nodes (15): Skeleton(), ZancadasBalance(), ZancadasBalanceProps, ACTION_ICONS, ACTION_LABELS, ZancadasHistory(), ZancadasHistoryProps, CompetitionMarker (+7 more)

### Community 11 - "user.service.ts"
Cohesion: 0.06
Nodes (35): autoFixEncoding(), fixCatalogEncoding(), fixCorruptedFaqs(), GET(), POST(), GET(), POST(), typeMap (+27 more)

### Community 12 - "edition.ts"
Cohesion: 0.09
Nodes (24): OrganizerCompetitionsPage(), OrganizerEditionsPage(), CompetitionCardProps, CompetitionList(), CompetitionListCompact(), CompetitionListCompactProps, CompetitionListProps, ConfirmDialog() (+16 more)

### Community 14 - "page.tsx"
Cohesion: 0.36
Nodes (6): MyRegistrationsPage(), CompetitionActions(), CompetitionActionsProps, DropdownMenuSeparator, useCompetitionStatus(), useUserCompetitions()

### Community 15 - "import.service.ts"
Cohesion: 0.11
Nodes (21): FullImport, FullImportResult, fullImportSchema, ImportCompetition, importCompetitionSchema, ImportEvent, importEventSchema, ImportOrganizer (+13 more)

### Community 16 - "EventService"
Cohesion: 0.19
Nodes (11): loginSchema, POST(), POST(), POST(), registerSchema, POST(), comparePassword(), generateTokens() (+3 more)

### Community 17 - "post.ts"
Cohesion: 0.08
Nodes (20): Competition, Edition, EventNode, FetchMode, Graph, MatchInfo, ScanResult, ScraperPage() (+12 more)

### Community 18 - "event.service.ts"
Cohesion: 0.10
Nodes (22): CreateEventInput, EventFilters, UpdateEventInput, CreatePostInput, PostFilters, UpdatePostInput, GenerateSEOInput, TODO: Implementar cuando exista CompetitionService (+14 more)

### Community 20 - "CompetitionService"
Cohesion: 0.06
Nodes (40): POST(), GET(), GET(), GET(), GET(), POST(), GET(), POST() (+32 more)

### Community 21 - "rating.ts"
Cohesion: 0.12
Nodes (18): COMPETITION_TYPES, CompetitionFilters(), CompetitionFiltersProps, COUNTRIES, FilterState, SORT_OPTIONS, CatalogService, catalogsService (+10 more)

### Community 22 - "page.tsx"
Cohesion: 0.12
Nodes (17): FileUpload(), FileUploadProps, ImageAssignment, ImageRole, Props, ROLE_COLORS, ROLE_LABELS, SuggestedImage (+9 more)

### Community 23 - "page.tsx"
Cohesion: 0.07
Nodes (37): InsidersAdminPage(), EditProfilePage(), INSIDER_COLORS, insiderColor(), InsiderData, insiderInitials(), InsidersPage(), ParticipationCard() (+29 more)

### Community 24 - "promotion.ts"
Cohesion: 0.13
Nodes (17): PromotionsService, AddCodesResponse, AddCouponCodesInput, CouponAnalyticsResponse, CouponCode, CouponRedemption, CouponRedemptionResponse, CouponStats (+9 more)

### Community 25 - "compilerOptions"
Cohesion: 0.07
Nodes (28): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+20 more)

### Community 26 - "ImportService"
Cohesion: 0.08
Nodes (27): ContentBlockConfig, ContentBlockConfigSchema, CreateHomeBlockInput, createHomeBlockSchema, CreateHomeConfigurationInput, createHomeConfigurationSchema, HomeBlockTypeSchema, HomeBlockViewTypeSchema (+19 more)

### Community 28 - "generateUniqueSlug"
Cohesion: 0.09
Nodes (22): CompetitionDetailPage(), EventDetailPage(), getMonthName(), OrganizerDetailPage(), EventMap, ServiceDetailPage(), EventGallery(), EventGalleryProps (+14 more)

### Community 29 - "Language"
Cohesion: 0.20
Nodes (9): FeaturedEvents(), LargeCard(), mediaUrl(), SmallCard(), Result, ResultType, SearchResultsHero(), toArray() (+1 more)

### Community 30 - "use-toast.ts"
Cohesion: 0.06
Nodes (42): FooterAdminPage(), ALL_LANGUAGES, EditLandingPage(), LandingsAdminPage(), SEOConfigPage(), SEOManagementPage(), PageProps, LandingForm() (+34 more)

### Community 31 - "user.service.ts"
Cohesion: 0.11
Nodes (15): ChangePasswordInput, changePasswordSchema, GetPublicUsersQuery, getPublicUsersSchema, GetUsersQuery, getUsersSchema, UpdateUserInput, updateUserSchema (+7 more)

### Community 32 - "EditionService"
Cohesion: 0.08
Nodes (13): POST(), GET(), POST(), GET(), DELETE(), GET(), PUT(), GET() (+5 more)

### Community 33 - "catalog.service.ts"
Cohesion: 0.13
Nodes (14): CreateCatalogInput, createCatalogSchema, CreateSpecialSeriesInput, createSpecialSeriesSchema, GetCatalogQuery, getCatalogQuerySchema, UpdateCatalogInput, updateCatalogSchema (+6 more)

### Community 34 - "PromotionForm.tsx"
Cohesion: 0.08
Nodes (26): EditEventPage(), EditOrganizerPage(), OrganizersListPage(), OrganizerDashboard(), SpecialSeriesListPage(), CountrySelect(), CountrySelectProps, CompetitionForm() (+18 more)

### Community 35 - "index.ts"
Cohesion: 0.15
Nodes (13): RatingCardProps, RatingFormProps, RatingSummaryProps, RecentRatingsWidgetProps, StarRatingProps, ratingsService, CreateRatingDTO, EditionRating (+5 more)

### Community 36 - "organizers.service.ts"
Cohesion: 0.06
Nodes (45): BlockConfigModal(), BlockConfigModalProps, HeroConfigForm(), HeroConfigFormProps, EditionsBlock(), EditionsBlockProps, EventsBlockProps, fetchTotal() (+37 more)

### Community 37 - "events.service.ts"
Cohesion: 0.17
Nodes (10): DELETE(), PATCH(), GET(), POST(), GET(), POST(), GET(), POST() (+2 more)

### Community 38 - "page.tsx"
Cohesion: 0.11
Nodes (15): EventManagersPanel(), EventManagersPanelProps, AccordionContent, AccordionItem, AccordionTrigger, Badge(), BadgeProps, badgeVariants (+7 more)

### Community 39 - "ZancadasBalance.tsx"
Cohesion: 0.09
Nodes (38): EventMap, ExportStats, COLUMNS, LANGUAGES, InsiderConfig, InsiderStats, ACTION_ICONS, ACTION_LABELS (+30 more)

### Community 40 - "errors.ts"
Cohesion: 0.14
Nodes (10): prisma, EditionWeather, AppError, BadRequestError, ConflictError, ForbiddenError, InternalServerError, NotFoundError (+2 more)

### Community 41 - "EditionPodiumService"
Cohesion: 0.19
Nodes (8): AgendaRow(), CalEdition, CalView, editionHref(), effDistance(), effElevation(), MONTHS_ES, MonthView()

### Community 42 - "serviceCategories.service.ts"
Cohesion: 0.10
Nodes (11): POST(), POST(), DELETE(), GET(), PATCH(), PUT(), POST(), POST() (+3 more)

### Community 43 - "home.ts"
Cohesion: 0.20
Nodes (12): DELETE(), BORDER_RADIUS_OPTIONS, FONT_OPTIONS, SHADOW_OPTIONS, SiteConfig, SiteConfigPage(), ThemePresetService, BUILTIN_PRESETS (+4 more)

### Community 44 - "user-competitions.service.ts"
Cohesion: 0.14
Nodes (10): UserStatsCards(), useUserStats(), userCompetitionsService, AddResultData, MarkCompetitionData, RankingEntry, UpdateUserCompetitionData, UserCompetition (+2 more)

### Community 46 - "email-templates.service.ts"
Cohesion: 0.18
Nodes (11): EmailTemplatesPage(), EmailTemplatesService, CreateEmailTemplateInput, EMAIL_TEMPLATE_TYPES, EmailTemplate, EmailTemplatePreviewResponse, EmailTemplateResponse, EmailTemplatesResponse (+3 more)

### Community 47 - "auth.schema.ts"
Cohesion: 0.11
Nodes (11): PromotionCategoriesPage(), AdminPromotionsPage(), PromotionCardProps, PromotionFormProps, CreateServiceCategoryInput, ServiceCategoriesService, ServiceCategory, UpdateServiceCategoryInput (+3 more)

### Community 48 - "event.schema.ts"
Cohesion: 0.10
Nodes (19): CreateEventInput, createEventSchema, eventIdSchema, EventsByCountryParams, EventsByCountryQuery, eventsByCountrySchema, eventSlugSchema, FeaturedEventsQuery (+11 more)

### Community 49 - "index.ts"
Cohesion: 0.31
Nodes (9): importService, POST(), NativeImportOptions, ENCODING_FIXES, fixEncoding(), fixString(), normalizeUnicode(), parseJsonWithEncoding() (+1 more)

### Community 50 - "ai-autofill.service.ts"
Cohesion: 0.07
Nodes (39): DELETE(), ALLOWED_CONTENT_TYPES, POST(), POST(), ALLOWED_TYPES, POST(), POST(), GET() (+31 more)

### Community 51 - "OrganizerService"
Cohesion: 0.09
Nodes (14): POST(), POST(), GET(), POST(), POST(), DELETE(), GET(), PUT() (+6 more)

### Community 52 - "page.tsx"
Cohesion: 0.29
Nodes (7): DRY, main(), prisma, repairValue(), Rule, RULES, TEXT_KEYS

### Community 53 - "page.tsx"
Cohesion: 0.09
Nodes (20): EventsService, CreateEventData, CreateEventInput, EventCompetitionSummary, EventCreatorRef, EventFilters, EventListResponse, EventNearby (+12 more)

### Community 54 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 55 - "HomeBlockRenderer.tsx"
Cohesion: 0.12
Nodes (14): MyEventsPage(), ViewMode, BulkActionsBar(), BulkActionsBarProps, EventStatusBadge(), EventStatusBadgeProps, COUNTRY_FLAGS, EventCard() (+6 more)

### Community 56 - "useAuth.ts"
Cohesion: 0.18
Nodes (10): DELETE(), GET(), PUT(), CreatePodiumInput, createPodiumSchema, UpdateChronicleInput, updateChronicleSchema, UpdatePodiumInput (+2 more)

### Community 57 - "bulk-edit.service.ts"
Cohesion: 0.09
Nodes (16): POST(), POST(), GET(), POST(), POST(), GET(), BulkEditEntityType, BulkEditFilters (+8 more)

### Community 58 - "SEOService"
Cohesion: 0.16
Nodes (3): SEOService, getOpenAIKey(), isAutoTranslateEnabled()

### Community 59 - "useAuth"
Cohesion: 0.13
Nodes (9): EventFiltersProps, EventFilters, EventList(), EventListProps, EventListSimple(), EventListSimpleProps, PaginationData, useEvents() (+1 more)

### Community 61 - "EventForm.tsx"
Cohesion: 0.22
Nodes (7): EventsBlock(), EventMedia(), MONTHS_ES, PublicEventCard(), PublicEventCardProps, StatChip(), StatChipProps

### Community 62 - "editionRating.schema.ts"
Cohesion: 0.08
Nodes (20): GET(), POST(), GET(), GET(), DELETE(), GET(), PUT(), GET() (+12 more)

### Community 64 - "TranslationService"
Cohesion: 0.14
Nodes (5): GET(), POST(), TranslationService, getTargetLanguages(), shouldTranslateByStatus()

### Community 65 - "PromotionService"
Cohesion: 0.13
Nodes (10): GET(), POST(), POST(), DELETE(), GET(), PUT(), GET(), POST() (+2 more)

### Community 66 - "CompetitionActions.tsx"
Cohesion: 0.16
Nodes (15): LanguageSelector(), Navbar(), DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuShortcut() (+7 more)

### Community 67 - "Event"
Cohesion: 0.08
Nodes (13): GET(), POST(), PATCH(), POST(), DELETE(), PUT(), PATCH(), GET() (+5 more)

### Community 68 - "services.service.ts"
Cohesion: 0.12
Nodes (15): OrganizerServicesPage(), ServicesBlock(), COUNTRY_FLAGS, ServiceCard(), ServiceCardProps, ServicesService, CategoriesResponse, CreateServiceInput (+7 more)

### Community 69 - "LandingService"
Cohesion: 0.15
Nodes (9): CreateLandingInput, createLandingSchema, GetLandingsQuery, getLandingsSchema, TranslateLandingInput, translateLandingSchema, UpdateLandingInput, updateLandingSchema (+1 more)

### Community 70 - "route.ts"
Cohesion: 0.12
Nodes (11): ForgotPasswordInput, forgotPasswordSchema, LoginInput, loginSchema, RefreshTokenInput, refreshTokenSchema, RegisterInput, registerSchema (+3 more)

### Community 71 - "EmailTemplateService"
Cohesion: 0.21
Nodes (3): POST(), EmailService, EmailTemplateService

### Community 72 - "page.tsx"
Cohesion: 0.22
Nodes (7): getCountryName(), ROLE_LABELS, StatsPage(), STATUS_LABELS, TYPE_LABELS, ComprehensiveStats, ZancadasStats

### Community 73 - "event.ts"
Cohesion: 0.17
Nodes (10): EventCardProps, ApiResponse, EventFilters, EventResponseV1, EventsResponseV1, PaginationData, Event, EventDetail (+2 more)

### Community 74 - "v2.ts"
Cohesion: 0.16
Nodes (15): GroupedSEO, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader (+7 more)

### Community 75 - "competition-admin.schema.ts"
Cohesion: 0.12
Nodes (15): ApproveCompetitionInput, ApproveCompetitionParams, approveCompetitionSchema, GetOrganizerCompetitionsQuery, getOrganizerCompetitionsSchema, GetPendingCompetitionsQuery, getPendingCompetitionsSchema, GetStatsQuery (+7 more)

### Community 76 - "SpecialSeries"
Cohesion: 0.13
Nodes (13): abbreviate(), colorFor(), HEADER_COLORS, SpecialSeriesCard(), SpecialSeriesCardProps, SpecialSeriesGrid(), SpecialSeriesGridProps, SpecialSeriesService (+5 more)

### Community 77 - "ContentBlockConfig"
Cohesion: 0.16
Nodes (7): editionIdParamSchema, participationIdParamSchema, SearchEditionsQuery, searchEditionsSchema, UserEditionInput, userEditionSchema, UserEditionService

### Community 78 - "page.tsx"
Cohesion: 0.05
Nodes (57): GET(), PUT(), POST(), GET(), autoFillCompetition(), autoFillEvent(), classifyImage(), CompetitionAutoFillResult (+49 more)

### Community 80 - "user-competition.schema.ts"
Cohesion: 0.13
Nodes (14): AddResultInput, addResultSchema, competitionIdParamSchema, GetMyCompetitionsQuery, getMyCompetitionsSchema, GetUserCompetitionsParams, getUserCompetitionsSchema, GlobalRankingParams (+6 more)

### Community 82 - "page.tsx"
Cohesion: 0.39
Nodes (7): base64UrlDecodeToString(), base64UrlToUint8Array(), EdgeTokenPayload, verifyJwtEdge(), config, intlMiddleware, middleware()

### Community 86 - "admin.schema.ts"
Cohesion: 0.14
Nodes (13): DeleteUserInput, deleteUserSchema, getStatsSchema, GetUserByIdInput, getUserByIdSchema, GetUsersInput, getUsersSchema, GetUserStatsInput (+5 more)

### Community 88 - "photos.service.ts"
Cohesion: 0.28
Nodes (7): EditionGalleryProps, photosService, EditionPhoto, PHOTO_UPLOAD_CONFIG, ReorderPhotosDTO, UpdatePhotoDTO, UploadPhotoDTO

### Community 89 - "devDependencies"
Cohesion: 0.15
Nodes (13): autoprefixer, eslint, devDependencies, autoprefixer, eslint, @types/node, @types/react, @types/uuid (+5 more)

### Community 90 - "error-handler.ts"
Cohesion: 0.17
Nodes (5): ApiError, ApiResponse, Language, LANGUAGE_NAMES, LANGUAGES

### Community 91 - "competition-admin.service.ts"
Cohesion: 0.17
Nodes (6): CompetitionAdminService, GetOrganizerOptions, GetPendingOptions, PaginatedCompetitions, TODO: Enviar notificación al organizador, TODO: Enviar notificación al organizador con razón

### Community 92 - "CountrySelect.tsx"
Cohesion: 0.14
Nodes (7): EditionParticipants(), EventMap(), EventMapMarker, EventMapProps, MAP_TILES, MapMode, spreadOverlappingMarkers()

### Community 93 - "ServiceCategoriesService"
Cohesion: 0.16
Nodes (7): DELETE(), GET(), PUT(), GET(), POST(), GET(), ServiceCategoryService

### Community 94 - ".deleteAllImportedData"
Cohesion: 0.18
Nodes (11): DashboardLayout(), DashboardLayoutProps, OrganizerLayout(), CollapsibleUserInfo(), CollapsibleUserInfoProps, DashboardNav(), NavItem, navItems (+3 more)

### Community 96 - "edition.schema.ts"
Cohesion: 0.17
Nodes (11): competitionIdSchema, CreateBulkEditionsInput, createBulkEditionsSchema, CreateEditionInput, createEditionSchema, EditionByYearParams, editionByYearSchema, editionIdSchema (+3 more)

### Community 97 - "translation.schema.ts"
Cohesion: 0.17
Nodes (11): AutoTranslateInput, autoTranslateSchema, CreateTranslationInput, createTranslationSchema, GetTranslationsQuery, getTranslationsSchema, translationIdSchema, UpdateTranslationInput (+3 more)

### Community 98 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, db:export, db:fix-home-encoding, db:import, dev, lint, prisma:generate (+5 more)

### Community 99 - "dependencies"
Cohesion: 0.22
Nodes (9): WeatherCardProps, WeatherDetailProps, WeatherResponse, weatherService, EditionWeather, WEATHER_COLORS, WEATHER_ICONS, WeatherCondition (+1 more)

### Community 101 - "EventMap.tsx"
Cohesion: 0.23
Nodes (10): ApiError, ApiResponse, AuthResponse, Competition, CompetitionFilters, LoginCredentials, PaginatedResponse, RegisterData (+2 more)

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
Nodes (25): ALLOWED_TYPES, POST(), POST(), getEntitiesWithoutSEO(), POST(), readAccessTokenPayload(), signAccessToken(), globalForPrisma (+17 more)

### Community 110 - "participant.schema.ts"
Cohesion: 0.25
Nodes (7): CreateParticipantInput, createParticipantSchema, GetParticipantsQuery, getParticipantsSchema, participantIdSchema, UpdateParticipantInput, updateParticipantSchema

### Community 114 - "useSlugValidation.ts"
Cohesion: 0.38
Nodes (5): SlugInput(), SlugInputProps, SlugValidationResult, useSlugValidation(), UseSlugValidationOptions

### Community 116 - "package.json"
Cohesion: 0.29
Nodes (6): description, engines, node, name, private, version

### Community 117 - "EditionStats.tsx"
Cohesion: 0.40
Nodes (3): EditionStatsCompactProps, EditionStatsProps, EditionStats

### Community 124 - "FooterService"
Cohesion: 0.15
Nodes (12): COMPETITION_TYPES, COUNTRIES, FilterState, SORT_OPTIONS, CompetitionCard(), CompetitionCardCompactProps, CompetitionCardProps, COUNTRY_FLAGS (+4 more)

### Community 125 - "export-local.ts"
Cohesion: 0.67
Nodes (3): exportAll(), getCoordinates(), prisma

### Community 127 - "LayoutWrapper.tsx"
Cohesion: 0.15
Nodes (11): archivo, barlow, metadata, IntlProvider(), Props, SHADOW_MAP, SiteStyles, SiteStylesProvider() (+3 more)

### Community 131 - "@types/node"
Cohesion: 0.09
Nodes (25): MagazineCategoryPage(), OrganizerPostsPage(), ArticleCard(), ArticleCardProps, ArticleGrid(), ArticleGridProps, PostsBlock(), PostForm() (+17 more)

### Community 138 - "EventSelect.tsx"
Cohesion: 0.21
Nodes (5): DELETE(), GET(), PUT(), GET(), ServiceService

### Community 140 - "clsx"
Cohesion: 0.18
Nodes (11): @aws-sdk/client-s3, js-cookie, jsonwebtoken, dependencies, @aws-sdk/client-s3, js-cookie, jsonwebtoken, @radix-ui/react-tabs (+3 more)

### Community 143 - "eslint-config-next"
Cohesion: 0.03
Nodes (85): DELETE(), PUT(), GET(), POST(), GET(), entityAliases, GET(), GET() (+77 more)

### Community 179 - "omniwallet.service.ts"
Cohesion: 0.22
Nodes (8): AddPointsData, CreateCustomerData, CustomerAttributes, CustomerLinks, CustomerResponse, OmniwalletConfig, TransactionAttributes, TransactionResponse

### Community 182 - "route.ts"
Cohesion: 0.67
Nodes (3): POST(), SUPPORTED, SupportedType

### Community 185 - "footer.service.ts"
Cohesion: 0.19
Nodes (10): COMMUNITY, EXPLORE, Footer(), FOOTER_EXCLUDED_ROUTES, FooterLink, SOCIAL, BACKOFFICE_ROUTES, LayoutWrapper() (+2 more)

### Community 192 - "DirectoryMapClient.tsx"
Cohesion: 0.29
Nodes (7): DirectoryFilters, DirectoryMapClient(), ItemType, MAP_TILES, MapMode, spreadOverlappingMarkers(), terrainTypesService

### Community 197 - "impersonation.ts"
Cohesion: 0.80
Nodes (3): ImpersonationBar(), getImpersonatedName(), stopImpersonation()

## Knowledge Gaps
- **759 isolated node(s):** `CalView`, `CalEdition`, `MONTHS_ES`, `EventMap`, `DashboardLayoutProps` (+754 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **87 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `apiClientV2` connect `requireAuth` to `apiSuccess`, `admin.service.ts`, `button.tsx`, `@types/node`, `useAuth`, `layout.tsx`, `edition.ts`, `post.ts`, `rating.ts`, `page.tsx`, `promotion.ts`, `use-toast.ts`, `PromotionForm.tsx`, `index.ts`, `organizers.service.ts`, `ZancadasBalance.tsx`, `home.ts`, `email-templates.service.ts`, `auth.schema.ts`, `page.tsx`, `services.service.ts`, `impersonation.ts`, `event.ts`, `v2.ts`, `SpecialSeries`, `photos.service.ts`, `dependencies`, `EventMap.tsx`?**
  _High betweenness centrality (0.247) - this node is a cross-community bridge._
- **What connects `CalView`, `CalEdition`, `MONTHS_ES` to the rest of the system?**
  _768 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `apiSuccess` be split into smaller, more focused modules?**
  _Cohesion score 0.0975609756097561 - nodes in this community are weakly interconnected._
- **Should `requireRole` be split into smaller, more focused modules?**
  _Cohesion score 0.035379369138959935 - nodes in this community are weakly interconnected._
- **Should `admin.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04480874316939891 - nodes in this community are weakly interconnected._
- **Should `button.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1310483870967742 - nodes in this community are weakly interconnected._
- **Should `requireAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.05939716312056738 - nodes in this community are weakly interconnected._