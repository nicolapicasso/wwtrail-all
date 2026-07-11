# Graph Report - wwtrail  (2026-07-11)

## Corpus Check
- 498 files · ~266,990 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2919 nodes · 6630 edges · 198 communities (124 shown, 74 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d44a0176`
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
- uuid
- route.ts
- review.schema.ts
- omniwallet.service.ts
- @types/node
- DirectoryMapClient.tsx
- participant.schema.ts
- ServiceService
- EventCard.tsx
- events.service.ts
- useSlugValidation.ts
- SpecialSeries
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
- migrate-uploads-to-spaces.js
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
- Event
- @radix-ui/react-toast
- react-dom
- react-hook-form
- Service
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
- eventManagers.service.ts
- yet-another-react-lightbox
- zod
- postcss
- prisma
- tsx
- @types/bcryptjs
- @types/jsonwebtoken
- @types/leaflet
- FeaturedEvents.tsx
- @types/react-dom
- page.tsx
- tailwind.config.ts
- apiClient
- cacheService
- EventCard.tsx
- page.tsx
- EventSelect.tsx
- useMyStats.ts
- MapBlock.tsx
- bcryptjs

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
- `MyEventsPage()` --calls--> `useAuth()`  [EXTRACTED]
  wwtrail/app/[locale]/organizer/events/page.tsx → wwtrail/hooks/useAuth.ts
- `OrganizerLayout()` --calls--> `useAuth()`  [EXTRACTED]
  wwtrail/app/[locale]/organizer/layout.tsx → wwtrail/contexts/AuthContext.tsx
- `PromotionCategoriesPage()` --calls--> `useAuth()`  [EXTRACTED]
  wwtrail/app/[locale]/organizer/promotions/categories/page.tsx → wwtrail/contexts/AuthContext.tsx
- `AdminPromotionsPage()` --calls--> `useAuth()`  [EXTRACTED]
  wwtrail/app/[locale]/organizer/promotions/page.tsx → wwtrail/contexts/AuthContext.tsx

## Import Cycles
- None detected.

## Communities (198 total, 74 thin omitted)

### Community 0 - "apiSuccess"
Cohesion: 0.05
Nodes (61): POST(), autoFixEncoding(), fixCatalogEncoding(), fixCorruptedFaqs(), GET(), POST(), GET(), POST() (+53 more)

### Community 1 - "requireRole"
Cohesion: 0.04
Nodes (27): adminService, GET(), adminService, GET(), adminService, GET(), adminService, GET() (+19 more)

### Community 2 - "admin.service.ts"
Cohesion: 0.04
Nodes (41): FilterRow(), getOperatorsForType(), OPERATOR_LABELS, ENTITY_OPTIONS, EXAMPLE_JSON, FullImportResult, ImportData, ImportResult (+33 more)

### Community 3 - "button.tsx"
Cohesion: 0.20
Nodes (8): CompetitionCard(), CompetitionCardCompactProps, CompetitionCardProps, COUNTRY_FLAGS, CompetitionFilters(), CompetitionGrid(), CompetitionGridProps, competitionsService

### Community 4 - "requireAuth"
Cohesion: 0.12
Nodes (17): MagazineCategoryPage(), ArticleCard(), ArticleCardProps, ArticleGrid(), ArticleGridProps, RelatedArticlesProps, LANGUAGE_LABELS, POST_CATEGORY_LABELS (+9 more)

### Community 6 - "useAuth"
Cohesion: 0.08
Nodes (29): LoginPage(), RegisterPage(), DashboardPage(), NewEventPage(), NewLandingPage(), OrganizerPostsPage(), PromotionsAnalyticsPage(), EditPromotionPage() (+21 more)

### Community 7 - "homeConfiguration.schema.ts"
Cohesion: 0.11
Nodes (29): COLUMNS, FooterAdminPage(), LANGUAGES, InsiderConfig, InsiderStats, EditLandingPage(), LandingsAdminPage(), SEOConfigPage() (+21 more)

### Community 8 - "page.tsx"
Cohesion: 0.13
Nodes (27): AdminUsersPage(), ROLE_OPTIONS, CategoryType, initialFormData, ParticipationFormData, ParticipationStatus, AddParticipationButtonProps, CategoryType (+19 more)

### Community 9 - "index.ts"
Cohesion: 0.05
Nodes (37): GET(), POST(), toSpacesCdn(), adminService, GET(), PUT(), GET(), GET() (+29 more)

### Community 10 - "layout.tsx"
Cohesion: 0.22
Nodes (7): getCountryName(), ROLE_LABELS, StatsPage(), STATUS_LABELS, TYPE_LABELS, ComprehensiveStats, ZancadasStats

### Community 11 - "user.service.ts"
Cohesion: 0.07
Nodes (39): InsidersAdminPage(), INSIDER_COLORS, insiderColor(), InsiderData, insiderInitials(), InsidersPage(), ParticipationCard(), profileInitials() (+31 more)

### Community 12 - "edition.ts"
Cohesion: 0.12
Nodes (26): EditionCard(), EditionCardProps, EditionsGridProps, EditionsBlock(), EditionBackendResponse, editionsService, EditionStatus, RegistrationStatus (+18 more)

### Community 13 - "competition.ts"
Cohesion: 0.12
Nodes (17): EditionDetailTabsProps, TODO: Get from API, TabKey, RatingCardProps, RatingFormProps, RatingSummaryProps, RecentRatingsWidgetProps, StarRatingProps (+9 more)

### Community 14 - "page.tsx"
Cohesion: 0.07
Nodes (32): PATCH(), GET(), POST(), PUT(), ContentBlockConfig, ContentBlockConfigSchema, CreateHomeBlockInput, createHomeBlockSchema (+24 more)

### Community 15 - "import.service.ts"
Cohesion: 0.17
Nodes (12): FullImport, FullImportResult, fullImportSchema, ImportCompetition, importCompetitionSchema, ImportEvent, importEventSchema, ImportOrganizer (+4 more)

### Community 16 - "EventService"
Cohesion: 0.16
Nodes (4): GET(), GET(), POST(), EventService

### Community 17 - "post.ts"
Cohesion: 0.12
Nodes (11): ForgotPasswordInput, forgotPasswordSchema, LoginInput, loginSchema, RefreshTokenInput, refreshTokenSchema, RegisterInput, registerSchema (+3 more)

### Community 18 - "event.service.ts"
Cohesion: 0.11
Nodes (23): prisma, CreateEventInput, EventFilters, UpdateEventInput, CreatePostInput, PostFilters, UpdatePostInput, GenerateSEOInput (+15 more)

### Community 20 - "CompetitionService"
Cohesion: 0.11
Nodes (12): POST(), POST(), DELETE(), GET(), PATCH(), PUT(), GET(), POST() (+4 more)

### Community 21 - "rating.ts"
Cohesion: 0.16
Nodes (16): EditEditionPage(), EditEditionPageProps, EditionDetailTabs(), PodiumCardProps, PodiumPositionProps, PodiumFormProps, usePodiums(), useWeather() (+8 more)

### Community 23 - "page.tsx"
Cohesion: 0.14
Nodes (13): archivo, barlow, metadata, BACKOFFICE_ROUTES, LayoutWrapper(), LayoutWrapperProps, NO_FOOTER_ROUTES, IntlProvider() (+5 more)

### Community 24 - "promotion.ts"
Cohesion: 0.13
Nodes (17): PromotionsService, AddCodesResponse, AddCouponCodesInput, CouponAnalyticsResponse, CouponCode, CouponRedemption, CouponRedemptionResponse, CouponStats (+9 more)

### Community 25 - "compilerOptions"
Cohesion: 0.07
Nodes (28): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+20 more)

### Community 26 - "ImportService"
Cohesion: 0.14
Nodes (16): loginSchema, POST(), POST(), POST(), registerSchema, POST(), POST(), POST() (+8 more)

### Community 27 - "HomeService"
Cohesion: 0.16
Nodes (9): BlockConfigModalProps, HomeBlockRendererProps, HomeService, CreateHomeBlockDTO, HomeBlock, HomeConfiguration, UpdateFullHomeConfigDTO, UpdateHomeBlockDTO (+1 more)

### Community 28 - "generateUniqueSlug"
Cohesion: 0.22
Nodes (8): MyEventsPage(), ViewMode, BulkActionsBar(), BulkActionsBarProps, EventStatusBadgeProps, EventStatsData, EventStatsProps, EventStatus

### Community 29 - "Language"
Cohesion: 0.18
Nodes (11): FileUpload(), FileUploadProps, LANGUAGES, PromotionForm(), RichTextEditor(), RichTextEditorProps, apiClientFiles, filesService (+3 more)

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
Cohesion: 0.14
Nodes (12): ALL_LANGUAGES, PageProps, LandingFormProps, LANGUAGES, CreateLandingInput, GetLandingsParams, GetLandingsResponse, Landing (+4 more)

### Community 36 - "organizers.service.ts"
Cohesion: 0.22
Nodes (6): OrganizersService, CreateOrganizerInput, Organizer, OrganizerFilters, OrganizerListItem, UpdateOrganizerInput

### Community 37 - "events.service.ts"
Cohesion: 0.19
Nodes (12): CompetitionDetailPage(), OrganizerDetailPage(), EventMap, ServiceDetailPage(), EventGallery(), EventGalleryProps, ServiceForm(), OrganizerCard() (+4 more)

### Community 39 - "ZancadasBalance.tsx"
Cohesion: 0.09
Nodes (32): EventMap, ExportStats, ENTITY_CONFIGS, EntityConfig, EntityStats, EntityType, TranslationsDashboardPage(), TranslationStats (+24 more)

### Community 40 - "errors.ts"
Cohesion: 0.05
Nodes (22): PUT(), GET(), POST(), CreatePodiumInput, createPodiumSchema, UpdateChronicleInput, updateChronicleSchema, UpdatePodiumInput (+14 more)

### Community 41 - "EditionPodiumService"
Cohesion: 0.19
Nodes (8): AgendaRow(), CalEdition, CalView, editionHref(), effDistance(), effElevation(), MONTHS_ES, MonthView()

### Community 42 - "serviceCategories.service.ts"
Cohesion: 0.17
Nodes (12): CreateEventInput, EventCompetitionSummary, EventCreatorRef, EventListResponse, EventNearby, EventSearchResult, EventStats, EventTranslation (+4 more)

### Community 43 - "home.ts"
Cohesion: 0.20
Nodes (12): DELETE(), BORDER_RADIUS_OPTIONS, FONT_OPTIONS, SHADOW_OPTIONS, SiteConfig, SiteConfigPage(), ThemePresetService, BUILTIN_PRESETS (+4 more)

### Community 44 - "user-competitions.service.ts"
Cohesion: 0.14
Nodes (10): UserStatsCards(), useUserStats(), userCompetitionsService, AddResultData, MarkCompetitionData, RankingEntry, UpdateUserCompetitionData, UserCompetition (+2 more)

### Community 45 - "apiClientV2"
Cohesion: 0.10
Nodes (13): PromotionCategoriesPage(), AdminPromotionsPage(), ServiceCategoriesAdminPage(), PromotionCardProps, PromotionFormProps, CreateServiceCategoryInput, ServiceCategoriesService, ServiceCategory (+5 more)

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
Cohesion: 0.13
Nodes (15): CompetitionForm(), CompetitionFormProps, EventForm(), EventFormProps, ImageAssignment, ImageImportSelector(), ImageRole, Props (+7 more)

### Community 50 - "ai-autofill.service.ts"
Cohesion: 0.06
Nodes (39): GET(), DELETE(), ALLOWED_CONTENT_TYPES, POST(), ALLOWED_TYPES, POST(), ALLOWED_TYPES, POST() (+31 more)

### Community 51 - "OrganizerService"
Cohesion: 0.15
Nodes (7): DELETE(), GET(), PUT(), GET(), POST(), GET(), OrganizerService

### Community 52 - "page.tsx"
Cohesion: 0.29
Nodes (7): DRY, main(), prisma, repairValue(), Rule, RULES, TEXT_KEYS

### Community 53 - "page.tsx"
Cohesion: 0.16
Nodes (8): EventsService, CreateEventData, EventFilters, EventResponse, EventsResponse, EventStatsResponse, RejectEventData, UpdateEventData

### Community 54 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 55 - "HomeBlockRenderer.tsx"
Cohesion: 0.29
Nodes (6): COMMUNITY, EXPLORE, Footer(), FOOTER_EXCLUDED_ROUTES, FooterLink, SOCIAL

### Community 56 - "useAuth.ts"
Cohesion: 0.17
Nodes (10): AuthContextType, AuthContextValue, AuthService, createResponseInterceptor(), AuthResponse, LoginCredentials, RefreshTokenResponse, RegisterData (+2 more)

### Community 57 - "bulk-edit.service.ts"
Cohesion: 0.15
Nodes (10): BulkEditEntityType, BulkEditFilters, BulkEditOperation, BulkEditPreview, BulkEditResult, BulkEditService, EntityMetadata, FieldMetadata (+2 more)

### Community 58 - "SEOService"
Cohesion: 0.14
Nodes (4): getOpenAIKey(), getOpenAIKey(), SEOService, getOpenAIKey()

### Community 59 - "useAuth"
Cohesion: 0.17
Nodes (10): ORG_COLORS, OrganizersPublicPage(), orgColor(), orgInitials(), CountrySelect(), CountrySelectProps, EventFiltersProps, COUNTRIES (+2 more)

### Community 60 - "EventList.tsx"
Cohesion: 0.16
Nodes (8): EventFilters, EventList(), EventListProps, EventListSimple(), EventListSimpleProps, PaginationData, useEvents(), UseEventsResult

### Community 61 - "EventForm.tsx"
Cohesion: 0.09
Nodes (22): EventManagersPanelProps, EventMedia(), MONTHS_ES, PublicEventCard(), PublicEventCardProps, AccordionContent, AccordionItem, AccordionTrigger (+14 more)

### Community 62 - "editionRating.schema.ts"
Cohesion: 0.13
Nodes (11): POST(), CreateEditionRatingInput, createEditionRatingSchema, GetRatingsQuery, getRatingsQuerySchema, GetRecentRatingsQuery, getRecentRatingsSchema, ratingSchema (+3 more)

### Community 63 - "ExportService"
Cohesion: 0.24
Nodes (3): ExportOptions, ExportResult, ExportService

### Community 64 - "TranslationService"
Cohesion: 0.14
Nodes (6): POST(), AutoTranslateInput, LANGUAGE_NAMES, TranslationRequest, TranslationResult, TranslationService

### Community 65 - "PromotionService"
Cohesion: 0.18
Nodes (7): DELETE(), GET(), PUT(), GET(), POST(), GET(), PromotionService

### Community 66 - "CompetitionActions.tsx"
Cohesion: 0.15
Nodes (17): CompetitionActionsProps, LanguageSelector(), Navbar(), DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem (+9 more)

### Community 67 - "Event"
Cohesion: 0.20
Nodes (9): ConflictItem, ConflictResolution, EntityType, LANGUAGE_MAPPING, NativeImportFile, NativeImportResult, NativeImportResultItem, TERRAIN_MAPPING (+1 more)

### Community 68 - "services.service.ts"
Cohesion: 0.22
Nodes (8): ServicesService, CategoriesResponse, CreateServiceInput, ServiceFilters, ServiceResponse, ServicesResponse, ServiceStatus, UpdateServiceInput

### Community 69 - "LandingService"
Cohesion: 0.15
Nodes (9): CreateLandingInput, createLandingSchema, GetLandingsQuery, getLandingsSchema, TranslateLandingInput, translateLandingSchema, UpdateLandingInput, updateLandingSchema (+1 more)

### Community 70 - "route.ts"
Cohesion: 0.10
Nodes (21): ACTION_ICONS, ACTION_LABELS, PARTICIPATION_STATUSES, COMPETITION_TYPES, COUNTRIES, FilterState, SORT_OPTIONS, CompetitionGridSkeleton() (+13 more)

### Community 72 - "page.tsx"
Cohesion: 0.33
Nodes (6): EventMap(), EventMapMarker, EventMapProps, MAP_TILES, MapMode, spreadOverlappingMarkers()

### Community 74 - "v2.ts"
Cohesion: 0.21
Nodes (16): POST(), autoFillCompetition(), autoFillEvent(), classifyImage(), CompetitionAutoFillResult, EventAutoFillResult, extractImagesFromHtml(), fetchPageContent() (+8 more)

### Community 75 - "competition-admin.schema.ts"
Cohesion: 0.12
Nodes (15): ApproveCompetitionInput, ApproveCompetitionParams, approveCompetitionSchema, GetOrganizerCompetitionsQuery, getOrganizerCompetitionsSchema, GetPendingCompetitionsQuery, getPendingCompetitionsSchema, GetStatsQuery (+7 more)

### Community 76 - "SpecialSeries"
Cohesion: 0.23
Nodes (9): SpecialSeriesListPage(), abbreviate(), colorFor(), HEADER_COLORS, SpecialSeriesCard(), SpecialSeriesCardProps, SpecialSeriesGrid(), SpecialSeriesGridProps (+1 more)

### Community 77 - "ContentBlockConfig"
Cohesion: 0.13
Nodes (11): apiClientV2, Footer, FooterContent, FooterService, GenerateSEOInput, SEOConfig, UpsertConfigInput, BulkTranslationResponse (+3 more)

### Community 78 - "Service"
Cohesion: 0.24
Nodes (9): CompetitionsBlockProps, EditionsBlockProps, EventsBlock(), EventsBlockProps, PostsBlockProps, ServicesBlock(), ServicesBlockProps, ContentBlockConfig (+1 more)

### Community 80 - "user-competition.schema.ts"
Cohesion: 0.13
Nodes (14): AddResultInput, addResultSchema, competitionIdParamSchema, GetMyCompetitionsQuery, getMyCompetitionsSchema, GetUserCompetitionsParams, getUserCompetitionsSchema, GlobalRankingParams (+6 more)

### Community 82 - "page.tsx"
Cohesion: 0.39
Nodes (7): base64UrlDecodeToString(), base64UrlToUint8Array(), EdgeTokenPayload, verifyJwtEdge(), config, intlMiddleware, middleware()

### Community 83 - "userEdition.schema.ts"
Cohesion: 0.12
Nodes (10): GenerateTranslationsButton(), GenerateTranslationsButtonProps, TranslationStatus, PostForm(), PostFormProps, PostsService, TranslatableEntityType, CreatePostInput (+2 more)

### Community 84 - "EventManagersPanel.tsx"
Cohesion: 0.38
Nodes (8): CompetitionDetailPage(), EditionSelector(), EditionSelectorCompact(), EditionSelectorProps, useCompetition(), useAvailableYears(), useEditionByYear(), useEditions()

### Community 85 - "catalogs.service.ts"
Cohesion: 0.12
Nodes (17): COMPETITION_TYPES, CompetitionFiltersProps, COUNTRIES, FilterState, SORT_OPTIONS, CatalogService, catalogsService, competitionTypesService (+9 more)

### Community 86 - "admin.schema.ts"
Cohesion: 0.14
Nodes (13): DeleteUserInput, deleteUserSchema, getStatsSchema, GetUserByIdInput, getUserByIdSchema, GetUsersInput, getUsersSchema, GetUserStatsInput (+5 more)

### Community 87 - "CatalogService"
Cohesion: 0.15
Nodes (6): AddParticipationButton(), AdminEditButton(), AdminEditButtonFloating(), AdminEditButtonProps, EditionParticipants(), RelatedArticles()

### Community 88 - "photos.service.ts"
Cohesion: 0.28
Nodes (7): EditionGalleryProps, photosService, EditionPhoto, PHOTO_UPLOAD_CONFIG, ReorderPhotosDTO, UpdatePhotoDTO, UploadPhotoDTO

### Community 89 - "devDependencies"
Cohesion: 0.15
Nodes (13): eslint, devDependencies, eslint, @types/js-cookie, @types/nodemailer, @types/react, @types/uuid, typescript (+5 more)

### Community 90 - "error-handler.ts"
Cohesion: 0.17
Nodes (5): ApiError, ApiResponse, Language, LANGUAGE_NAMES, LANGUAGES

### Community 91 - "competition-admin.service.ts"
Cohesion: 0.17
Nodes (6): CompetitionAdminService, GetOrganizerOptions, GetPendingOptions, PaginatedCompetitions, TODO: Enviar notificación al organizador, TODO: Enviar notificación al organizador con razón

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
Nodes (11): @aws-sdk/client-s3, js-cookie, jsonwebtoken, dependencies, @aws-sdk/client-s3, js-cookie, jsonwebtoken, @radix-ui/react-tabs (+3 more)

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
Cohesion: 0.09
Nodes (23): globalForPrisma, TokenPayload, SendCouponEmailParams, CreateEmailTemplateInput, UpdateEmailTemplateInput, AddManagerInput, EventManagerWithUser, UpdateFooterInput (+15 more)

### Community 109 - "DirectoryMapClient.tsx"
Cohesion: 0.29
Nodes (7): DirectoryFilters, DirectoryMapClient(), ItemType, MAP_TILES, MapMode, spreadOverlappingMarkers(), terrainTypesService

### Community 110 - "participant.schema.ts"
Cohesion: 0.25
Nodes (7): CreateParticipantInput, createParticipantSchema, GetParticipantsQuery, getParticipantsSchema, participantIdSchema, UpdateParticipantInput, updateParticipantSchema

### Community 111 - "ServiceService"
Cohesion: 0.40
Nodes (3): DELETE(), GET(), PUT()

### Community 112 - "EventCard.tsx"
Cohesion: 0.14
Nodes (21): annotateExisting(), norm(), competitionSchema, editionSchema, extractGraph(), graphSchema, decodeEntities(), fetchContent() (+13 more)

### Community 113 - "events.service.ts"
Cohesion: 0.16
Nodes (7): EventDetailPage(), getMonthName(), NOTE: event favorites are not yet backed by an API (the spec marks this as, SaveEventButton(), FAQItem, SEOFaqSchema(), SEOFaqSchemaProps

### Community 114 - "useSlugValidation.ts"
Cohesion: 0.38
Nodes (5): SlugInput(), SlugInputProps, SlugValidationResult, useSlugValidation(), UseSlugValidationOptions

### Community 115 - "SpecialSeries"
Cohesion: 0.21
Nodes (5): SpecialSeriesService, CreateSpecialSeriesInput, SpecialSeries, SpecialSeriesFilters, UpdateSpecialSeriesInput

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

### Community 136 - "migrate-uploads-to-spaces.js"
Cohesion: 0.18
Nodes (14): convertUrl(), DRY_RUN, fileExistsOnSpaces(), fs, getAllFiles(), main(), MIME_TYPES, path (+6 more)

### Community 138 - "EventSelect.tsx"
Cohesion: 0.11
Nodes (21): EditCompetitionPageProps, CompetitionCardProps, CompetitionList(), CompetitionListCompact(), CompetitionListCompactProps, CompetitionListProps, ConfirmDialog(), ConfirmDialogProps (+13 more)

### Community 139 - "class-variance-authority"
Cohesion: 0.11
Nodes (16): cache, memoryCache, CreateOrganizerInput, OrganizerFilters, UpdateOrganizerInput, CreatePromotionInput, PromotionFilters, RedeemCouponInput (+8 more)

### Community 158 - "Event"
Cohesion: 0.19
Nodes (7): EventCardProps, EventStatusBadge(), EventResponseV1, Event, EventDetail, EventWithCounts, EventWithCreator

### Community 162 - "Service"
Cohesion: 0.26
Nodes (6): OrganizerServicesPage(), COUNTRY_FLAGS, ServiceCard(), ServiceCardProps, Service, ServiceCategory

### Community 165 - ".approveContent"
Cohesion: 0.08
Nodes (24): DashboardLayout(), DashboardLayoutProps, OrganizerCompetitionsPage(), OrganizerEditionsPage(), EditEventPage(), OrganizerLayout(), EditOrganizerPage(), OrganizersListPage() (+16 more)

### Community 174 - "eventManagers.service.ts"
Cohesion: 0.17
Nodes (7): AddManagerResponse, AvailableOrganizer, AvailableOrganizersResponse, EventManager, EventManagersService, ManagersResponse, RemoveManagerResponse

### Community 183 - "FeaturedEvents.tsx"
Cohesion: 0.43
Nodes (4): FeaturedEvents(), LargeCard(), mediaUrl(), SmallCard()

### Community 185 - "page.tsx"
Cohesion: 0.19
Nodes (9): fetchTotal(), HeroSection(), HeroSectionProps, Stat, HomeBlockRenderer(), MapBand(), PINS, ITEMS (+1 more)

### Community 191 - "EventCard.tsx"
Cohesion: 0.40
Nodes (5): COUNTRY_FLAGS, EventCard(), EventCardProps, MONTHS, ManagedEvent

### Community 192 - "page.tsx"
Cohesion: 0.12
Nodes (13): Competition, Edition, EventNode, FetchMode, Graph, ScanResult, ScraperPage(), apiClientV1 (+5 more)

### Community 195 - "MapBlock.tsx"
Cohesion: 0.14
Nodes (21): BlockConfigModal(), HeroConfigForm(), HeroConfigFormProps, MapBlock, LinksBlock(), LinksBlockProps, MAP_TILES, MapBlockProps (+13 more)

## Knowledge Gaps
- **734 isolated node(s):** `CalView`, `CalEdition`, `MONTHS_ES`, `EventMap`, `DashboardLayoutProps` (+729 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **74 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `apiClientV2` connect `ContentBlockConfig` to `admin.service.ts`, `requireAuth`, `useAuth`, `EventSelect.tsx`, `user.service.ts`, `edition.ts`, `competition.ts`, `rating.ts`, `promotion.ts`, `HomeService`, `PromotionForm.tsx`, `index.ts`, `organizers.service.ts`, `ZancadasBalance.tsx`, `home.ts`, `apiClientV2`, `email-templates.service.ts`, `eventManagers.service.ts`, `index.ts`, `page.tsx`, `page.tsx`, `services.service.ts`, `route.ts`, `SpecialSeries`, `EventManagersPanel.tsx`, `catalogs.service.ts`, `photos.service.ts`, `types.ts`?**
  _High betweenness centrality (0.251) - this node is a cross-community bridge._
- **What connects `CalView`, `CalEdition`, `MONTHS_ES` to the rest of the system?**
  _743 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `apiSuccess` be split into smaller, more focused modules?**
  _Cohesion score 0.05047250859106529 - nodes in this community are weakly interconnected._
- **Should `requireRole` be split into smaller, more focused modules?**
  _Cohesion score 0.04149620105201637 - nodes in this community are weakly interconnected._
- **Should `admin.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04480874316939891 - nodes in this community are weakly interconnected._
- **Should `requireAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.1166429587482219 - nodes in this community are weakly interconnected._
- **Should `AdminService` be split into smaller, more focused modules?**
  _Cohesion score 0.038461538461538464 - nodes in this community are weakly interconnected._