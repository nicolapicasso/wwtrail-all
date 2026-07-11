# Graph Report - wwtrail  (2026-07-11)

## Corpus Check
- 488 files · ~262,112 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2859 nodes · 6483 edges · 181 communities (102 shown, 79 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `68640fe7`
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
- Service
- SpecialSeries
- user-competition.schema.ts
- OmniwalletService
- page.tsx
- userEdition.schema.ts
- EventManagersPanel.tsx
- catalogs.service.ts
- admin.schema.ts
- CatalogService
- photos.service.ts
- devDependencies
- error-handler.ts
- competition-admin.service.ts
- types.ts
- TranslationsService
- edition.schema.ts
- translation.schema.ts
- scripts
- dependencies
- PostsService
- SEOService
- competition.schema.ts
- result.schema.ts
- SpecialSeriesService
- route.ts
- review.schema.ts
- omniwallet.service.ts
- participant.schema.ts
- ServiceService
- useSlugValidation.ts
- bcryptjs
- package.json
- EditionStats.tsx
- @radix-ui/react-switch
- EventManagerService
- FavoritesService
- client.ts
- sharp
- tailwind-merge
- FooterService
- export-local.ts
- page.tsx
- useUserCompetitions
- route.ts
- StatsCard.tsx
- StatsCard.tsx
- favorites.schema.ts
- next.config.js
- axios
- EventSelect.tsx
- class-variance-authority
- clsx
- date-fns
- entrypoint.sh
- eslint-config-next
- @hookform/resolvers
- leaflet
- lucide-react
- next
- next-intl
- nodemailer
- @prisma/client
- @radix-ui/react-accordion
- @radix-ui/react-alert-dialog
- @radix-ui/react-dialog
- @radix-ui/react-dropdown-menu
- @radix-ui/react-label
- @radix-ui/react-select
- @radix-ui/react-slot
- @radix-ui/react-toast
- react-dom
- react-hook-form
- slugify
- sonner
- tailwindcss-animate
- @tiptap/extension-color
- @tiptap/extension-image
- @tiptap/extension-link
- @tiptap/extension-text-align
- @tiptap/extension-text-style
- @tiptap/extension-underline
- @tiptap/starter-kit
- uuid
- yet-another-react-lightbox
- zod
- postcss
- prisma
- tsx
- @types/bcryptjs
- @types/jsonwebtoken
- @types/leaflet
- @types/js-cookie
- @types/react-dom
- @types/nodemailer
- tailwind.config.ts
- apiClient
- cacheService
- react

## God Nodes (most connected - your core abstractions)
1. `apiSuccess()` - 276 edges
2. `apiError` - 275 edges
3. `requireRole()` - 164 edges
4. `useAuth()` - 74 edges
5. `AdminService` - 65 edges
6. `Button` - 41 edges
7. `requireAuth()` - 40 edges
8. `ImportService` - 37 edges
9. `AdminService` - 35 edges
10. `cn()` - 35 edges

## Surprising Connections (you probably didn't know these)
- `LoginPage()` --calls--> `useAuth()`  [EXTRACTED]
  wwtrail/app/[locale]/auth/login/page.tsx → wwtrail/contexts/AuthContext.tsx
- `RegisterPage()` --calls--> `useAuth()`  [EXTRACTED]
  wwtrail/app/[locale]/auth/register/page.tsx → wwtrail/contexts/AuthContext.tsx
- `MagazineCategoryPage()` --indirect_call--> `PostCategory`  [INFERRED]
  wwtrail/app/[locale]/magazine/[category]/page.tsx → wwtrail/types/post.ts
- `NewEventPage()` --calls--> `useAuth()`  [EXTRACTED]
  wwtrail/app/[locale]/organizer/events/new/page.tsx → wwtrail/contexts/AuthContext.tsx
- `MyEventsPage()` --calls--> `useAuth()`  [EXTRACTED]
  wwtrail/app/[locale]/organizer/events/page.tsx → wwtrail/hooks/useAuth.ts

## Import Cycles
- None detected.

## Communities (181 total, 79 thin omitted)

### Community 0 - "apiSuccess"
Cohesion: 0.05
Nodes (66): POST(), autoFixEncoding(), fixCatalogEncoding(), fixCorruptedFaqs(), GET(), POST(), GET(), POST() (+58 more)

### Community 1 - "requireRole"
Cohesion: 0.04
Nodes (28): adminService, GET(), adminService, GET(), adminService, GET(), adminService, GET() (+20 more)

### Community 2 - "admin.service.ts"
Cohesion: 0.04
Nodes (41): FilterRow(), getOperatorsForType(), OPERATOR_LABELS, ENTITY_OPTIONS, EXAMPLE_JSON, FullImportResult, ImportData, ImportResult (+33 more)

### Community 3 - "button.tsx"
Cohesion: 0.09
Nodes (43): LoginPage(), RegisterPage(), ExportStats, COLUMNS, LANGUAGES, InsiderConfig, InsiderStats, ACTION_ICONS (+35 more)

### Community 4 - "requireAuth"
Cohesion: 0.09
Nodes (19): GET(), GET(), GET(), POST(), GET(), GET(), GET(), GET() (+11 more)

### Community 6 - "useAuth"
Cohesion: 0.06
Nodes (34): DashboardPage(), FooterAdminPage(), ALL_LANGUAGES, EditLandingPage(), LandingsAdminPage(), PromotionsAnalyticsPage(), EditPromotionPage(), NewPromotionPage() (+26 more)

### Community 7 - "homeConfiguration.schema.ts"
Cohesion: 0.09
Nodes (21): ContentBlockConfig, ContentBlockConfigSchema, createHomeBlockSchema, createHomeConfigurationSchema, HomeBlockTypeSchema, HomeBlockViewTypeSchema, HomeTextSizeSchema, HomeTextVariantSchema (+13 more)

### Community 8 - "page.tsx"
Cohesion: 0.06
Nodes (48): GroupedSEO, SEOManagementPage(), AdminUsersPage(), ROLE_OPTIONS, CategoryType, initialFormData, ParticipationFormData, ParticipationStatus (+40 more)

### Community 9 - "index.ts"
Cohesion: 0.05
Nodes (41): POST(), POST(), GET(), POST(), toSpacesCdn(), adminService, GET(), PUT() (+33 more)

### Community 10 - "layout.tsx"
Cohesion: 0.14
Nodes (13): archivo, barlow, metadata, BACKOFFICE_ROUTES, LayoutWrapper(), LayoutWrapperProps, NO_FOOTER_ROUTES, IntlProvider() (+5 more)

### Community 11 - "user.service.ts"
Cohesion: 0.10
Nodes (29): InsidersAdminPage(), InsiderData, InsidersPage(), ParticipationCard(), UserProfilePage(), InsiderBadge(), InsiderBadgeProps, positionClasses (+21 more)

### Community 12 - "edition.ts"
Cohesion: 0.09
Nodes (37): EditEditionPageProps, ConfirmDialog(), ConfirmDialogProps, EditionCard(), EditionCardProps, EditionsGridProps, EditionFormProps, competitionsService (+29 more)

### Community 13 - "competition.ts"
Cohesion: 0.24
Nodes (8): CompetitionCardProps, CompetitionList(), CompetitionListCompact(), CompetitionListCompactProps, CompetitionListProps, UseCompetitionResult, useCompetitions(), UseCompetitionsResult

### Community 14 - "page.tsx"
Cohesion: 0.12
Nodes (18): DELETE(), PATCH(), POST(), GET(), POST(), POST(), GET(), POST() (+10 more)

### Community 15 - "import.service.ts"
Cohesion: 0.17
Nodes (12): FullImport, FullImportResult, fullImportSchema, ImportCompetition, importCompetitionSchema, ImportEvent, importEventSchema, ImportOrganizer (+4 more)

### Community 17 - "post.ts"
Cohesion: 0.12
Nodes (11): ForgotPasswordInput, forgotPasswordSchema, LoginInput, loginSchema, RefreshTokenInput, refreshTokenSchema, RegisterInput, registerSchema (+3 more)

### Community 18 - "event.service.ts"
Cohesion: 0.13
Nodes (19): prisma, CreatePostInput, PostFilters, UpdatePostInput, GenerateSEOInput, TODO: Implementar cuando exista CompetitionService, TODO: Implementar cuando exista PostService, SEOResult (+11 more)

### Community 21 - "rating.ts"
Cohesion: 0.22
Nodes (11): PodiumCardProps, PodiumPositionProps, PodiumFormProps, podiumsService, CreatePodiumDTO, EditionPodium, MEDAL_EMOJIS, PODIUM_TYPE_LABELS (+3 more)

### Community 23 - "page.tsx"
Cohesion: 0.11
Nodes (19): EditCompetitionPageProps, NewLandingPage(), EditServicePage(), EventManagersPanel(), EventManagersPanelProps, GenerateTranslationsButton(), GenerateTranslationsButtonProps, TranslationStatus (+11 more)

### Community 24 - "promotion.ts"
Cohesion: 0.13
Nodes (17): PromotionsService, AddCodesResponse, AddCouponCodesInput, CouponAnalyticsResponse, CouponCode, CouponRedemption, CouponRedemptionResponse, CouponStats (+9 more)

### Community 25 - "compilerOptions"
Cohesion: 0.07
Nodes (28): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+20 more)

