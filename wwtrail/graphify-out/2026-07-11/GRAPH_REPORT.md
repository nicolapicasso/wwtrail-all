# Graph Report - wwtrail  (2026-07-11)

## Corpus Check
- 498 files · ~266,835 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2918 nodes · 6628 edges · 187 communities (113 shown, 74 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c74fba66`
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
- FeaturedEvents.tsx
- types.ts
- CatalogService
- TranslationsService
- edition.schema.ts
- translation.schema.ts
- scripts
- dependencies
- PostsService
- SEOService
- competition.schema.ts
- result.schema.ts
- route.ts
- review.schema.ts
- omniwallet.service.ts
- DirectoryMapClient.tsx
- participant.schema.ts
- ServiceService
- EventCard.tsx
- events.service.ts
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
- .approveContent
- tailwindcss-animate
- @tiptap/extension-color
- @tiptap/extension-image
- @tiptap/extension-link
- @tiptap/extension-text-align
- @tiptap/extension-text-style
- @tiptap/extension-underline
- @tiptap/starter-kit
- yet-another-react-lightbox
- zod
- postcss
- prisma
- tsx
- @types/bcryptjs
- @types/jsonwebtoken
- @types/leaflet
- @types/react-dom
- page.tsx
- tailwind.config.ts
- apiClient
- cacheService
- page.tsx
- MapBlock.tsx
- @aws-sdk/client-s3

## God Nodes (most connected - your core abstractions)
1. `apiSuccess()` - 284 edges
2. `apiError` - 283 edges
3. `requireRole()` - 170 edges
4. `useAuth()` - 76 edges
5. `AdminService` - 65 edges
6. `Button` - 41 edges
7. `requireAuth()` - 40 edges
8. `ImportService` - 37 edges
9. `AdminService` - 35 edges
10. `cn()` - 35 edges

## Surprising Connections (you probably didn't know these)
- `MagazineCategoryPage()` --indirect_call--> `PostCategory`  [INFERRED]
  wwtrail/app/[locale]/magazine/[category]/page.tsx → wwtrail/types/post.ts
- `OrganizerCompetitionsPage()` --calls--> `useAuth()`  [EXTRACTED]
  wwtrail/app/[locale]/organizer/competitions/page.tsx → wwtrail/hooks/useAuth.ts
- `EditEventPage()` --calls--> `useAuth()`  [EXTRACTED]
  wwtrail/app/[locale]/organizer/events/edit/[id]/page.tsx → wwtrail/hooks/useAuth.ts
- `NewEventPage()` --calls--> `useAuth()`  [EXTRACTED]
  wwtrail/app/[locale]/organizer/events/new/page.tsx → wwtrail/contexts/AuthContext.tsx
- `MyEventsPage()` --calls--> `useAuth()`  [EXTRACTED]
  wwtrail/app/[locale]/organizer/events/page.tsx → wwtrail/hooks/useAuth.ts

## Import Cycles
- None detected.

## Communities (187 total, 74 thin omitted)

### Community 0 - "apiSuccess"
Cohesion: 0.06
Nodes (55): autoFixEncoding(), fixCatalogEncoding(), fixCorruptedFaqs(), GET(), POST(), GET(), POST(), typeMap (+47 more)

### Community 1 - "requireRole"
Cohesion: 0.04
Nodes (27): adminService, GET(), adminService, GET(), adminService, GET(), adminService, GET() (+19 more)

### Community 2 - "admin.service.ts"
Cohesion: 0.04
Nodes (41): FilterRow(), getOperatorsForType(), OPERATOR_LABELS, ENTITY_OPTIONS, EXAMPLE_JSON, FullImportResult, ImportData, ImportResult (+33 more)

### Community 3 - "button.tsx"
Cohesion: 0.13
Nodes (13): COMPETITION_TYPES, COUNTRIES, FilterState, SORT_OPTIONS, COMPETITION_TYPES, CompetitionFilters(), CompetitionFiltersProps, COUNTRIES (+5 more)

### Community 4 - "requireAuth"
Cohesion: 0.08
Nodes (24): MagazineCategoryPage(), PromotionsAnalyticsPage(), ArticleCard(), ArticleCardProps, ArticleGrid(), ArticleGridProps, PostForm(), PostFormProps (+16 more)

### Community 6 - "useAuth"
Cohesion: 0.10
Nodes (25): LoginPage(), RegisterPage(), DashboardPage(), NewLandingPage(), OrganizerPostsPage(), EditPromotionPage(), NewPromotionPage(), EditServicePage() (+17 more)

### Community 7 - "homeConfiguration.schema.ts"
Cohesion: 0.11
Nodes (28): COLUMNS, FooterAdminPage(), LANGUAGES, InsiderConfig, InsiderStats, EditLandingPage(), LandingsAdminPage(), SEOConfigPage() (+20 more)

### Community 8 - "page.tsx"
Cohesion: 0.09
Nodes (32): AdminUsersPage(), ROLE_OPTIONS, CategoryType, initialFormData, ParticipationFormData, ParticipationStatus, AddParticipationButtonProps, CategoryType (+24 more)

### Community 9 - "index.ts"
Cohesion: 0.05
Nodes (37): GET(), POST(), toSpacesCdn(), adminService, GET(), PUT(), GET(), GET() (+29 more)

### Community 10 - "layout.tsx"
Cohesion: 0.22
Nodes (7): getCountryName(), ROLE_LABELS, StatsPage(), STATUS_LABELS, TYPE_LABELS, ComprehensiveStats, ZancadasStats

### Community 11 - "user.service.ts"
Cohesion: 0.07
Nodes (36): InsidersAdminPage(), INSIDER_COLORS, insiderColor(), InsiderData, insiderInitials(), InsidersPage(), ParticipationCard(), profileInitials() (+28 more)

### Community 12 - "edition.ts"
Cohesion: 0.11
Nodes (30): EditEditionPageProps, EditionCard(), EditionCardProps, EditionsGridProps, EditionFormProps, EditionsBlock(), EditionBackendResponse, editionsService (+22 more)

### Community 13 - "competition.ts"
Cohesion: 0.20
Nodes (10): RatingCardProps, RatingFormProps, RecentRatingsWidgetProps, ratingsService, CreateRatingDTO, EditionRating, RATING_CRITERIA, RatingCriterion (+2 more)

### Community 14 - "page.tsx"
Cohesion: 0.07
Nodes (32): PATCH(), GET(), POST(), PUT(), ContentBlockConfig, ContentBlockConfigSchema, CreateHomeBlockInput, createHomeBlockSchema (+24 more)

### Community 15 - "import.service.ts"
Cohesion: 0.17
Nodes (12): FullImport, FullImportResult, fullImportSchema, ImportCompetition, importCompetitionSchema, ImportEvent, importEventSchema, ImportOrganizer (+4 more)

### Community 16 - "EventService"
Cohesion: 0.18
Nodes (3): GET(), POST(), EventService

### Community 17 - "post.ts"
Cohesion: 0.12
Nodes (11): ForgotPasswordInput, forgotPasswordSchema, LoginInput, loginSchema, RefreshTokenInput, refreshTokenSchema, RegisterInput, registerSchema (+3 more)

### Community 18 - "event.service.ts"
Cohesion: 0.15
Nodes (19): prisma, CreateEventInput, EventFilters, UpdateEventInput, CreatePostInput, PostFilters, UpdatePostInput, CreateServiceInput (+11 more)

### Community 20 - "CompetitionService"
Cohesion: 0.12
Nodes (9): POST(), POST(), DELETE(), GET(), PATCH(), PUT(), POST(), GET() (+1 more)

### Community 21 - "rating.ts"
Cohesion: 0.20
Nodes (11): PodiumCardProps, PodiumPositionProps, PodiumFormProps, podiumsService, CreatePodiumDTO, EditionPodium, MEDAL_EMOJIS, PODIUM_TYPE_LABELS (+3 more)

### Community 23 - "page.tsx"
Cohesion: 0.14
Nodes (13): archivo, barlow, metadata, BACKOFFICE_ROUTES, LayoutWrapper(), LayoutWrapperProps, NO_FOOTER_ROUTES, IntlProvider() (+5 more)

### Community 24 - "promotion.ts"
Cohesion: 0.06
Nodes (30): PromotionCategoriesPage(), AdminPromotionsPage(), ServiceCategoriesAdminPage(), PromotionCardProps, PromotionFormProps, PromotionsService, CreateServiceCategoryInput, ServiceCategoriesService (+22 more)

### Community 25 - "compilerOptions"
Cohesion: 0.07
Nodes (28): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+20 more)

### Community 26 - "ImportService"
Cohesion: 0.07
Nodes (35): loginSchema, POST(), POST(), GET(), POST(), POST(), registerSchema, POST() (+27 more)

### Community 27 - "HomeService"
Cohesion: 0.16
Nodes (9): BlockConfigModalProps, HomeBlockRendererProps, HomeService, CreateHomeBlockDTO, HomeBlock, HomeConfiguration, UpdateFullHomeConfigDTO, UpdateHomeBlockDTO (+1 more)

### Community 28 - "generateUniqueSlug"
Cohesion: 0.13
Nodes (13): MyEventsPage(), ViewMode, BulkActionsBar(), BulkActionsBarProps, COUNTRY_FLAGS, EventCard(), EventCardProps, MONTHS (+5 more)

### Community 29 - "Language"
Cohesion: 0.11
Nodes (17): NewEventPage(), CountrySelect(), CountrySelectProps, FileUpload(), FileUploadProps, LANGUAGES, PromotionForm(), RichTextEditor() (+9 more)

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
Cohesion: 0.17
Nodes (13): CreateCatalogInput, createCatalogSchema, CreateSpecialSeriesInput, createSpecialSeriesSchema, GetCatalogQuery, getCatalogQuerySchema, UpdateCatalogInput, updateCatalogSchema (+5 more)

### Community 34 - "PromotionForm.tsx"
Cohesion: 0.22
Nodes (9): WeatherCardProps, WeatherDetailProps, WeatherResponse, weatherService, EditionWeather, WEATHER_COLORS, WEATHER_ICONS, WeatherCondition (+1 more)

### Community 35 - "index.ts"
Cohesion: 0.13
Nodes (13): ALL_LANGUAGES, PageProps, LandingFormProps, LANGUAGES, CreateLandingInput, GetLandingsParams, GetLandingsResponse, Landing (+5 more)

### Community 36 - "organizers.service.ts"
Cohesion: 0.07
Nodes (21): apiClientV2, Footer, FooterContent, FooterService, AddManagerResponse, AvailableOrganizer, AvailableOrganizersResponse, EventManager (+13 more)

### Community 37 - "events.service.ts"
Cohesion: 0.15
Nodes (17): CompetitionDetailPage(), CompetitionDetailPage(), OrganizerDetailPage(), EventMap, ServiceDetailPage(), EventGallery(), EventGalleryProps, ServiceForm() (+9 more)

### Community 39 - "ZancadasBalance.tsx"
Cohesion: 0.15
Nodes (15): Skeleton(), ZancadasBalance(), ZancadasBalanceProps, ACTION_ICONS, ACTION_LABELS, ZancadasHistory(), ZancadasHistoryProps, CompetitionMarker (+7 more)

### Community 40 - "errors.ts"
Cohesion: 0.06
Nodes (20): PUT(), CreatePodiumInput, createPodiumSchema, UpdateChronicleInput, updateChronicleSchema, UpdatePodiumInput, updatePodiumSchema, EditionPodiumService (+12 more)

### Community 41 - "EditionPodiumService"
Cohesion: 0.19
Nodes (8): AgendaRow(), CalEdition, CalView, editionHref(), effDistance(), effElevation(), MONTHS_ES, MonthView()

### Community 42 - "serviceCategories.service.ts"
Cohesion: 0.08
Nodes (25): EventCardProps, EventStatusBadge(), EventStatusBadgeProps, EventsBlock(), EventsBlockProps, EventMedia(), MONTHS_ES, PublicEventCard() (+17 more)

### Community 43 - "home.ts"
Cohesion: 0.20
Nodes (12): DELETE(), BORDER_RADIUS_OPTIONS, FONT_OPTIONS, SHADOW_OPTIONS, SiteConfig, SiteConfigPage(), ThemePresetService, BUILTIN_PRESETS (+4 more)

### Community 44 - "user-competitions.service.ts"
Cohesion: 0.14
Nodes (10): UserStatsCards(), useUserStats(), userCompetitionsService, AddResultData, MarkCompetitionData, RankingEntry, UpdateUserCompetitionData, UserCompetition (+2 more)

### Community 45 - "apiClientV2"
Cohesion: 0.33
Nodes (8): EditEditionPage(), EditionDetailTabs(), EditionDetailTabsProps, TODO: Get from API, TabKey, usePodiums(), useRatings(), useWeather()

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
Nodes (23): OrganizerEditionsPage(), EditOrganizerPage(), OrganizersListPage(), OrganizerDashboard(), CompetitionForm(), EventForm(), EventFormProps, OrganizerForm() (+15 more)

### Community 50 - "ai-autofill.service.ts"
Cohesion: 0.05
Nodes (53): DELETE(), ALLOWED_CONTENT_TYPES, POST(), ALLOWED_TYPES, POST(), ALLOWED_TYPES, POST(), POST() (+45 more)

### Community 51 - "OrganizerService"
Cohesion: 0.15
Nodes (7): DELETE(), GET(), PUT(), GET(), POST(), GET(), OrganizerService

### Community 52 - "page.tsx"
Cohesion: 0.29
Nodes (7): DRY, main(), prisma, repairValue(), Rule, RULES, TEXT_KEYS

### Community 53 - "page.tsx"
Cohesion: 0.14
Nodes (8): EventsService, CreateEventData, EventFilters, EventResponse, EventsResponse, EventStatsResponse, RejectEventData, UpdateEventData

### Community 54 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 55 - "HomeBlockRenderer.tsx"
Cohesion: 0.29
Nodes (6): COMMUNITY, EXPLORE, Footer(), FOOTER_EXCLUDED_ROUTES, FooterLink, SOCIAL

### Community 56 - "useAuth.ts"
Cohesion: 0.35
Nodes (8): AuthContextType, AuthContextValue, AuthResponse, LoginCredentials, RefreshTokenResponse, RegisterData, User, UserRole

### Community 57 - "bulk-edit.service.ts"
Cohesion: 0.15
Nodes (10): BulkEditEntityType, BulkEditFilters, BulkEditOperation, BulkEditPreview, BulkEditResult, BulkEditService, EntityMetadata, FieldMetadata (+2 more)

### Community 59 - "useAuth"
Cohesion: 0.60
Nodes (4): ORG_COLORS, OrganizersPublicPage(), orgColor(), orgInitials()

### Community 60 - "EventList.tsx"
Cohesion: 0.12
Nodes (12): EventFilters, EventList(), EventListProps, EventListSimple(), EventListSimpleProps, FeaturedEvents(), LargeCard(), mediaUrl() (+4 more)

### Community 61 - "EventForm.tsx"
Cohesion: 0.18
Nodes (12): EventManagersPanel(), EventManagersPanelProps, Badge(), BadgeProps, badgeVariants, SelectContent, SelectItem, SelectLabel (+4 more)

### Community 62 - "editionRating.schema.ts"
Cohesion: 0.13
Nodes (11): POST(), CreateEditionRatingInput, createEditionRatingSchema, GetRatingsQuery, getRatingsQuerySchema, GetRecentRatingsQuery, getRecentRatingsSchema, ratingSchema (+3 more)

### Community 63 - "ExportService"
Cohesion: 0.24
Nodes (3): ExportOptions, ExportResult, ExportService

### Community 64 - "TranslationService"
Cohesion: 0.13
Nodes (7): POST(), AutoTranslateInput, getOpenAIKey(), LANGUAGE_NAMES, TranslationRequest, TranslationResult, TranslationService

### Community 65 - "PromotionService"
Cohesion: 0.15
Nodes (10): GET(), PUT(), GET(), POST(), GET(), CreatePromotionInput, PromotionFilters, PromotionService (+2 more)

### Community 66 - "CompetitionActions.tsx"
Cohesion: 0.15
Nodes (17): CompetitionActionsProps, LanguageSelector(), Navbar(), DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem (+9 more)

### Community 67 - "Event"
Cohesion: 0.20
Nodes (9): ConflictItem, ConflictResolution, EntityType, LANGUAGE_MAPPING, NativeImportFile, NativeImportResult, NativeImportResultItem, TERRAIN_MAPPING (+1 more)

### Community 68 - "services.service.ts"
Cohesion: 0.13
Nodes (14): OrganizerServicesPage(), COUNTRY_FLAGS, ServiceCard(), ServiceCardProps, ServicesService, CategoriesResponse, CreateServiceInput, Service (+6 more)

### Community 69 - "LandingService"
Cohesion: 0.15
Nodes (9): CreateLandingInput, createLandingSchema, GetLandingsQuery, getLandingsSchema, TranslateLandingInput, translateLandingSchema, UpdateLandingInput, updateLandingSchema (+1 more)

### Community 70 - "route.ts"
Cohesion: 0.07
Nodes (45): EventMap, EditEventPage(), ExportStats, ACTION_ICONS, ACTION_LABELS, PARTICIPATION_STATUSES, ENTITY_CONFIGS, EntityConfig (+37 more)

### Community 72 - "page.tsx"
Cohesion: 0.33
Nodes (6): EventMap(), EventMapMarker, EventMapProps, MAP_TILES, MapMode, spreadOverlappingMarkers()

### Community 74 - "v2.ts"
Cohesion: 0.33
Nodes (3): DELETE(), GET(), PUT()

### Community 75 - "competition-admin.schema.ts"
Cohesion: 0.12
Nodes (15): ApproveCompetitionInput, ApproveCompetitionParams, approveCompetitionSchema, GetOrganizerCompetitionsQuery, getOrganizerCompetitionsSchema, GetPendingCompetitionsQuery, getPendingCompetitionsSchema, GetStatsQuery (+7 more)

### Community 76 - "SpecialSeries"
Cohesion: 0.12
Nodes (15): SpecialSeriesListPage(), abbreviate(), colorFor(), HEADER_COLORS, SpecialSeriesCard(), SpecialSeriesCardProps, SpecialSeriesGrid(), SpecialSeriesGridProps (+7 more)

### Community 77 - "ContentBlockConfig"
Cohesion: 0.33
Nodes (3): RatingSummaryProps, StarRatingProps, RatingSummary

### Community 78 - "Service"
Cohesion: 0.19
Nodes (13): CompetitionsBlockProps, EditionsBlockProps, MapBlock, LinksBlock(), LinksBlockProps, PostsBlock(), PostsBlockProps, ServicesBlock() (+5 more)

### Community 80 - "user-competition.schema.ts"
Cohesion: 0.13
Nodes (14): AddResultInput, addResultSchema, competitionIdParamSchema, GetMyCompetitionsQuery, getMyCompetitionsSchema, GetUserCompetitionsParams, getUserCompetitionsSchema, GlobalRankingParams (+6 more)

### Community 82 - "page.tsx"
Cohesion: 0.39
Nodes (7): base64UrlDecodeToString(), base64UrlToUint8Array(), EdgeTokenPayload, verifyJwtEdge(), config, intlMiddleware, middleware()

### Community 84 - "EventManagersPanel.tsx"
Cohesion: 0.57
Nodes (5): EditionSelector(), EditionSelectorCompact(), EditionSelectorProps, useAvailableYears(), useEditionByYear()

### Community 85 - "catalogs.service.ts"
Cohesion: 0.17
Nodes (11): CatalogService, catalogsService, competitionTypesService, CatalogType, CompetitionType, CreateCatalogDTO, CreateSpecialSeriesDTO, SpecialSeries (+3 more)

### Community 86 - "admin.schema.ts"
Cohesion: 0.14
Nodes (13): DeleteUserInput, deleteUserSchema, getStatsSchema, GetUserByIdInput, getUserByIdSchema, GetUsersInput, getUsersSchema, GetUserStatsInput (+5 more)

### Community 87 - "CatalogService"
Cohesion: 0.10
Nodes (10): EventDetailPage(), getMonthName(), AddParticipationButton(), AdminEditButton(), AdminEditButtonFloating(), AdminEditButtonProps, EditionParticipants(), NOTE: event favorites are not yet backed by an API (the spec marks this as (+2 more)

### Community 88 - "photos.service.ts"
Cohesion: 0.28
Nodes (7): EditionGalleryProps, photosService, EditionPhoto, PHOTO_UPLOAD_CONFIG, ReorderPhotosDTO, UpdatePhotoDTO, UploadPhotoDTO

### Community 89 - "devDependencies"
Cohesion: 0.15
Nodes (13): autoprefixer, eslint, devDependencies, autoprefixer, eslint, @types/node, @types/react, @types/uuid (+5 more)

### Community 90 - "error-handler.ts"
Cohesion: 0.17
Nodes (5): ApiError, ApiResponse, Language, LANGUAGE_NAMES, LANGUAGES

### Community 93 - "types.ts"
Cohesion: 0.23
Nodes (10): ApiError, ApiResponse, AuthResponse, Competition, CompetitionFilters, LoginCredentials, PaginatedResponse, RegisterData (+2 more)

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
Nodes (11): js-cookie, jsonwebtoken, dependencies, js-cookie, jsonwebtoken, @radix-ui/react-tabs, @tiptap/react, uuid (+3 more)

### Community 101 - "SEOService"
Cohesion: 0.10
Nodes (8): FAQItem, SEOFaqSchema(), SEOFaqSchemaProps, GenerateSEOInput, SEOConfig, SEOService, UpsertConfigInput, LANGUAGE_LABELS

### Community 102 - "competition.schema.ts"
Cohesion: 0.20
Nodes (9): competitionIdSchema, competitionSlugSchema, CreateCompetitionInput, createCompetitionSchema, eventIdSchema, ReorderCompetitionsInput, reorderCompetitionsSchema, UpdateCompetitionInput (+1 more)

### Community 103 - "result.schema.ts"
Cohesion: 0.20
Nodes (9): CreateResultInput, createResultSchema, GetResultsQuery, getResultsSchema, ImportResultsInput, importResultsSchema, resultIdSchema, UpdateResultInput (+1 more)

### Community 105 - "route.ts"
Cohesion: 0.31
Nodes (4): GET(), PUT(), GET(), SiteConfigService

### Community 106 - "review.schema.ts"
Cohesion: 0.22
Nodes (8): CreateReviewInput, createReviewSchema, GetReviewsParams, GetReviewsQuery, getReviewsSchema, reviewIdSchema, UpdateReviewInput, updateReviewSchema

### Community 107 - "omniwallet.service.ts"
Cohesion: 0.08
Nodes (28): globalForPrisma, TokenPayload, SendCouponEmailParams, CreateEmailTemplateInput, UpdateEmailTemplateInput, AddManagerInput, EventManagerWithUser, UpdateFooterInput (+20 more)

### Community 109 - "DirectoryMapClient.tsx"
Cohesion: 0.29
Nodes (7): DirectoryFilters, DirectoryMapClient(), ItemType, MAP_TILES, MapMode, spreadOverlappingMarkers(), terrainTypesService

### Community 110 - "participant.schema.ts"
Cohesion: 0.25
Nodes (7): CreateParticipantInput, createParticipantSchema, GetParticipantsQuery, getParticipantsSchema, participantIdSchema, UpdateParticipantInput, updateParticipantSchema

### Community 111 - "ServiceService"
Cohesion: 0.16
Nodes (8): DELETE(), GET(), PUT(), GET(), GET(), POST(), GET(), ServiceService

### Community 112 - "EventCard.tsx"
Cohesion: 0.11
Nodes (24): POST(), POST(), annotateExisting(), norm(), competitionSchema, editionSchema, extractGraph(), getOpenAIKey() (+16 more)

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
Cohesion: 0.20
Nodes (13): importService, POST(), DELETE(), GET(), importService, POST(), NativeImportOptions, ENCODING_FIXES (+5 more)

### Community 125 - "export-local.ts"
Cohesion: 0.67
Nodes (3): exportAll(), getCoordinates(), prisma

### Community 127 - "useUserCompetitions"
Cohesion: 0.50
Nodes (4): MyRegistrationsPage(), CompetitionActions(), useCompetitionStatus(), useUserCompetitions()

### Community 138 - "EventSelect.tsx"
Cohesion: 0.07
Nodes (27): EditCompetitionPageProps, OrganizerCompetitionsPage(), CompetitionCard(), CompetitionCardCompactProps, CompetitionCardProps, COUNTRY_FLAGS, CompetitionGrid(), CompetitionGridProps (+19 more)

### Community 139 - "class-variance-authority"
Cohesion: 0.09
Nodes (16): cache, memoryCache, GetOrganizerOptions, GetPendingOptions, PaginatedCompetitions, TODO: Enviar notificación al organizador, TODO: Enviar notificación al organizador con razón, CreateOrganizerInput (+8 more)

### Community 165 - ".approveContent"
Cohesion: 0.18
Nodes (11): DashboardLayout(), DashboardLayoutProps, OrganizerLayout(), CollapsibleUserInfo(), CollapsibleUserInfoProps, DashboardNav(), NavItem, navItems (+3 more)

### Community 185 - "page.tsx"
Cohesion: 0.19
Nodes (9): fetchTotal(), HeroSection(), HeroSectionProps, Stat, HomeBlockRenderer(), MapBand(), PINS, ITEMS (+1 more)

### Community 192 - "page.tsx"
Cohesion: 0.12
Nodes (13): Competition, Edition, EventNode, FetchMode, Graph, ScanResult, ScraperPage(), apiClientV1 (+5 more)

### Community 195 - "MapBlock.tsx"
Cohesion: 0.17
Nodes (15): BlockConfigModal(), HeroConfigForm(), HeroConfigFormProps, MAP_TILES, MapBlockProps, TextBlockProps, BlockConfig, HomeBlockType (+7 more)

## Knowledge Gaps
- **734 isolated node(s):** `CalView`, `CalEdition`, `MONTHS_ES`, `EventMap`, `DashboardLayoutProps` (+729 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **74 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `apiClientV2` connect `organizers.service.ts` to `admin.service.ts`, `requireAuth`, `useAuth`, `EventSelect.tsx`, `user.service.ts`, `edition.ts`, `competition.ts`, `rating.ts`, `promotion.ts`, `HomeService`, `PromotionForm.tsx`, `index.ts`, `ZancadasBalance.tsx`, `home.ts`, `email-templates.service.ts`, `index.ts`, `page.tsx`, `page.tsx`, `services.service.ts`, `route.ts`, `SpecialSeries`, `EventManagersPanel.tsx`, `catalogs.service.ts`, `photos.service.ts`, `types.ts`, `SEOService`?**
  _High betweenness centrality (0.246) - this node is a cross-community bridge._
- **What connects `CalView`, `CalEdition`, `MONTHS_ES` to the rest of the system?**
  _743 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `apiSuccess` be split into smaller, more focused modules?**
  _Cohesion score 0.05663474692202462 - nodes in this community are weakly interconnected._
- **Should `requireRole` be split into smaller, more focused modules?**
  _Cohesion score 0.04149620105201637 - nodes in this community are weakly interconnected._
- **Should `admin.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04480874316939891 - nodes in this community are weakly interconnected._
- **Should `button.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12857142857142856 - nodes in this community are weakly interconnected._
- **Should `requireAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.08235294117647059 - nodes in this community are weakly interconnected._