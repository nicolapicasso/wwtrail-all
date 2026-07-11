# Graph Report - wwtrail  (2026-07-11)

## Corpus Check
- 484 files · ~259,044 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2834 nodes · 6425 edges · 187 communities (111 shown, 76 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3fe99c3e`
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
- omniwallet.service.ts
- types.ts
- eventManagers.service.ts
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
- DirectoryMapClient.tsx
- ServiceCategoriesService
- participant.schema.ts
- ServiceService
- WeatherService
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
- UserStatsCards.tsx
- favorites.schema.ts
- next.config.js
- autoprefixer
- axios
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
- @types/react-dom
- tailwind.config.ts
- apiClient
- cacheService
- react

## God Nodes (most connected - your core abstractions)
1. `apiSuccess()` - 270 edges
2. `apiError` - 269 edges
3. `requireRole()` - 160 edges
4. `useAuth()` - 74 edges
5. `AdminService` - 65 edges
6. `Button` - 41 edges
7. `requireAuth()` - 40 edges
8. `ImportService` - 37 edges
9. `AdminService` - 35 edges
10. `cn()` - 35 edges

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

## Communities (187 total, 76 thin omitted)

### Community 0 - "apiSuccess"
Cohesion: 0.04
Nodes (86): GET(), autoFixEncoding(), fixCatalogEncoding(), fixCorruptedFaqs(), GET(), POST(), POST(), toSpacesCdn() (+78 more)

### Community 1 - "requireRole"
Cohesion: 0.04
Nodes (27): adminService, GET(), adminService, GET(), adminService, GET(), adminService, GET() (+19 more)

### Community 2 - "admin.service.ts"
Cohesion: 0.06
Nodes (35): FilterRow(), getOperatorsForType(), OPERATOR_LABELS, getCountryName(), ROLE_LABELS, StatsPage(), STATUS_LABELS, TYPE_LABELS (+27 more)

### Community 3 - "button.tsx"
Cohesion: 0.10
Nodes (28): EventMap, ExportStats, ACTION_ICONS, ACTION_LABELS, PARTICIPATION_STATUSES, TODO: Implement actual API call to change password, InsiderData, EditionParticipantsProps (+20 more)

### Community 4 - "requireAuth"
Cohesion: 0.07
Nodes (34): loginSchema, POST(), POST(), GET(), POST(), POST(), registerSchema, POST() (+26 more)

### Community 6 - "useAuth"
Cohesion: 0.07
Nodes (34): LoginPage(), RegisterPage(), DashboardPage(), NewEventPage(), NewLandingPage(), PromotionsAnalyticsPage(), EditPromotionPage(), NewPromotionPage() (+26 more)

### Community 7 - "homeConfiguration.schema.ts"
Cohesion: 0.09
Nodes (21): ContentBlockConfig, ContentBlockConfigSchema, createHomeBlockSchema, createHomeConfigurationSchema, HomeBlockTypeSchema, HomeBlockViewTypeSchema, HomeTextSizeSchema, HomeTextVariantSchema (+13 more)

### Community 8 - "page.tsx"
Cohesion: 0.12
Nodes (29): AdminUsersPage(), ROLE_OPTIONS, CategoryType, initialFormData, ParticipationFormData, ParticipationStatus, AddParticipationButtonProps, CategoryType (+21 more)

### Community 9 - "index.ts"
Cohesion: 0.18
Nodes (10): PATCH(), POST(), POST(), CreateHomeBlockInput, CreateHomeConfigurationInput, ReorderBlocksInput, UpdateFullHomeConfigInput, UpdateHomeBlockInput (+2 more)

### Community 10 - "layout.tsx"
Cohesion: 0.15
Nodes (12): archivo, barlow, metadata, BACKOFFICE_ROUTES, LayoutWrapper(), LayoutWrapperProps, NO_FOOTER_ROUTES, IntlProvider() (+4 more)

### Community 11 - "user.service.ts"
Cohesion: 0.09
Nodes (32): InsidersAdminPage(), EditProfilePage(), InsidersPage(), ParticipationCard(), UserProfilePage(), InsiderBadge(), InsiderBadgeProps, positionClasses (+24 more)

### Community 12 - "edition.ts"
Cohesion: 0.12
Nodes (28): EditEditionPageProps, EditionCard(), EditionCardProps, EditionsGridProps, EditionFormProps, EditionsBlock(), EditionBackendResponse, editionsService (+20 more)

### Community 13 - "competition.ts"
Cohesion: 0.08
Nodes (26): EditCompetitionPageProps, CompetitionCard(), CompetitionCardCompactProps, CompetitionCardProps, COUNTRY_FLAGS, CompetitionGridProps, CompetitionCardProps, CompetitionList() (+18 more)

### Community 14 - "page.tsx"
Cohesion: 0.08
Nodes (29): CompetitionDetailPage(), CompetitionDetailPage(), EventDetailPage(), getMonthName(), OrganizerDetailPage(), EventMap, ServiceDetailPage(), EditionSelector() (+21 more)

### Community 15 - "import.service.ts"
Cohesion: 0.17
Nodes (12): FullImport, FullImportResult, fullImportSchema, ImportCompetition, importCompetitionSchema, ImportEvent, importEventSchema, ImportOrganizer (+4 more)

### Community 16 - "EventService"
Cohesion: 0.10
Nodes (9): DELETE(), GET(), PUT(), GET(), GET(), GET(), POST(), GET() (+1 more)

### Community 17 - "post.ts"
Cohesion: 0.09
Nodes (33): COLUMNS, FooterAdminPage(), LANGUAGES, InsiderConfig, InsiderStats, EditLandingPage(), LandingsAdminPage(), SEOConfigPage() (+25 more)

### Community 18 - "event.service.ts"
Cohesion: 0.12
Nodes (23): prisma, CreateEventInput, EventFilters, UpdateEventInput, CreatePostInput, PostFilters, UpdatePostInput, CreatePromotionInput (+15 more)

### Community 20 - "CompetitionService"
Cohesion: 0.12
Nodes (9): POST(), POST(), DELETE(), GET(), PATCH(), PUT(), POST(), GET() (+1 more)

### Community 21 - "rating.ts"
Cohesion: 0.06
Nodes (41): EditEditionPage(), EditionDetailTabs(), EditionDetailTabsProps, TODO: Get from API, TabKey, PodiumCardProps, PodiumPositionProps, PodiumFormProps (+33 more)

### Community 23 - "page.tsx"
Cohesion: 0.20
Nodes (9): ConflictItem, ConflictResolution, EntityType, LANGUAGE_MAPPING, NativeImportFile, NativeImportResult, NativeImportResultItem, TERRAIN_MAPPING (+1 more)

### Community 24 - "promotion.ts"
Cohesion: 0.13
Nodes (17): PromotionsService, AddCodesResponse, AddCouponCodesInput, CouponAnalyticsResponse, CouponCode, CouponRedemption, CouponRedemptionResponse, CouponStats (+9 more)

### Community 25 - "compilerOptions"
Cohesion: 0.07
Nodes (28): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+20 more)

### Community 26 - "ImportService"
Cohesion: 0.16
Nodes (9): BlockConfigModalProps, HomeBlockRendererProps, HomeService, CreateHomeBlockDTO, HomeBlock, HomeConfiguration, UpdateFullHomeConfigDTO, UpdateHomeBlockDTO (+1 more)

### Community 27 - "HomeService"
Cohesion: 0.14
Nodes (20): BlockConfigModal(), HeroConfigForm(), HeroConfigFormProps, MapBlock, LinksBlock(), LinksBlockProps, MAP_TILES, MapBlockProps (+12 more)

### Community 28 - "generateUniqueSlug"
Cohesion: 0.12
Nodes (11): cache, memoryCache, CreateOrganizerInput, OrganizerFilters, UpdateOrganizerInput, CreateServiceCategoryInput, ServiceCategoryService, UpdateServiceCategoryInput (+3 more)

### Community 29 - "Language"
Cohesion: 0.13
Nodes (13): ALL_LANGUAGES, PageProps, LandingFormProps, LANGUAGES, CreateLandingInput, GetLandingsParams, GetLandingsResponse, Landing (+5 more)

### Community 30 - "use-toast.ts"
Cohesion: 0.12
Nodes (22): Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle, toastVariants (+14 more)

### Community 31 - "user.service.ts"
Cohesion: 0.11
Nodes (15): ChangePasswordInput, changePasswordSchema, GetPublicUsersQuery, getPublicUsersSchema, GetUsersQuery, getUsersSchema, UpdateUserInput, updateUserSchema (+7 more)

### Community 32 - "EditionService"
Cohesion: 0.12
Nodes (8): GET(), DELETE(), GET(), PUT(), GET(), POST(), GET(), EditionService

### Community 33 - "catalog.service.ts"
Cohesion: 0.17
Nodes (13): CreateCatalogInput, createCatalogSchema, CreateSpecialSeriesInput, createSpecialSeriesSchema, GetCatalogQuery, getCatalogQuerySchema, UpdateCatalogInput, updateCatalogSchema (+5 more)

### Community 34 - "PromotionForm.tsx"
Cohesion: 0.18
Nodes (11): FileUpload(), FileUploadProps, LANGUAGES, PromotionForm(), RichTextEditor(), RichTextEditorProps, apiClientFiles, filesService (+3 more)

### Community 35 - "index.ts"
Cohesion: 0.11
Nodes (12): PostForm(), PostFormProps, MyStats, PostsService, CreatePostInput, LANGUAGE_LABELS, Post, PostFilters (+4 more)

### Community 36 - "organizers.service.ts"
Cohesion: 0.15
Nodes (10): ORG_COLORS, OrganizersPublicPage(), orgColor(), orgInitials(), OrganizersService, CreateOrganizerInput, Organizer, OrganizerFilters (+2 more)

### Community 37 - "events.service.ts"
Cohesion: 0.16
Nodes (8): EventsService, CreateEventData, EventFilters, EventResponse, EventsResponse, EventStatsResponse, RejectEventData, UpdateEventData

### Community 39 - "ZancadasBalance.tsx"
Cohesion: 0.15
Nodes (15): Skeleton(), ZancadasBalance(), ZancadasBalanceProps, ACTION_ICONS, ACTION_LABELS, ZancadasHistory(), ZancadasHistoryProps, CompetitionMarker (+7 more)

### Community 40 - "errors.ts"
Cohesion: 0.14
Nodes (10): prisma, EditionWeather, AppError, BadRequestError, ConflictError, ForbiddenError, InternalServerError, NotFoundError (+2 more)

### Community 41 - "EditionPodiumService"
Cohesion: 0.19
Nodes (12): MagazineCategoryPage(), OrganizerPostsPage(), ArticleCard(), ArticleCardProps, ArticleGrid(), ArticleGridProps, PostsBlock(), RelatedArticles() (+4 more)

### Community 42 - "serviceCategories.service.ts"
Cohesion: 0.10
Nodes (13): PromotionCategoriesPage(), AdminPromotionsPage(), ServiceCategoriesAdminPage(), PromotionCardProps, PromotionFormProps, CreateServiceCategoryInput, ServiceCategoriesService, ServiceCategory (+5 more)

### Community 43 - "home.ts"
Cohesion: 0.20
Nodes (12): DELETE(), BORDER_RADIUS_OPTIONS, FONT_OPTIONS, SHADOW_OPTIONS, SiteConfig, SiteConfigPage(), ThemePresetService, BUILTIN_PRESETS (+4 more)

### Community 44 - "user-competitions.service.ts"
Cohesion: 0.16
Nodes (8): userCompetitionsService, AddResultData, MarkCompetitionData, RankingEntry, UpdateUserCompetitionData, UserCompetition, UserCompetitionStatus, UserStats

### Community 45 - "apiClientV2"
Cohesion: 0.16
Nodes (8): apiClientV2, Footer, FooterContent, FooterService, BulkTranslationResponse, EntityStats, TranslationResponse, TranslationStatsResponse

### Community 46 - "email-templates.service.ts"
Cohesion: 0.18
Nodes (11): EmailTemplatesPage(), EmailTemplatesService, CreateEmailTemplateInput, EMAIL_TEMPLATE_TYPES, EmailTemplate, EmailTemplatePreviewResponse, EmailTemplateResponse, EmailTemplatesResponse (+3 more)

### Community 47 - "auth.schema.ts"
Cohesion: 0.12
Nodes (11): ForgotPasswordInput, forgotPasswordSchema, LoginInput, loginSchema, RefreshTokenInput, refreshTokenSchema, RegisterInput, registerSchema (+3 more)

### Community 48 - "event.schema.ts"
Cohesion: 0.10
Nodes (19): CreateEventInput, createEventSchema, eventIdSchema, EventsByCountryParams, EventsByCountryQuery, eventsByCountrySchema, eventSlugSchema, FeaturedEventsQuery (+11 more)

### Community 49 - "index.ts"
Cohesion: 0.13
Nodes (13): EventForm(), EventFormProps, ImageAssignment, ImageImportSelector(), ImageRole, Props, ROLE_COLORS, ROLE_LABELS (+5 more)

### Community 50 - "ai-autofill.service.ts"
Cohesion: 0.05
Nodes (52): DELETE(), ALLOWED_CONTENT_TYPES, POST(), ALLOWED_TYPES, POST(), ALLOWED_TYPES, POST(), POST() (+44 more)

### Community 51 - "OrganizerService"
Cohesion: 0.15
Nodes (7): DELETE(), GET(), PUT(), GET(), POST(), GET(), OrganizerService

### Community 52 - "page.tsx"
Cohesion: 0.29
Nodes (7): DRY, main(), prisma, repairValue(), Rule, RULES, TEXT_KEYS

### Community 53 - "page.tsx"
Cohesion: 0.06
Nodes (36): MyEventsPage(), ViewMode, BulkActionsBar(), BulkActionsBarProps, EventCardProps, EventStatusBadge(), EventStatusBadgeProps, COUNTRY_FLAGS (+28 more)

### Community 54 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 55 - "HomeBlockRenderer.tsx"
Cohesion: 0.19
Nodes (9): fetchTotal(), HeroSection(), HeroSectionProps, Stat, HomeBlockRenderer(), MapBand(), PINS, ITEMS (+1 more)

### Community 56 - "useAuth.ts"
Cohesion: 0.16
Nodes (11): AuthContextType, AuthContextValue, AuthService, apiClientV1, createResponseInterceptor(), AuthResponse, LoginCredentials, RefreshTokenResponse (+3 more)

### Community 57 - "bulk-edit.service.ts"
Cohesion: 0.15
Nodes (10): BulkEditEntityType, BulkEditFilters, BulkEditOperation, BulkEditPreview, BulkEditResult, BulkEditService, EntityMetadata, FieldMetadata (+2 more)

### Community 59 - "useAuth"
Cohesion: 0.08
Nodes (21): OrganizerCompetitionsPage(), OrganizerEditionsPage(), EditEventPage(), EditOrganizerPage(), OrganizersListPage(), OrganizerDashboard(), SpecialSeriesListPage(), CountrySelect() (+13 more)

### Community 60 - "EventList.tsx"
Cohesion: 0.09
Nodes (18): EventFilters, EventList(), EventListProps, EventListSimple(), EventListSimpleProps, FeaturedEvents(), LargeCard(), mediaUrl() (+10 more)

### Community 61 - "EventForm.tsx"
Cohesion: 0.15
Nodes (12): COMPETITION_TYPES, COUNTRIES, FilterState, SORT_OPTIONS, CompetitionGridSkeleton(), GenerateTranslationsButton(), GenerateTranslationsButtonProps, TranslationStatus (+4 more)

### Community 62 - "editionRating.schema.ts"
Cohesion: 0.13
Nodes (11): POST(), CreateEditionRatingInput, createEditionRatingSchema, GetRatingsQuery, getRatingsQuerySchema, GetRecentRatingsQuery, getRecentRatingsSchema, ratingSchema (+3 more)

### Community 63 - "ExportService"
Cohesion: 0.24
Nodes (3): ExportOptions, ExportResult, ExportService

### Community 65 - "PromotionService"
Cohesion: 0.18
Nodes (7): DELETE(), GET(), PUT(), GET(), POST(), GET(), PromotionService

### Community 66 - "CompetitionActions.tsx"
Cohesion: 0.16
Nodes (16): LanguageSelector(), Navbar(), DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator (+8 more)

### Community 67 - "Event"
Cohesion: 0.19
Nodes (9): COMPETITION_TYPES, CompetitionFilters(), CompetitionFiltersProps, COUNTRIES, FilterState, SORT_OPTIONS, CompetitionGrid(), specialSeriesService (+1 more)

### Community 68 - "services.service.ts"
Cohesion: 0.19
Nodes (8): ServicesService, CategoriesResponse, CreateServiceInput, ServiceFilters, ServiceResponse, ServicesResponse, ServiceStatus, UpdateServiceInput

### Community 69 - "LandingService"
Cohesion: 0.15
Nodes (9): CreateLandingInput, createLandingSchema, GetLandingsQuery, getLandingsSchema, TranslateLandingInput, translateLandingSchema, UpdateLandingInput, updateLandingSchema (+1 more)

### Community 70 - "route.ts"
Cohesion: 0.20
Nodes (8): PUT(), CreatePodiumInput, createPodiumSchema, UpdateChronicleInput, updateChronicleSchema, UpdatePodiumInput, updatePodiumSchema, EditionPodiumService

### Community 72 - "page.tsx"
Cohesion: 0.12
Nodes (10): AdminEditButton(), AdminEditButtonFloating(), AdminEditButtonProps, EditionParticipants(), EventMap(), EventMapMarker, EventMapProps, MAP_TILES (+2 more)

### Community 75 - "competition-admin.schema.ts"
Cohesion: 0.12
Nodes (15): ApproveCompetitionInput, ApproveCompetitionParams, approveCompetitionSchema, GetOrganizerCompetitionsQuery, getOrganizerCompetitionsSchema, GetPendingCompetitionsQuery, getPendingCompetitionsSchema, GetStatsQuery (+7 more)

### Community 76 - "SpecialSeries"
Cohesion: 0.24
Nodes (4): SpecialSeriesService, CreateSpecialSeriesInput, SpecialSeries, UpdateSpecialSeriesInput

### Community 77 - "ContentBlockConfig"
Cohesion: 0.24
Nodes (9): CompetitionsBlockProps, EditionsBlockProps, EventsBlock(), EventsBlockProps, PostsBlockProps, ServicesBlock(), ServicesBlockProps, ContentBlockConfig (+1 more)

### Community 78 - "Service"
Cohesion: 0.33
Nodes (6): OrganizerServicesPage(), COUNTRY_FLAGS, ServiceCard(), ServiceCardProps, Service, ServiceCategory

### Community 79 - "SpecialSeries"
Cohesion: 0.16
Nodes (12): abbreviate(), colorFor(), HEADER_COLORS, SpecialSeriesCard(), SpecialSeriesCardProps, SpecialSeriesGrid(), SpecialSeriesGridProps, SpecialSeriesFilters (+4 more)

### Community 80 - "user-competition.schema.ts"
Cohesion: 0.13
Nodes (14): AddResultInput, addResultSchema, competitionIdParamSchema, GetMyCompetitionsQuery, getMyCompetitionsSchema, GetUserCompetitionsParams, getUserCompetitionsSchema, GlobalRankingParams (+6 more)

### Community 82 - "page.tsx"
Cohesion: 0.39
Nodes (7): base64UrlDecodeToString(), base64UrlToUint8Array(), EdgeTokenPayload, verifyJwtEdge(), config, intlMiddleware, middleware()

### Community 83 - "userEdition.schema.ts"
Cohesion: 0.16
Nodes (8): ParticipationsPage(), editionIdParamSchema, participationIdParamSchema, SearchEditionsQuery, searchEditionsSchema, UserEditionInput, userEditionSchema, UserEditionService

### Community 84 - "EventManagersPanel.tsx"
Cohesion: 0.07
Nodes (22): ENTITY_OPTIONS, EXAMPLE_JSON, FullImportResult, ImportData, ImportResult, ImportStats, NativeImportTab(), EventManagersPanel() (+14 more)

### Community 85 - "catalogs.service.ts"
Cohesion: 0.17
Nodes (11): CatalogService, catalogsService, competitionTypesService, CatalogType, CompetitionType, CreateCatalogDTO, CreateSpecialSeriesDTO, SpecialSeries (+3 more)

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

### Community 91 - "competition-admin.service.ts"
Cohesion: 0.17
Nodes (6): CompetitionAdminService, GetOrganizerOptions, GetPendingOptions, PaginatedCompetitions, TODO: Enviar notificación al organizador, TODO: Enviar notificación al organizador con razón

### Community 92 - "omniwallet.service.ts"
Cohesion: 0.22
Nodes (8): AddPointsData, CreateCustomerData, CustomerAttributes, CustomerLinks, CustomerResponse, OmniwalletConfig, TransactionAttributes, TransactionResponse

### Community 93 - "types.ts"
Cohesion: 0.23
Nodes (10): ApiError, ApiResponse, AuthResponse, Competition, CompetitionFilters, LoginCredentials, PaginatedResponse, RegisterData (+2 more)

### Community 94 - "eventManagers.service.ts"
Cohesion: 0.17
Nodes (7): AddManagerResponse, AvailableOrganizer, AvailableOrganizersResponse, EventManager, EventManagersService, ManagersResponse, RemoveManagerResponse

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
Cohesion: 0.14
Nodes (4): GenerateSEOInput, SEOConfig, SEOService, UpsertConfigInput

### Community 102 - "competition.schema.ts"
Cohesion: 0.20
Nodes (9): competitionIdSchema, competitionSlugSchema, CreateCompetitionInput, createCompetitionSchema, eventIdSchema, ReorderCompetitionsInput, reorderCompetitionsSchema, UpdateCompetitionInput (+1 more)

### Community 103 - "result.schema.ts"
Cohesion: 0.20
Nodes (9): CreateResultInput, createResultSchema, GetResultsQuery, getResultsSchema, ImportResultsInput, importResultsSchema, resultIdSchema, UpdateResultInput (+1 more)

### Community 104 - "SpecialSeriesService"
Cohesion: 0.29
Nodes (6): COMMUNITY, EXPLORE, Footer(), FOOTER_EXCLUDED_ROUTES, FooterLink, SOCIAL

### Community 105 - "route.ts"
Cohesion: 0.31
Nodes (4): GET(), PUT(), GET(), SiteConfigService

### Community 106 - "review.schema.ts"
Cohesion: 0.22
Nodes (8): CreateReviewInput, createReviewSchema, GetReviewsParams, GetReviewsQuery, getReviewsSchema, reviewIdSchema, UpdateReviewInput, updateReviewSchema

### Community 107 - "omniwallet.service.ts"
Cohesion: 0.09
Nodes (25): globalForPrisma, TokenPayload, SendCouponEmailParams, CreateEmailTemplateInput, UpdateEmailTemplateInput, AddManagerInput, EventManagerWithUser, UpdateFooterInput (+17 more)

### Community 108 - "DirectoryMapClient.tsx"
Cohesion: 0.33
Nodes (6): DirectoryFilters, DirectoryMapClient(), ItemType, MAP_TILES, MapMode, spreadOverlappingMarkers()

### Community 110 - "participant.schema.ts"
Cohesion: 0.25
Nodes (7): CreateParticipantInput, createParticipantSchema, GetParticipantsQuery, getParticipantsSchema, participantIdSchema, UpdateParticipantInput, updateParticipantSchema

### Community 111 - "ServiceService"
Cohesion: 0.16
Nodes (8): DELETE(), GET(), PUT(), GET(), GET(), POST(), GET(), ServiceService

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
Cohesion: 0.43
Nodes (5): MyRegistrationsPage(), CompetitionActions(), CompetitionActionsProps, useCompetitionStatus(), useUserCompetitions()

### Community 191 - "react"
Cohesion: 0.18
Nodes (11): DashboardLayout(), DashboardLayoutProps, OrganizerLayout(), CollapsibleUserInfo(), CollapsibleUserInfoProps, DashboardNav(), NavItem, navItems (+3 more)

## Knowledge Gaps
- **715 isolated node(s):** `EventMap`, `DashboardLayoutProps`, `SiteConfig`, `FONT_OPTIONS`, `BORDER_RADIUS_OPTIONS` (+710 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **76 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `apiClientV2` connect `apiClientV2` to `admin.service.ts`, `button.tsx`, `useAuth`, `user.service.ts`, `edition.ts`, `competition.ts`, `page.tsx`, `rating.ts`, `promotion.ts`, `ImportService`, `Language`, `index.ts`, `events.service.ts`, `ZancadasBalance.tsx`, `serviceCategories.service.ts`, `home.ts`, `email-templates.service.ts`, `index.ts`, `page.tsx`, `useAuth.ts`, `services.service.ts`, `SpecialSeries`, `catalogs.service.ts`, `photos.service.ts`, `types.ts`, `eventManagers.service.ts`, `SEOService`?**
  _High betweenness centrality (0.246) - this node is a cross-community bridge._
- **What connects `EventMap`, `DashboardLayoutProps`, `SiteConfig` to the rest of the system?**
  _724 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `apiSuccess` be split into smaller, more focused modules?**
  _Cohesion score 0.044665561083471535 - nodes in this community are weakly interconnected._
- **Should `requireRole` be split into smaller, more focused modules?**
  _Cohesion score 0.04149620105201637 - nodes in this community are weakly interconnected._
- **Should `admin.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05612244897959184 - nodes in this community are weakly interconnected._
- **Should `button.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09803921568627451 - nodes in this community are weakly interconnected._
- **Should `requireAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.06734006734006734 - nodes in this community are weakly interconnected._