### Community 26 - "ImportService"
Cohesion: 0.13
Nodes (19): loginSchema, POST(), POST(), POST(), registerSchema, POST(), GET(), POST() (+11 more)

### Community 27 - "HomeService"
Cohesion: 0.06
Nodes (49): BlockConfigModal(), BlockConfigModalProps, HeroConfigForm(), HeroConfigFormProps, CompetitionsBlock(), CompetitionsBlockProps, EditionsBlock(), EditionsBlockProps (+41 more)

### Community 28 - "generateUniqueSlug"
Cohesion: 0.08
Nodes (23): cache, memoryCache, CreateEventInput, EventFilters, UpdateEventInput, CreateOrganizerInput, OrganizerFilters, UpdateOrganizerInput (+15 more)

### Community 29 - "Language"
Cohesion: 0.16
Nodes (12): FileUpload(), LANGUAGES, PromotionForm(), PromotionFormProps, RichTextEditor(), RichTextEditorProps, apiClientFiles, filesService (+4 more)

### Community 30 - "use-toast.ts"
Cohesion: 0.12
Nodes (23): Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle, toastVariants (+15 more)

### Community 31 - "user.service.ts"
Cohesion: 0.11
Nodes (15): ChangePasswordInput, changePasswordSchema, GetPublicUsersQuery, getPublicUsersSchema, GetUsersQuery, getUsersSchema, UpdateUserInput, updateUserSchema (+7 more)

