# Graph Report - wwtrail  (2026-07-12)

## Corpus Check
- 566 files · ~277,254 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3124 nodes · 7477 edges · 204 communities (117 shown, 87 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2cef7383`
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
- PostsService
- EventMap.tsx
- competition.schema.ts
- result.schema.ts
- uuid
- route.ts
- review.schema.ts
- omniwallet.service.ts
- DirectoryMapClient.tsx
- participant.schema.ts
- js-cookie
- EventCard.tsx
- slugify
- useSlugValidation.ts
- route.ts
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
- LayoutWrapper.tsx
- route.ts
- StatsCard.tsx
- StatsCard.tsx
- @types/node
- favorites.schema.ts
- next.config.js
- PATCH
- types.ts
- EventSelect.tsx
- PATCH
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
- page.tsx
- @aws-sdk/client-s3
- @radix-ui/react-toast
- react-dom
- react-hook-form
- PATCH
- page.tsx
- sonner
- LanguageSelector.tsx
- tailwindcss-animate
- @tiptap/extension-color
- @tiptap/extension-image
- @tiptap/extension-link
- @tiptap/extension-text-align
- @tiptap/extension-text-style
- @tiptap/extension-underline
- @tiptap/starter-kit
- axios
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
- footer.service.ts
- tailwind.config.ts
- apiClient
- cacheService
- @types/nodemailer
- DirectoryMapClient.tsx
- editionRating.schema.ts
- EventMap.tsx
- MapBlock.tsx
- bcryptjs
- impersonation.ts
- eslint-config-next
- SearchableEntitySelect.tsx
- uuid
- PATCH
- PATCH
- PATCH

## God Nodes (most connected - your core abstractions)
1. `apiError` - 436 edges
2. `apiSuccess()` - 427 edges
3. `requireRole()` - 275 edges
4. `useAuth()` - 76 edges
5. `AdminService` - 65 edges
6. `requireAuth()` - 62 edges
7. `ZancadasService` - 45 edges
8. `Button` - 41 edges
9. `ImportService` - 37 edges
10. `apiClientV2` - 35 edges

## Surprising Connections (you probably didn't know these)
- `MagazineCategoryPage()` --indirect_call--> `PostCategory`  [INFERRED]
  app/[locale]/magazine/[category]/page.tsx → types/post.ts
- `NewEventPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/events/new/page.tsx → contexts/AuthContext.tsx
- `OrganizerLayout()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/layout.tsx → contexts/AuthContext.tsx
- `PromotionCategoriesPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/promotions/categories/page.tsx → contexts/AuthContext.tsx
- `AdminPromotionsPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/promotions/page.tsx → contexts/AuthContext.tsx

## Import Cycles
- None detected.

## Communities (204 total, 87 thin omitted)

### Community 0 - "apiSuccess"
Cohesion: 0.05
Nodes (42): GET(), DELETE(), ALLOWED_CONTENT_TYPES, POST(), ALLOWED_TYPES, POST(), ALLOWED_TYPES, POST() (+34 more)

### Community 1 - "requireRole"
Cohesion: 0.04
Nodes (33): adminService, GET(), adminService, GET(), adminService, GET(), PUT(), adminService (+25 more)

### Community 2 - "admin.service.ts"
Cohesion: 0.05
Nodes (39): FilterRow(), getOperatorsForType(), OPERATOR_LABELS, ENTITY_OPTIONS, EXAMPLE_JSON, FullImportResult, ImportData, ImportResult (+31 more)

### Community 3 - "button.tsx"
Cohesion: 0.13
Nodes (20): EditEditionPage(), EditEditionPageProps, EditionDetailTabs(), EditionDetailTabsProps, TODO: Get from API, TabKey, PodiumCardProps, PodiumPositionProps (+12 more)

### Community 4 - "requireAuth"
Cohesion: 0.21
Nodes (7): OrganizersService, CreateOrganizerInput, Organizer, OrganizerFilters, OrganizerListItem, UpdateOrganizerInput, PaginatedResponse

### Community 6 - "useAuth"
Cohesion: 0.06
Nodes (40): LoginPage(), RegisterPage(), DashboardPage(), FooterAdminPage(), EditLandingPage(), NewLandingPage(), LandingsAdminPage(), OrganizerPostsPage() (+32 more)

### Community 7 - "homeConfiguration.schema.ts"
Cohesion: 0.15
Nodes (13): RatingCardProps, RatingFormProps, RatingSummaryProps, RecentRatingsWidgetProps, StarRatingProps, ratingsService, CreateRatingDTO, EditionRating (+5 more)

### Community 8 - "page.tsx"
Cohesion: 0.06
Nodes (48): GroupedSEO, AdminUsersPage(), ROLE_OPTIONS, CategoryType, initialFormData, ParticipationFormData, ParticipationStatus, AddParticipationButtonProps (+40 more)

### Community 9 - "index.ts"
Cohesion: 0.14
Nodes (15): EventManagersPanel(), EventManagersPanelProps, GenerateTranslationsButton(), GenerateTranslationsButtonProps, TranslationStatus, Button, ButtonProps, SelectContent (+7 more)

### Community 10 - "layout.tsx"
Cohesion: 0.12
Nodes (18): ProfilePage(), Skeleton(), ZancadasBalance(), ZancadasBalanceProps, ACTION_ICONS, ACTION_LABELS, ZancadasHistory(), ZancadasHistoryProps (+10 more)

### Community 11 - "user.service.ts"
Cohesion: 0.12
Nodes (16): CompetitionForm(), CompetitionFormProps, EventForm(), EventFormProps, ImageAssignment, ImageImportSelector(), ImageRole, Props (+8 more)

### Community 12 - "edition.ts"
Cohesion: 0.12
Nodes (25): EditionCardProps, EditionsGridProps, EditionFormProps, EditionBackendResponse, editionsService, EditionStatus, RegistrationStatus, BulkCreateEditionsInput (+17 more)

### Community 14 - "page.tsx"
Cohesion: 0.09
Nodes (38): annotateExisting(), bigrams(), dice(), distSim(), jaccard(), nameSim(), norm(), pct() (+30 more)

### Community 15 - "import.service.ts"
Cohesion: 0.17
Nodes (12): FullImport, FullImportResult, fullImportSchema, ImportCompetition, importCompetitionSchema, ImportEvent, importEventSchema, ImportOrganizer (+4 more)

### Community 16 - "EventService"
Cohesion: 0.07
Nodes (31): loginSchema, POST(), POST(), POST(), registerSchema, POST(), POST(), toSpacesCdn() (+23 more)

### Community 17 - "post.ts"
Cohesion: 0.22
Nodes (9): AuthContextType, AuthContextValue, AuthService, AuthResponse, LoginCredentials, RefreshTokenResponse, RegisterData, User (+1 more)

### Community 18 - "event.service.ts"
Cohesion: 0.11
Nodes (26): prisma, CreateEventInput, EventFilters, UpdateEventInput, CreatePostInput, PostFilters, UpdatePostInput, GenerateSEOInput (+18 more)

### Community 20 - "CompetitionService"
Cohesion: 0.05
Nodes (43): POST(), GET(), POST(), autoFixEncoding(), fixCatalogEncoding(), fixCorruptedFaqs(), GET(), POST() (+35 more)

### Community 21 - "rating.ts"
Cohesion: 0.08
Nodes (24): CompetitionCard(), CompetitionCardCompactProps, CompetitionCardProps, COUNTRY_FLAGS, COMPETITION_TYPES, CompetitionFilters(), CompetitionFiltersProps, COUNTRIES (+16 more)

### Community 22 - "page.tsx"
Cohesion: 0.12
Nodes (14): AdminPromotionsPage(), PromotionCardProps, LANGUAGES, PromotionForm(), PromotionFormProps, RichTextEditor(), RichTextEditorProps, apiClientFiles (+6 more)

### Community 23 - "page.tsx"
Cohesion: 0.06
Nodes (38): InsidersAdminPage(), INSIDER_COLORS, insiderColor(), InsiderData, insiderInitials(), InsidersPage(), ParticipationCard(), profileInitials() (+30 more)

### Community 24 - "promotion.ts"
Cohesion: 0.13
Nodes (17): PromotionsService, AddCodesResponse, AddCouponCodesInput, CouponAnalyticsResponse, CouponCode, CouponRedemption, CouponRedemptionResponse, CouponStats (+9 more)

### Community 25 - "compilerOptions"
Cohesion: 0.07
Nodes (28): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+20 more)

### Community 26 - "ImportService"
Cohesion: 0.07
Nodes (33): DELETE(), GET(), PATCH(), POST(), PUT(), ContentBlockConfig, ContentBlockConfigSchema, CreateHomeBlockInput (+25 more)

### Community 27 - "HomeService"
Cohesion: 0.11
Nodes (20): EditCompetitionPageProps, CompetitionCardProps, CompetitionList(), CompetitionListCompact(), CompetitionListCompactProps, CompetitionListProps, ConfirmDialog(), ConfirmDialogProps (+12 more)

### Community 28 - "generateUniqueSlug"
Cohesion: 0.11
Nodes (8): EventDetailPage(), getMonthName(), AdminEditButton(), AdminEditButtonFloating(), AdminEditButtonProps, EditionParticipants(), RelatedArticles(), RelatedArticlesProps

### Community 30 - "use-toast.ts"
Cohesion: 0.12
Nodes (22): Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle, toastVariants (+14 more)

### Community 31 - "user.service.ts"
Cohesion: 0.11
Nodes (15): ChangePasswordInput, changePasswordSchema, GetPublicUsersQuery, getPublicUsersSchema, GetUsersQuery, getUsersSchema, UpdateUserInput, updateUserSchema (+7 more)

### Community 32 - "EditionService"
Cohesion: 0.09
Nodes (12): POST(), GET(), POST(), GET(), DELETE(), GET(), PUT(), GET() (+4 more)

### Community 33 - "catalog.service.ts"
Cohesion: 0.13
Nodes (14): CreateCatalogInput, createCatalogSchema, CreateSpecialSeriesInput, createSpecialSeriesSchema, GetCatalogQuery, getCatalogQuerySchema, UpdateCatalogInput, updateCatalogSchema (+6 more)

### Community 34 - "PromotionForm.tsx"
Cohesion: 0.09
Nodes (19): OrganizerCompetitionsPage(), OrganizerEditionsPage(), EditEventPage(), MyEventsPage(), EditOrganizerPage(), OrganizersListPage(), OrganizerDashboard(), SpecialSeriesListPage() (+11 more)

### Community 35 - "index.ts"
Cohesion: 0.14
Nodes (12): ALL_LANGUAGES, PageProps, LandingFormProps, LANGUAGES, CreateLandingInput, GetLandingsParams, GetLandingsResponse, Landing (+4 more)

### Community 36 - "organizers.service.ts"
Cohesion: 0.21
Nodes (14): LinksBlockProps, MAP_TILES, MapBlockProps, TextBlockProps, BlockConfig, HomeBlockType, HomeTextAlign, HomeTextSize (+6 more)

### Community 37 - "events.service.ts"
Cohesion: 0.11
Nodes (7): FAQItem, SEOFaqSchema(), SEOFaqSchemaProps, GenerateSEOInput, SEOConfig, SEOService, UpsertConfigInput

### Community 39 - "ZancadasBalance.tsx"
Cohesion: 0.09
Nodes (39): EventMap, ExportStats, COLUMNS, LANGUAGES, InsiderConfig, InsiderStats, ACTION_ICONS, ACTION_LABELS (+31 more)

### Community 40 - "errors.ts"
Cohesion: 0.06
Nodes (19): CreatePodiumInput, createPodiumSchema, UpdateChronicleInput, updateChronicleSchema, UpdatePodiumInput, updatePodiumSchema, EditionPodiumService, prisma (+11 more)

### Community 41 - "EditionPodiumService"
Cohesion: 0.19
Nodes (8): AgendaRow(), CalEdition, CalView, editionHref(), effDistance(), effElevation(), MONTHS_ES, MonthView()

### Community 43 - "home.ts"
Cohesion: 0.23
Nodes (11): BORDER_RADIUS_OPTIONS, FONT_OPTIONS, SHADOW_OPTIONS, SiteConfig, SiteConfigPage(), ThemePresetService, BUILTIN_PRESETS, pickThemeValues() (+3 more)

### Community 44 - "user-competitions.service.ts"
Cohesion: 0.13
Nodes (12): MyRegistrationsPage(), UserStatsCards(), useUserCompetitions(), useUserStats(), userCompetitionsService, AddResultData, MarkCompetitionData, RankingEntry (+4 more)

### Community 46 - "email-templates.service.ts"
Cohesion: 0.18
Nodes (11): EmailTemplatesPage(), EmailTemplatesService, CreateEmailTemplateInput, EMAIL_TEMPLATE_TYPES, EmailTemplate, EmailTemplatePreviewResponse, EmailTemplateResponse, EmailTemplatesResponse (+3 more)

### Community 47 - "auth.schema.ts"
Cohesion: 0.15
Nodes (7): PromotionCategoriesPage(), ServiceCategoriesAdminPage(), CreateServiceCategoryInput, ServiceCategoriesService, ServiceCategory, ServiceCategoryWithCount, UpdateServiceCategoryInput

### Community 48 - "event.schema.ts"
Cohesion: 0.10
Nodes (19): CreateEventInput, createEventSchema, eventIdSchema, EventsByCountryParams, EventsByCountryQuery, eventsByCountrySchema, eventSlugSchema, FeaturedEventsQuery (+11 more)

### Community 49 - "index.ts"
Cohesion: 0.52
Nodes (6): ENCODING_FIXES, fixEncoding(), fixString(), normalizeUnicode(), parseJsonWithEncoding(), stripBOM()

### Community 50 - "ai-autofill.service.ts"
Cohesion: 0.11
Nodes (15): POST(), GET(), POST(), DELETE(), GET(), PUT(), GET(), POST() (+7 more)

### Community 51 - "OrganizerService"
Cohesion: 0.12
Nodes (10): GET(), POST(), POST(), DELETE(), GET(), PUT(), GET(), POST() (+2 more)

### Community 52 - "page.tsx"
Cohesion: 0.29
Nodes (7): DRY, main(), prisma, repairValue(), Rule, RULES, TEXT_KEYS

### Community 53 - "page.tsx"
Cohesion: 0.08
Nodes (21): NewEventPage(), EventsService, CreateEventData, CreateEventInput, EventCompetitionSummary, EventCreatorRef, EventFilters, EventListResponse (+13 more)

### Community 54 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 55 - "HomeBlockRenderer.tsx"
Cohesion: 0.09
Nodes (15): apiClientV2, Footer, FooterContent, FooterService, AddManagerResponse, AvailableOrganizer, AvailableOrganizersResponse, EventManager (+7 more)

### Community 56 - "useAuth.ts"
Cohesion: 0.17
Nodes (11): ViewMode, BulkActionsBar(), BulkActionsBarProps, COUNTRY_FLAGS, EventCard(), EventCardProps, MONTHS, EventStatsData (+3 more)

### Community 57 - "bulk-edit.service.ts"
Cohesion: 0.15
Nodes (10): BulkEditEntityType, BulkEditFilters, BulkEditOperation, BulkEditPreview, BulkEditResult, BulkEditService, EntityMetadata, FieldMetadata (+2 more)

### Community 58 - "SEOService"
Cohesion: 0.14
Nodes (4): getOpenAIKey(), SEOService, PUBLIC_SELECT, getOpenAIKey()

### Community 59 - "useAuth"
Cohesion: 0.23
Nodes (9): ORG_COLORS, OrganizersPublicPage(), orgColor(), orgInitials(), CountrySelect(), CountrySelectProps, COUNTRIES, Country (+1 more)

### Community 61 - "EventForm.tsx"
Cohesion: 0.21
Nodes (13): CompetitionsBlock(), CompetitionsBlockProps, EditionsBlock(), EditionsBlockProps, EventsBlock(), EventsBlockProps, MapBlock, LinksBlock() (+5 more)

### Community 62 - "editionRating.schema.ts"
Cohesion: 0.14
Nodes (12): GET(), POST(), GET(), DELETE(), GET(), PUT(), GET(), GET() (+4 more)

### Community 65 - "PromotionService"
Cohesion: 0.13
Nodes (10): GET(), POST(), POST(), DELETE(), GET(), PUT(), GET(), POST() (+2 more)

### Community 66 - "CompetitionActions.tsx"
Cohesion: 0.19
Nodes (13): CompetitionActions(), CompetitionActionsProps, Navbar(), DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem (+5 more)

### Community 68 - "services.service.ts"
Cohesion: 0.22
Nodes (8): ServicesService, CategoriesResponse, CreateServiceInput, ServiceFilters, ServiceResponse, ServicesResponse, ServiceStatus, UpdateServiceInput

### Community 69 - "LandingService"
Cohesion: 0.15
Nodes (9): CreateLandingInput, createLandingSchema, GetLandingsQuery, getLandingsSchema, TranslateLandingInput, translateLandingSchema, UpdateLandingInput, updateLandingSchema (+1 more)

### Community 70 - "route.ts"
Cohesion: 0.12
Nodes (11): ForgotPasswordInput, forgotPasswordSchema, LoginInput, loginSchema, RefreshTokenInput, refreshTokenSchema, RegisterInput, registerSchema (+3 more)

### Community 72 - "page.tsx"
Cohesion: 0.22
Nodes (7): getCountryName(), ROLE_LABELS, StatsPage(), STATUS_LABELS, TYPE_LABELS, ComprehensiveStats, ZancadasStats

### Community 74 - "v2.ts"
Cohesion: 0.09
Nodes (21): EventFilters, EventList(), EventListProps, EventListSimple(), EventListSimpleProps, FeaturedEvents(), LargeCard(), mediaUrl() (+13 more)

### Community 75 - "competition-admin.schema.ts"
Cohesion: 0.12
Nodes (15): ApproveCompetitionInput, ApproveCompetitionParams, approveCompetitionSchema, GetOrganizerCompetitionsQuery, getOrganizerCompetitionsSchema, GetPendingCompetitionsQuery, getPendingCompetitionsSchema, GetStatsQuery (+7 more)

### Community 76 - "SpecialSeries"
Cohesion: 0.13
Nodes (13): abbreviate(), colorFor(), HEADER_COLORS, SpecialSeriesCard(), SpecialSeriesCardProps, SpecialSeriesGrid(), SpecialSeriesGridProps, SpecialSeriesService (+5 more)

### Community 77 - "ContentBlockConfig"
Cohesion: 0.17
Nodes (9): ParticipationsPage(), editionIdParamSchema, participationIdParamSchema, SearchEditionsQuery, searchEditionsSchema, UserEditionInput, userEditionSchema, UserEditionResult (+1 more)

### Community 78 - "page.tsx"
Cohesion: 0.21
Nodes (16): POST(), autoFillCompetition(), autoFillEvent(), classifyImage(), CompetitionAutoFillResult, EventAutoFillResult, extractImagesFromHtml(), fetchPageContent() (+8 more)

### Community 80 - "user-competition.schema.ts"
Cohesion: 0.13
Nodes (14): AddResultInput, addResultSchema, competitionIdParamSchema, GetMyCompetitionsQuery, getMyCompetitionsSchema, GetUserCompetitionsParams, getUserCompetitionsSchema, GlobalRankingParams (+6 more)

### Community 82 - "page.tsx"
Cohesion: 0.39
Nodes (7): base64UrlDecodeToString(), base64UrlToUint8Array(), EdgeTokenPayload, verifyJwtEdge(), config, intlMiddleware, middleware()

### Community 83 - "userEdition.schema.ts"
Cohesion: 0.18
Nodes (13): CompetitionDetailPage(), OrganizerDetailPage(), EventMap, ServiceDetailPage(), EventGallery(), EventGalleryProps, OrganizerCard(), OrganizerCardProps (+5 more)

### Community 84 - "User"
Cohesion: 0.22
Nodes (9): WeatherCardProps, WeatherDetailProps, WeatherResponse, weatherService, EditionWeather, WEATHER_COLORS, WEATHER_ICONS, WeatherCondition (+1 more)

### Community 85 - "catalogs.service.ts"
Cohesion: 0.18
Nodes (14): convertUrl(), DRY_RUN, fileExistsOnSpaces(), fs, getAllFiles(), main(), MIME_TYPES, path (+6 more)

### Community 86 - "admin.schema.ts"
Cohesion: 0.14
Nodes (13): DeleteUserInput, deleteUserSchema, getStatsSchema, GetUserByIdInput, getUserByIdSchema, GetUsersInput, getUsersSchema, GetUserStatsInput (+5 more)

### Community 87 - "CatalogService"
Cohesion: 0.15
Nodes (7): POST(), POST(), DELETE(), GET(), PATCH(), PUT(), POST()

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

### Community 92 - "CountrySelect.tsx"
Cohesion: 0.19
Nodes (9): fetchTotal(), HeroSection(), HeroSectionProps, Stat, HomeBlockRenderer(), MapBand(), PINS, ITEMS (+1 more)

### Community 93 - "ServiceCategoriesService"
Cohesion: 0.16
Nodes (7): DELETE(), GET(), PUT(), GET(), POST(), GET(), ServiceCategoryService

### Community 94 - ".deleteAllImportedData"
Cohesion: 0.18
Nodes (11): DashboardLayout(), DashboardLayoutProps, OrganizerLayout(), CollapsibleUserInfo(), CollapsibleUserInfoProps, DashboardNav(), NavItem, navItems (+3 more)

### Community 95 - "TranslationsService"
Cohesion: 0.33
Nodes (9): CompetitionDetailPage(), EditionCard(), EditionSelector(), EditionSelectorCompact(), EditionSelectorProps, useCompetition(), useAvailableYears(), useEditionByYear() (+1 more)

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
Cohesion: 0.17
Nodes (9): Competition, Edition, EventNode, FetchMode, Graph, MatchInfo, ScanResult, ScraperPage() (+1 more)

### Community 100 - "PostsService"
Cohesion: 0.26
Nodes (6): OrganizerServicesPage(), COUNTRY_FLAGS, ServiceCard(), ServiceCardProps, Service, ServiceCategory

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
Cohesion: 0.05
Nodes (43): POST(), POST(), getEntitiesWithoutSEO(), POST(), readAccessTokenPayload(), signAccessToken(), cache, memoryCache (+35 more)

### Community 109 - "DirectoryMapClient.tsx"
Cohesion: 0.09
Nodes (16): EventCardProps, EventStatusBadge(), EventStatusBadgeProps, PaginationData, UseEventsResult, apiClientV1, createResponseInterceptor(), ApiResponse (+8 more)

### Community 110 - "participant.schema.ts"
Cohesion: 0.25
Nodes (7): CreateParticipantInput, createParticipantSchema, GetParticipantsQuery, getParticipantsSchema, participantIdSchema, UpdateParticipantInput, updateParticipantSchema

### Community 111 - "js-cookie"
Cohesion: 0.18
Nodes (10): ConflictItem, ConflictResolution, EntityType, LANGUAGE_MAPPING, NativeImportFile, NativeImportOptions, NativeImportResult, NativeImportResultItem (+2 more)

### Community 114 - "useSlugValidation.ts"
Cohesion: 0.38
Nodes (5): SlugInput(), SlugInputProps, SlugValidationResult, useSlugValidation(), UseSlugValidationOptions

### Community 115 - "route.ts"
Cohesion: 0.31
Nodes (4): GET(), PUT(), GET(), SiteConfigService

### Community 116 - "package.json"
Cohesion: 0.29
Nodes (6): description, engines, node, name, private, version

### Community 117 - "EditionStats.tsx"
Cohesion: 0.40
Nodes (3): EditionStatsCompactProps, EditionStatsProps, EditionStats

### Community 124 - "FooterService"
Cohesion: 0.25
Nodes (6): COMPETITION_TYPES, COUNTRIES, FilterState, SORT_OPTIONS, CompetitionGridSkeleton(), competitionsService

### Community 125 - "export-local.ts"
Cohesion: 0.67
Nodes (3): exportAll(), getCoordinates(), prisma

### Community 127 - "LayoutWrapper.tsx"
Cohesion: 0.15
Nodes (12): archivo, barlow, metadata, BACKOFFICE_ROUTES, LayoutWrapper(), LayoutWrapperProps, NO_FOOTER_ROUTES, IntlProvider() (+4 more)

### Community 131 - "@types/node"
Cohesion: 0.10
Nodes (22): MagazineCategoryPage(), ArticleCard(), ArticleCardProps, ArticleGrid(), ArticleGridProps, PostsBlock(), PostsBlockProps, PostForm() (+14 more)

### Community 138 - "EventSelect.tsx"
Cohesion: 0.26
Nodes (4): DELETE(), GET(), PUT(), ServiceService

### Community 140 - "clsx"
Cohesion: 0.18
Nodes (11): @aws-sdk/client-s3, js-cookie, jsonwebtoken, dependencies, @aws-sdk/client-s3, js-cookie, jsonwebtoken, @radix-ui/react-tabs (+3 more)

### Community 143 - "eslint-config-next"
Cohesion: 0.03
Nodes (100): POST(), POST(), GET(), POST(), POST(), GET(), DELETE(), PUT() (+92 more)

### Community 165 - "LanguageSelector.tsx"
Cohesion: 0.36
Nodes (6): LanguageSelector(), Locale, localeFlags, localeNames, locales, { Link, redirect, usePathname, useRouter }

### Community 185 - "footer.service.ts"
Cohesion: 0.29
Nodes (6): COMMUNITY, EXPLORE, Footer(), FOOTER_EXCLUDED_ROUTES, FooterLink, SOCIAL

### Community 192 - "DirectoryMapClient.tsx"
Cohesion: 0.29
Nodes (7): DirectoryFilters, DirectoryMapClient(), ItemType, MAP_TILES, MapMode, spreadOverlappingMarkers(), terrainTypesService

### Community 193 - "editionRating.schema.ts"
Cohesion: 0.25
Nodes (7): createEditionRatingSchema, GetRatingsQuery, getRatingsQuerySchema, GetRecentRatingsQuery, getRecentRatingsSchema, ratingSchema, updateEditionRatingSchema

### Community 194 - "EventMap.tsx"
Cohesion: 0.33
Nodes (6): EventMap(), EventMapMarker, EventMapProps, MAP_TILES, MapMode, spreadOverlappingMarkers()

### Community 195 - "MapBlock.tsx"
Cohesion: 0.13
Nodes (12): BlockConfigModal(), BlockConfigModalProps, HeroConfigForm(), HeroConfigFormProps, HomeBlockRendererProps, HomeService, CreateHomeBlockDTO, HomeBlock (+4 more)

### Community 197 - "impersonation.ts"
Cohesion: 0.80
Nodes (3): ImpersonationBar(), getImpersonatedName(), stopImpersonation()

## Knowledge Gaps
- **755 isolated node(s):** `CalView`, `CalEdition`, `MONTHS_ES`, `EventMap`, `DashboardLayoutProps` (+750 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **87 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `apiClientV2` connect `HomeBlockRenderer.tsx` to `admin.service.ts`, `button.tsx`, `requireAuth`, `@types/node`, `homeConfiguration.schema.ts`, `layout.tsx`, `user.service.ts`, `edition.ts`, `rating.ts`, `page.tsx`, `promotion.ts`, `HomeService`, `index.ts`, `events.service.ts`, `ZancadasBalance.tsx`, `home.ts`, `email-templates.service.ts`, `auth.schema.ts`, `page.tsx`, `MapBlock.tsx`, `services.service.ts`, `impersonation.ts`, `SpecialSeries`, `User`, `photos.service.ts`, `TranslationsService`, `dependencies`, `EventMap.tsx`, `DirectoryMapClient.tsx`?**
  _High betweenness centrality (0.254) - this node is a cross-community bridge._
- **What connects `CalView`, `CalEdition`, `MONTHS_ES` to the rest of the system?**
  _764 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `apiSuccess` be split into smaller, more focused modules?**
  _Cohesion score 0.05487269534679543 - nodes in this community are weakly interconnected._
- **Should `requireRole` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Should `admin.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04887218045112782 - nodes in this community are weakly interconnected._
- **Should `button.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1310483870967742 - nodes in this community are weakly interconnected._
- **Should `AdminService` be split into smaller, more focused modules?**
  _Cohesion score 0.038461538461538464 - nodes in this community are weakly interconnected._