### Community 32 - "EditionService"
Cohesion: 0.11
Nodes (9): GET(), GET(), DELETE(), GET(), PUT(), GET(), POST(), GET() (+1 more)

### Community 33 - "catalog.service.ts"
Cohesion: 0.13
Nodes (14): CreateCatalogInput, createCatalogSchema, CreateSpecialSeriesInput, createSpecialSeriesSchema, GetCatalogQuery, getCatalogQuerySchema, UpdateCatalogInput, updateCatalogSchema (+6 more)

### Community 34 - "PromotionForm.tsx"
Cohesion: 0.24
Nodes (9): RatingFormProps, RecentRatingsWidgetProps, ratingsService, CreateRatingDTO, EditionRating, RATING_CRITERIA, RatingCriterion, RatingsResponse (+1 more)

### Community 35 - "index.ts"
Cohesion: 0.08
Nodes (24): MagazineCategoryPage(), NewEventPage(), OrganizerPostsPage(), ArticleCard(), ArticleCardProps, ArticleGrid(), ArticleGridProps, FileUploadProps (+16 more)

### Community 36 - "organizers.service.ts"
Cohesion: 0.09
Nodes (15): ORG_COLORS, OrganizersPublicPage(), orgColor(), orgInitials(), MyStats, apiClientV1, apiClientV2, Footer (+7 more)

### Community 37 - "events.service.ts"
Cohesion: 0.22
Nodes (9): WeatherCardProps, WeatherDetailProps, WeatherResponse, weatherService, EditionWeather, WEATHER_COLORS, WEATHER_ICONS, WeatherCondition (+1 more)

### Community 39 - "ZancadasBalance.tsx"
Cohesion: 0.12
Nodes (18): ProfilePage(), Skeleton(), ZancadasBalance(), ZancadasBalanceProps, ACTION_ICONS, ACTION_LABELS, ZancadasHistory(), ZancadasHistoryProps (+10 more)

### Community 40 - "errors.ts"
Cohesion: 0.06
Nodes (19): CreatePodiumInput, createPodiumSchema, UpdateChronicleInput, updateChronicleSchema, UpdatePodiumInput, updatePodiumSchema, EditionPodiumService, prisma (+11 more)

### Community 41 - "EditionPodiumService"
Cohesion: 0.19
Nodes (8): AgendaRow(), CalEdition, CalView, editionHref(), effDistance(), effElevation(), MONTHS_ES, MonthView()

### Community 42 - "serviceCategories.service.ts"
Cohesion: 0.29
Nodes (5): AdminPromotionsPage(), PromotionCardProps, Promotion, PromotionStatus, PromotionType

### Community 43 - "home.ts"
Cohesion: 0.23
Nodes (11): BORDER_RADIUS_OPTIONS, FONT_OPTIONS, SHADOW_OPTIONS, SiteConfig, SiteConfigPage(), ThemePresetService, BUILTIN_PRESETS, pickThemeValues() (+3 more)

### Community 44 - "user-competitions.service.ts"
Cohesion: 0.14
Nodes (10): UserStatsCards(), useUserStats(), userCompetitionsService, AddResultData, MarkCompetitionData, RankingEntry, UpdateUserCompetitionData, UserCompetition (+2 more)

### Community 45 - "apiClientV2"
Cohesion: 0.17
Nodes (7): AddManagerResponse, AvailableOrganizer, AvailableOrganizersResponse, EventManager, EventManagersService, ManagersResponse, RemoveManagerResponse

### Community 46 - "email-templates.service.ts"
Cohesion: 0.18
Nodes (11): EmailTemplatesPage(), EmailTemplatesService, CreateEmailTemplateInput, EMAIL_TEMPLATE_TYPES, EmailTemplate, EmailTemplatePreviewResponse, EmailTemplateResponse, EmailTemplatesResponse (+3 more)

### Community 47 - "auth.schema.ts"
Cohesion: 0.16
Nodes (8): ParticipationsPage(), editionIdParamSchema, participationIdParamSchema, SearchEditionsQuery, searchEditionsSchema, UserEditionInput, userEditionSchema, UserEditionService

### Community 48 - "event.schema.ts"
Cohesion: 0.10
Nodes (19): CreateEventInput, createEventSchema, eventIdSchema, EventsByCountryParams, EventsByCountryQuery, eventsByCountrySchema, eventSlugSchema, FeaturedEventsQuery (+11 more)

### Community 49 - "index.ts"
Cohesion: 0.08
Nodes (25): OrganizerCompetitionsPage(), OrganizerEditionsPage(), EditEventPage(), EditOrganizerPage(), OrganizersListPage(), SpecialSeriesListPage(), CompetitionForm(), CompetitionFormProps (+17 more)

### Community 50 - "ai-autofill.service.ts"
Cohesion: 0.06
Nodes (50): DELETE(), ALLOWED_CONTENT_TYPES, POST(), ALLOWED_TYPES, POST(), ALLOWED_TYPES, POST(), POST() (+42 more)

### Community 51 - "OrganizerService"
Cohesion: 0.15
Nodes (7): DELETE(), GET(), PUT(), GET(), POST(), GET(), OrganizerService

### Community 52 - "page.tsx"
Cohesion: 0.29
Nodes (7): DRY, main(), prisma, repairValue(), Rule, RULES, TEXT_KEYS

### Community 53 - "page.tsx"
Cohesion: 0.04
Nodes (45): MyEventsPage(), ViewMode, BulkActionsBar(), BulkActionsBarProps, EventCardProps, EventStatusBadge(), EventStatusBadgeProps, COUNTRY_FLAGS (+37 more)

### Community 54 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 55 - "HomeBlockRenderer.tsx"
Cohesion: 0.21
Nodes (4): RatingCardProps, RatingSummaryProps, StarRatingProps, RatingSummary

### Community 56 - "useAuth.ts"
Cohesion: 0.19
Nodes (10): AuthContextType, AuthContextValue, AuthService, createResponseInterceptor(), AuthResponse, LoginCredentials, RefreshTokenResponse, RegisterData (+2 more)

### Community 57 - "bulk-edit.service.ts"
Cohesion: 0.15
Nodes (10): BulkEditEntityType, BulkEditFilters, BulkEditOperation, BulkEditPreview, BulkEditResult, BulkEditService, EntityMetadata, FieldMetadata (+2 more)

### Community 58 - "SEOService"
Cohesion: 0.16
Nodes (3): getOpenAIKey(), SEOService, getOpenAIKey()

### Community 59 - "useAuth"
Cohesion: 0.13
Nodes (13): DirectoryFilters, DirectoryMapClient(), ItemType, MAP_TILES, MapMode, spreadOverlappingMarkers(), CountrySelect(), CountrySelectProps (+5 more)

### Community 60 - "EventList.tsx"
Cohesion: 0.09
Nodes (18): EventFilters, EventList(), EventListProps, EventListSimple(), EventListSimpleProps, FeaturedEvents(), LargeCard(), mediaUrl() (+10 more)

### Community 61 - "EventForm.tsx"
Cohesion: 0.22
Nodes (6): COMPETITION_TYPES, COUNTRIES, FilterState, SORT_OPTIONS, CompetitionGridSkeleton(), competitionsService

### Community 62 - "editionRating.schema.ts"
Cohesion: 0.13
Nodes (10): CreateEditionRatingInput, createEditionRatingSchema, GetRatingsQuery, getRatingsQuerySchema, GetRecentRatingsQuery, getRecentRatingsSchema, ratingSchema, UpdateEditionRatingInput (+2 more)

### Community 63 - "ExportService"
Cohesion: 0.24
Nodes (3): ExportOptions, ExportResult, ExportService

### Community 65 - "PromotionService"
Cohesion: 0.18
Nodes (7): DELETE(), GET(), PUT(), GET(), POST(), GET(), PromotionService

### Community 66 - "CompetitionActions.tsx"
Cohesion: 0.15
Nodes (17): CompetitionActionsProps, LanguageSelector(), Navbar(), DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem (+9 more)

### Community 67 - "Event"
Cohesion: 0.18
Nodes (10): ConflictItem, ConflictResolution, EntityType, LANGUAGE_MAPPING, NativeImportFile, NativeImportOptions, NativeImportResult, NativeImportResultItem (+2 more)

### Community 68 - "services.service.ts"
Cohesion: 0.12
Nodes (14): OrganizerServicesPage(), COUNTRY_FLAGS, ServiceCard(), ServiceCardProps, ServicesService, CategoriesResponse, CreateServiceInput, Service (+6 more)

### Community 69 - "LandingService"
Cohesion: 0.15
Nodes (9): CreateLandingInput, createLandingSchema, GetLandingsQuery, getLandingsSchema, TranslateLandingInput, translateLandingSchema, UpdateLandingInput, updateLandingSchema (+1 more)

### Community 70 - "route.ts"
Cohesion: 0.22
Nodes (7): getCountryName(), ROLE_LABELS, StatsPage(), STATUS_LABELS, TYPE_LABELS, ComprehensiveStats, ZancadasStats

### Community 72 - "page.tsx"
Cohesion: 0.33
Nodes (6): EventMap(), EventMapMarker, EventMapProps, MAP_TILES, MapMode, spreadOverlappingMarkers()

### Community 75 - "competition-admin.schema.ts"
Cohesion: 0.12
Nodes (15): ApproveCompetitionInput, ApproveCompetitionParams, approveCompetitionSchema, GetOrganizerCompetitionsQuery, getOrganizerCompetitionsSchema, GetPendingCompetitionsQuery, getPendingCompetitionsSchema, GetStatsQuery (+7 more)

### Community 76 - "SpecialSeries"
Cohesion: 0.12
Nodes (16): abbreviate(), colorFor(), HEADER_COLORS, SpecialSeriesCard(), SpecialSeriesCardProps, SpecialSeriesGrid(), SpecialSeriesGridProps, SpecialSeriesService (+8 more)

### Community 77 - "ContentBlockConfig"
Cohesion: 0.33
Nodes (8): EditEditionPage(), EditionDetailTabs(), EditionDetailTabsProps, TODO: Get from API, TabKey, usePodiums(), useRatings(), useWeather()

### Community 78 - "Service"
Cohesion: 0.33
Nodes (6): PromotionCategoriesPage(), ServiceCategoriesAdminPage(), CreateServiceCategoryInput, ServiceCategory, ServiceCategoryWithCount, UpdateServiceCategoryInput

### Community 79 - "SpecialSeries"
Cohesion: 0.29
Nodes (6): ENTITY_CONFIGS, EntityConfig, EntityStats, EntityType, TranslationsDashboardPage(), TranslationStats

### Community 80 - "user-competition.schema.ts"
Cohesion: 0.13
Nodes (14): AddResultInput, addResultSchema, competitionIdParamSchema, GetMyCompetitionsQuery, getMyCompetitionsSchema, GetUserCompetitionsParams, getUserCompetitionsSchema, GlobalRankingParams (+6 more)

### Community 82 - "page.tsx"
Cohesion: 0.39
Nodes (7): base64UrlDecodeToString(), base64UrlToUint8Array(), EdgeTokenPayload, verifyJwtEdge(), config, intlMiddleware, middleware()

### Community 85 - "catalogs.service.ts"
Cohesion: 0.08
Nodes (24): CompetitionCard(), CompetitionCardCompactProps, CompetitionCardProps, COUNTRY_FLAGS, COMPETITION_TYPES, CompetitionFilters(), CompetitionFiltersProps, COUNTRIES (+16 more)

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

### Community 93 - "types.ts"
Cohesion: 0.23
Nodes (10): ApiError, ApiResponse, AuthResponse, Competition, CompetitionFilters, LoginCredentials, PaginatedResponse, RegisterData (+2 more)

### Community 95 - "TranslationsService"
Cohesion: 0.16
Nodes (5): BulkTranslationResponse, EntityStats, TranslationResponse, TranslationsService, TranslationStatsResponse

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
Cohesion: 0.18
Nodes (11): @aws-sdk/client-s3, js-cookie, jsonwebtoken, dependencies, @aws-sdk/client-s3, js-cookie, jsonwebtoken, @radix-ui/react-tabs (+3 more)

### Community 101 - "SEOService"
Cohesion: 0.05
Nodes (37): CompetitionDetailPage(), EventMap, CompetitionDetailPage(), EventDetailPage(), getMonthName(), OrganizerDetailPage(), EventMap, ServiceDetailPage() (+29 more)

### Community 102 - "competition.schema.ts"
Cohesion: 0.20
Nodes (9): competitionIdSchema, competitionSlugSchema, CreateCompetitionInput, createCompetitionSchema, eventIdSchema, ReorderCompetitionsInput, reorderCompetitionsSchema, UpdateCompetitionInput (+1 more)

### Community 103 - "result.schema.ts"
Cohesion: 0.20
Nodes (9): CreateResultInput, createResultSchema, GetResultsQuery, getResultsSchema, ImportResultsInput, importResultsSchema, resultIdSchema, UpdateResultInput (+1 more)

### Community 104 - "SpecialSeriesService"
Cohesion: 0.29
Nodes (6): COMMUNITY, EXPLORE, Footer(), FOOTER_EXCLUDED_ROUTES, FooterLink, SOCIAL

### Community 106 - "review.schema.ts"
Cohesion: 0.22
Nodes (8): CreateReviewInput, createReviewSchema, GetReviewsParams, GetReviewsQuery, getReviewsSchema, reviewIdSchema, UpdateReviewInput, updateReviewSchema

### Community 107 - "omniwallet.service.ts"
Cohesion: 0.10
Nodes (23): globalForPrisma, TokenPayload, SendCouponEmailParams, CreateEmailTemplateInput, UpdateEmailTemplateInput, AddManagerInput, EventManagerWithUser, UpdateFooterInput (+15 more)

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

### Community 121 - "client.ts"
Cohesion: 0.22
Nodes (12): importService, POST(), DELETE(), GET(), importService, POST(), ENCODING_FIXES, fixEncoding() (+4 more)

### Community 125 - "export-local.ts"
Cohesion: 0.67
Nodes (3): exportAll(), getCoordinates(), prisma

### Community 127 - "useUserCompetitions"
Cohesion: 0.50
Nodes (4): MyRegistrationsPage(), CompetitionActions(), useCompetitionStatus(), useUserCompetitions()

### Community 191 - "react"
Cohesion: 0.18
Nodes (11): DashboardLayout(), DashboardLayoutProps, OrganizerLayout(), CollapsibleUserInfo(), CollapsibleUserInfoProps, DashboardNav(), NavItem, navItems (+3 more)

## Knowledge Gaps
- **719 isolated node(s):** `CalView`, `CalEdition`, `MONTHS_ES`, `EventMap`, `DashboardLayoutProps` (+714 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **79 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `apiClientV2` connect `organizers.service.ts` to `admin.service.ts`, `button.tsx`, `useAuth`, `user.service.ts`, `edition.ts`, `rating.ts`, `promotion.ts`, `HomeService`, `PromotionForm.tsx`, `index.ts`, `events.service.ts`, `ZancadasBalance.tsx`, `home.ts`, `apiClientV2`, `email-templates.service.ts`, `index.ts`, `page.tsx`, `SpecialSeries`, `Service`, `catalogs.service.ts`, `photos.service.ts`, `types.ts`, `TranslationsService`, `SEOService`?**
  _High betweenness centrality (0.253) - this node is a cross-community bridge._
- **What connects `CalView`, `CalEdition`, `MONTHS_ES` to the rest of the system?**
  _728 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `apiSuccess` be split into smaller, more focused modules?**
  _Cohesion score 0.05196717862402693 - nodes in this community are weakly interconnected._
- **Should `requireRole` be split into smaller, more focused modules?**
  _Cohesion score 0.03989071038251366 - nodes in this community are weakly interconnected._
- **Should `admin.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04480874316939891 - nodes in this community are weakly interconnected._
- **Should `button.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08647936786654961 - nodes in this community are weakly interconnected._
- **Should `requireAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._