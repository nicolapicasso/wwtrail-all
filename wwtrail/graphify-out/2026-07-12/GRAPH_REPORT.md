# Graph Report - wwtrail  (2026-07-12)

## Corpus Check
- 503 files · ~270,173 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2953 nodes · 6737 edges · 197 communities (118 shown, 79 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d324ba8a`
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
- CatalogService
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
- page.tsx
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
- LayoutWrapper.tsx
- route.ts
- StatsCard.tsx
- StatsCard.tsx
- .deleteAllImportedData
- favorites.schema.ts
- next.config.js
- SearchableEntitySelect.tsx
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
- @aws-sdk/client-s3
- @radix-ui/react-toast
- react-dom
- react-hook-form
- @types/node
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
- @types/nodemailer
- yet-another-react-lightbox
- zod
- postcss
- prisma
- tsx
- @types/bcryptjs
- @types/jsonwebtoken
- @types/leaflet
- CompetitionActions.tsx
- @types/react-dom
- footer.service.ts
- tailwind.config.ts
- apiClient
- cacheService
- MapBlock.tsx
- MapBlock.tsx
- bcryptjs
- eslint-config-next
- react

## God Nodes (most connected - your core abstractions)
1. `apiSuccess()` - 290 edges
2. `apiError` - 289 edges
3. `requireRole()` - 174 edges
4. `useAuth()` - 76 edges
5. `AdminService` - 65 edges
6. `Button` - 41 edges
7. `requireAuth()` - 40 edges
8. `ImportService` - 37 edges
9. `apiClientV2` - 35 edges
10. `AdminService` - 35 edges

## Surprising Connections (you probably didn't know these)
- `MagazineCategoryPage()` --indirect_call--> `PostCategory`  [INFERRED]
  wwtrail/app/[locale]/magazine/[category]/page.tsx → wwtrail/types/post.ts
- `OrganizerCompetitionsPage()` --calls--> `useAuth()`  [EXTRACTED]
  wwtrail/app/[locale]/organizer/competitions/page.tsx → wwtrail/hooks/useAuth.ts
- `OrganizerEditionsPage()` --calls--> `useAuth()`  [EXTRACTED]
  wwtrail/app/[locale]/organizer/editions/page.tsx → wwtrail/hooks/useAuth.ts
- `NewEventPage()` --calls--> `useAuth()`  [EXTRACTED]
  wwtrail/app/[locale]/organizer/events/new/page.tsx → wwtrail/contexts/AuthContext.tsx
- `MyEventsPage()` --calls--> `useAuth()`  [EXTRACTED]
  wwtrail/app/[locale]/organizer/events/page.tsx → wwtrail/hooks/useAuth.ts

## Import Cycles
- None detected.

## Communities (197 total, 79 thin omitted)

### Community 0 - "apiSuccess"
Cohesion: 0.05
Nodes (68): POST(), autoFixEncoding(), fixCatalogEncoding(), fixCorruptedFaqs(), GET(), POST(), GET(), POST() (+60 more)

### Community 1 - "requireRole"
Cohesion: 0.04
Nodes (28): adminService, GET(), adminService, GET(), adminService, GET(), adminService, GET() (+20 more)

### Community 2 - "admin.service.ts"
Cohesion: 0.04
Nodes (42): FilterRow(), getOperatorsForType(), OPERATOR_LABELS, ENTITY_OPTIONS, EXAMPLE_JSON, FullImportResult, ImportData, ImportResult (+34 more)

### Community 3 - "button.tsx"
Cohesion: 0.15
Nodes (13): RatingCardProps, RatingFormProps, RatingSummaryProps, RecentRatingsWidgetProps, StarRatingProps, ratingsService, CreateRatingDTO, EditionRating (+5 more)

### Community 4 - "requireAuth"
Cohesion: 0.25
Nodes (9): MagazineCategoryPage(), ArticleCard(), ArticleCardProps, ArticleGrid(), ArticleGridProps, PostsBlock(), POST_CATEGORY_LABELS, PostCategory (+1 more)

### Community 6 - "useAuth"
Cohesion: 0.06
Nodes (37): LoginPage(), RegisterPage(), DashboardPage(), NewLandingPage(), OrganizerPostsPage(), PromotionsAnalyticsPage(), EditPromotionPage(), NewPromotionPage() (+29 more)

### Community 7 - "homeConfiguration.schema.ts"
Cohesion: 0.11
Nodes (29): COLUMNS, FooterAdminPage(), LANGUAGES, InsiderConfig, InsiderStats, EditLandingPage(), LandingsAdminPage(), SEOConfigPage() (+21 more)

### Community 8 - "page.tsx"
Cohesion: 0.11
Nodes (31): AdminUsersPage(), ROLE_OPTIONS, CategoryType, initialFormData, ParticipationFormData, ParticipationStatus, AddParticipationButtonProps, CategoryType (+23 more)

### Community 9 - "index.ts"
Cohesion: 0.09
Nodes (19): GET(), GET(), GET(), POST(), GET(), GET(), GET(), GET() (+11 more)

### Community 10 - "layout.tsx"
Cohesion: 0.15
Nodes (15): Skeleton(), ZancadasBalance(), ZancadasBalanceProps, ACTION_ICONS, ACTION_LABELS, ZancadasHistory(), ZancadasHistoryProps, CompetitionMarker (+7 more)

### Community 11 - "user.service.ts"
Cohesion: 0.19
Nodes (10): InsiderBadge(), InsiderBadgeProps, positionClasses, sizeClasses, Avatar(), AVATAR_COLORS, colorFor(), initialsOf() (+2 more)

### Community 12 - "edition.ts"
Cohesion: 0.11
Nodes (29): EditEditionPageProps, EditionCard(), EditionCardProps, EditionsGridProps, EditionFormProps, EditionsBlock(), EditionBackendResponse, editionsService (+21 more)

### Community 13 - "competition.ts"
Cohesion: 0.20
Nodes (11): PodiumCardProps, PodiumPositionProps, PodiumFormProps, podiumsService, CreatePodiumDTO, EditionPodium, MEDAL_EMOJIS, PODIUM_TYPE_LABELS (+3 more)

### Community 14 - "page.tsx"
Cohesion: 0.21
Nodes (16): POST(), autoFillCompetition(), autoFillEvent(), classifyImage(), CompetitionAutoFillResult, EventAutoFillResult, extractImagesFromHtml(), fetchPageContent() (+8 more)

### Community 15 - "import.service.ts"
Cohesion: 0.17
Nodes (12): FullImport, FullImportResult, fullImportSchema, ImportCompetition, importCompetitionSchema, ImportEvent, importEventSchema, ImportOrganizer (+4 more)

### Community 17 - "post.ts"
Cohesion: 0.12
Nodes (11): ForgotPasswordInput, forgotPasswordSchema, LoginInput, loginSchema, RefreshTokenInput, refreshTokenSchema, RegisterInput, registerSchema (+3 more)

### Community 18 - "event.service.ts"
Cohesion: 0.11
Nodes (26): prisma, CreateEventInput, EventFilters, UpdateEventInput, CreatePostInput, PostFilters, UpdatePostInput, GenerateSEOInput (+18 more)

### Community 21 - "rating.ts"
Cohesion: 0.27
Nodes (10): catalogsService, competitionTypesService, CatalogType, CompetitionType, CreateCatalogDTO, CreateSpecialSeriesDTO, SpecialSeries, TerrainType (+2 more)

### Community 23 - "page.tsx"
Cohesion: 0.09
Nodes (23): getCountryName(), ROLE_LABELS, StatsPage(), STATUS_LABELS, TYPE_LABELS, INSIDER_COLORS, insiderColor(), InsiderData (+15 more)

### Community 24 - "promotion.ts"
Cohesion: 0.13
Nodes (17): PromotionsService, AddCodesResponse, AddCouponCodesInput, CouponAnalyticsResponse, CouponCode, CouponRedemption, CouponRedemptionResponse, CouponStats (+9 more)

### Community 25 - "compilerOptions"
Cohesion: 0.07
Nodes (28): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+20 more)

### Community 26 - "ImportService"
Cohesion: 0.08
Nodes (30): POST(), PUT(), ContentBlockConfig, ContentBlockConfigSchema, CreateHomeBlockInput, createHomeBlockSchema, CreateHomeConfigurationInput, createHomeConfigurationSchema (+22 more)

### Community 27 - "HomeService"
Cohesion: 0.10
Nodes (21): OrganizerCompetitionsPage(), OrganizerEditionsPage(), CompetitionCardProps, CompetitionList(), CompetitionListCompact(), CompetitionListCompactProps, CompetitionListProps, ConfirmDialog() (+13 more)

### Community 28 - "generateUniqueSlug"
Cohesion: 0.14
Nodes (14): MyEventsPage(), ViewMode, BulkActionsBar(), BulkActionsBarProps, EventStatusBadge(), EventStatusBadgeProps, COUNTRY_FLAGS, EventCard() (+6 more)

### Community 29 - "Language"
Cohesion: 0.13
Nodes (12): NewEventPage(), PostForm(), PostFormProps, PostsService, CreatePostInput, LANGUAGE_LABELS, Post, PostFilters (+4 more)

### Community 30 - "use-toast.ts"
Cohesion: 0.12
Nodes (22): Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle, toastVariants (+14 more)

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
Cohesion: 0.26
Nodes (13): classifyImage(), decodeEntities(), extractImages(), fetchContent(), FetchedContent, fetchRendered(), fetchStatic(), htmlToText() (+5 more)

### Community 35 - "index.ts"
Cohesion: 0.14
Nodes (12): ALL_LANGUAGES, PageProps, LandingFormProps, LANGUAGES, CreateLandingInput, GetLandingsParams, GetLandingsResponse, Landing (+4 more)

### Community 36 - "organizers.service.ts"
Cohesion: 0.22
Nodes (6): OrganizersService, CreateOrganizerInput, Organizer, OrganizerFilters, OrganizerListItem, UpdateOrganizerInput

### Community 37 - "events.service.ts"
Cohesion: 0.08
Nodes (24): CompetitionDetailPage(), CompetitionDetailPage(), EventDetailPage(), getMonthName(), OrganizerDetailPage(), EventMap, ServiceDetailPage(), AddParticipationButton() (+16 more)

### Community 39 - "ZancadasBalance.tsx"
Cohesion: 0.09
Nodes (32): EventMap, ExportStats, ACTION_ICONS, ACTION_LABELS, PARTICIPATION_STATUSES, TODO: Implement actual API call to change password, COMPETITION_TYPES, COUNTRIES (+24 more)

### Community 40 - "errors.ts"
Cohesion: 0.06
Nodes (19): CreatePodiumInput, createPodiumSchema, UpdateChronicleInput, updateChronicleSchema, UpdatePodiumInput, updatePodiumSchema, EditionPodiumService, prisma (+11 more)

### Community 41 - "EditionPodiumService"
Cohesion: 0.19
Nodes (8): AgendaRow(), CalEdition, CalView, editionHref(), effDistance(), effElevation(), MONTHS_ES, MonthView()

### Community 42 - "serviceCategories.service.ts"
Cohesion: 0.10
Nodes (26): loginSchema, POST(), POST(), POST(), registerSchema, POST(), POST(), POST() (+18 more)

### Community 43 - "home.ts"
Cohesion: 0.23
Nodes (11): BORDER_RADIUS_OPTIONS, FONT_OPTIONS, SHADOW_OPTIONS, SiteConfig, SiteConfigPage(), ThemePresetService, BUILTIN_PRESETS, pickThemeValues() (+3 more)

### Community 44 - "user-competitions.service.ts"
Cohesion: 0.13
Nodes (12): MyRegistrationsPage(), UserStatsCards(), useUserCompetitions(), useUserStats(), userCompetitionsService, AddResultData, MarkCompetitionData, RankingEntry (+4 more)

### Community 45 - "apiClientV2"
Cohesion: 0.16
Nodes (12): FileUpload(), FileUploadProps, LandingForm(), LANGUAGES, PromotionForm(), RichTextEditor(), RichTextEditorProps, apiClientFiles (+4 more)

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
Cohesion: 0.10
Nodes (25): DELETE(), ALLOWED_CONTENT_TYPES, POST(), ALLOWED_TYPES, POST(), ALLOWED_TYPES, POST(), GET() (+17 more)

### Community 51 - "OrganizerService"
Cohesion: 0.16
Nodes (7): DELETE(), GET(), PUT(), GET(), POST(), GET(), OrganizerService

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
Cohesion: 0.17
Nodes (9): Competition, Edition, EventNode, FetchMode, Graph, MatchInfo, ScanResult, ScraperPage() (+1 more)

### Community 56 - "useAuth.ts"
Cohesion: 0.19
Nodes (10): AuthContextType, AuthContextValue, AuthService, createResponseInterceptor(), AuthResponse, LoginCredentials, RefreshTokenResponse, RegisterData (+2 more)

### Community 57 - "bulk-edit.service.ts"
Cohesion: 0.15
Nodes (10): BulkEditEntityType, BulkEditFilters, BulkEditOperation, BulkEditPreview, BulkEditResult, BulkEditService, EntityMetadata, FieldMetadata (+2 more)

### Community 58 - "SEOService"
Cohesion: 0.15
Nodes (4): getOpenAIKey(), getOpenAIKey(), SEOService, getOpenAIKey()

### Community 59 - "useAuth"
Cohesion: 0.21
Nodes (9): ORG_COLORS, OrganizersPublicPage(), orgColor(), orgInitials(), Locale, localeFlags, localeNames, locales (+1 more)

### Community 60 - "EventList.tsx"
Cohesion: 0.11
Nodes (14): EventFilters, EventList(), EventListProps, EventListSimple(), EventListSimpleProps, FeaturedEvents(), LargeCard(), mediaUrl() (+6 more)

### Community 61 - "EventForm.tsx"
Cohesion: 0.17
Nodes (7): AddManagerResponse, AvailableOrganizer, AvailableOrganizersResponse, EventManager, EventManagersService, ManagersResponse, RemoveManagerResponse

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
Cohesion: 0.12
Nodes (20): EditCompetitionPageProps, CompetitionActions(), CompetitionActionsProps, GenerateTranslationsButton(), GenerateTranslationsButtonProps, TranslationStatus, LanguageSelector(), Button (+12 more)

### Community 67 - "Event"
Cohesion: 0.18
Nodes (10): ConflictItem, ConflictResolution, EntityType, LANGUAGE_MAPPING, NativeImportFile, NativeImportOptions, NativeImportResult, NativeImportResultItem (+2 more)

### Community 68 - "services.service.ts"
Cohesion: 0.12
Nodes (16): ServiceFormProps, ServicesBlock(), COUNTRY_FLAGS, ServiceCard(), ServiceCardProps, ServicesService, CategoriesResponse, CreateServiceInput (+8 more)

### Community 69 - "LandingService"
Cohesion: 0.15
Nodes (9): CreateLandingInput, createLandingSchema, GetLandingsQuery, getLandingsSchema, TranslateLandingInput, translateLandingSchema, UpdateLandingInput, updateLandingSchema (+1 more)

### Community 70 - "route.ts"
Cohesion: 0.19
Nodes (11): DashboardLayout(), DashboardLayoutProps, OrganizerLayout(), CollapsibleUserInfo(), CollapsibleUserInfoProps, DashboardNav(), NavItem, navItems (+3 more)

### Community 72 - "page.tsx"
Cohesion: 0.22
Nodes (9): WeatherCardProps, WeatherDetailProps, WeatherResponse, weatherService, EditionWeather, WEATHER_COLORS, WEATHER_ICONS, WeatherCondition (+1 more)

### Community 74 - "v2.ts"
Cohesion: 0.17
Nodes (15): s3Client, convertUrl(), DRY_RUN, fileExistsOnSpaces(), fs, getAllFiles(), main(), MIME_TYPES (+7 more)

### Community 75 - "competition-admin.schema.ts"
Cohesion: 0.12
Nodes (15): ApproveCompetitionInput, ApproveCompetitionParams, approveCompetitionSchema, GetOrganizerCompetitionsQuery, getOrganizerCompetitionsSchema, GetPendingCompetitionsQuery, getPendingCompetitionsSchema, GetStatsQuery (+7 more)

### Community 76 - "SpecialSeries"
Cohesion: 0.15
Nodes (10): SpecialSeriesGrid(), SpecialSeriesGridProps, SpecialSeriesService, CreateSpecialSeriesInput, SpecialSeries, SpecialSeriesFilters, SpecialSeriesListItem, UpdateSpecialSeriesInput (+2 more)

### Community 77 - "ContentBlockConfig"
Cohesion: 0.20
Nodes (11): competitionsService, ApiError, ApiResponse, AuthResponse, Competition, CompetitionFilters, LoginCredentials, PaginatedResponse (+3 more)

### Community 78 - "page.tsx"
Cohesion: 0.12
Nodes (14): EventCardProps, EventMedia(), MONTHS_ES, PublicEventCardProps, apiClientV1, ApiResponse, EventFilters, EventResponseV1 (+6 more)

### Community 80 - "user-competition.schema.ts"
Cohesion: 0.13
Nodes (14): AddResultInput, addResultSchema, competitionIdParamSchema, GetMyCompetitionsQuery, getMyCompetitionsSchema, GetUserCompetitionsParams, getUserCompetitionsSchema, GlobalRankingParams (+6 more)

### Community 82 - "page.tsx"
Cohesion: 0.39
Nodes (7): base64UrlDecodeToString(), base64UrlToUint8Array(), EdgeTokenPayload, verifyJwtEdge(), config, intlMiddleware, middleware()

### Community 83 - "userEdition.schema.ts"
Cohesion: 0.11
Nodes (15): EventManagersPanel(), EventManagersPanelProps, AccordionContent, AccordionItem, AccordionTrigger, Badge(), BadgeProps, badgeVariants (+7 more)

### Community 84 - "User"
Cohesion: 0.25
Nodes (6): AdminPromotionsPage(), PromotionCardProps, PromotionFormProps, Promotion, PromotionStatus, PromotionType

### Community 85 - "catalogs.service.ts"
Cohesion: 0.14
Nodes (13): CompetitionCard(), CompetitionCardCompactProps, CompetitionCardProps, COUNTRY_FLAGS, COMPETITION_TYPES, CompetitionFilters(), CompetitionFiltersProps, COUNTRIES (+5 more)

### Community 86 - "admin.schema.ts"
Cohesion: 0.14
Nodes (13): DeleteUserInput, deleteUserSchema, getStatsSchema, GetUserByIdInput, getUserByIdSchema, GetUsersInput, getUsersSchema, GetUserStatsInput (+5 more)

### Community 87 - "CatalogService"
Cohesion: 0.33
Nodes (6): EventMap(), EventMapMarker, EventMapProps, MAP_TILES, MapMode, spreadOverlappingMarkers()

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
Cohesion: 0.23
Nodes (9): InsidersAdminPage(), ParticipationCard(), profileInitials(), UserProfilePage(), UserCard(), useInsiderBadge(), PublicUserProfile, getCountryFlag() (+1 more)

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
Nodes (24): getEntitiesWithoutSEO(), globalForPrisma, TokenPayload, SendCouponEmailParams, CreateEmailTemplateInput, UpdateEmailTemplateInput, AddManagerInput, EventManagerWithUser (+16 more)

### Community 108 - "page.tsx"
Cohesion: 0.33
Nodes (6): PromotionCategoriesPage(), ServiceCategoriesAdminPage(), CreateServiceCategoryInput, ServiceCategory, ServiceCategoryWithCount, UpdateServiceCategoryInput

### Community 109 - "DirectoryMapClient.tsx"
Cohesion: 0.29
Nodes (7): DirectoryFilters, DirectoryMapClient(), ItemType, MAP_TILES, MapMode, spreadOverlappingMarkers(), terrainTypesService

### Community 110 - "participant.schema.ts"
Cohesion: 0.25
Nodes (7): CreateParticipantInput, createParticipantSchema, GetParticipantsQuery, getParticipantsSchema, participantIdSchema, UpdateParticipantInput, updateParticipantSchema

### Community 111 - "ServiceService"
Cohesion: 0.39
Nodes (5): CountrySelect(), CountrySelectProps, COUNTRIES, Country, searchCountries()

### Community 112 - "EventCard.tsx"
Cohesion: 0.14
Nodes (23): annotateExisting(), bigrams(), dice(), distSim(), jaccard(), nameSim(), norm(), pct() (+15 more)

### Community 113 - "events.service.ts"
Cohesion: 0.11
Nodes (7): FAQItem, SEOFaqSchema(), SEOFaqSchemaProps, GenerateSEOInput, SEOConfig, SEOService, UpsertConfigInput

### Community 114 - "useSlugValidation.ts"
Cohesion: 0.38
Nodes (5): SlugInput(), SlugInputProps, SlugValidationResult, useSlugValidation(), UseSlugValidationOptions

### Community 115 - "SpecialSeries"
Cohesion: 0.16
Nodes (8): apiClientV2, Footer, FooterContent, FooterService, BulkTranslationResponse, EntityStats, TranslationResponse, TranslationStatsResponse

### Community 116 - "package.json"
Cohesion: 0.29
Nodes (6): description, engines, node, name, private, version

### Community 117 - "EditionStats.tsx"
Cohesion: 0.40
Nodes (3): EditionStatsCompactProps, EditionStatsProps, EditionStats

### Community 118 - "@radix-ui/react-switch"
Cohesion: 0.18
Nodes (11): axios, dependencies, axios, @radix-ui/react-switch, sharp, slugify, tailwind-merge, @radix-ui/react-switch (+3 more)

### Community 121 - "client.ts"
Cohesion: 0.22
Nodes (12): importService, POST(), DELETE(), GET(), importService, POST(), ENCODING_FIXES, fixEncoding() (+4 more)

### Community 122 - "sharp"
Cohesion: 0.57
Nodes (5): EditionSelector(), EditionSelectorCompact(), EditionSelectorProps, useAvailableYears(), useEditionByYear()

### Community 123 - "tailwind-merge"
Cohesion: 0.40
Nodes (3): POST(), POST(), ScraperService

### Community 125 - "export-local.ts"
Cohesion: 0.67
Nodes (3): exportAll(), getCoordinates(), prisma

### Community 127 - "LayoutWrapper.tsx"
Cohesion: 0.15
Nodes (11): archivo, barlow, metadata, IntlProvider(), Props, SHADOW_MAP, SiteStyles, SiteStylesProvider() (+3 more)

### Community 131 - ".deleteAllImportedData"
Cohesion: 0.47
Nodes (5): abbreviate(), colorFor(), HEADER_COLORS, SpecialSeriesCard(), SpecialSeriesCardProps

### Community 136 - "SearchableEntitySelect.tsx"
Cohesion: 0.33
Nodes (8): EditEditionPage(), EditionDetailTabs(), EditionDetailTabsProps, TODO: Get from API, TabKey, usePodiums(), useRatings(), useWeather()

### Community 139 - "class-variance-authority"
Cohesion: 0.10
Nodes (16): cache, memoryCache, CreateOrganizerInput, OrganizerFilters, UpdateOrganizerInput, CreatePromotionInput, PromotionFilters, RedeemCouponInput (+8 more)

### Community 143 - "eslint-config-next"
Cohesion: 0.05
Nodes (40): POST(), POST(), GET(), POST(), toSpacesCdn(), adminService, GET(), PUT() (+32 more)

### Community 165 - ".approveContent"
Cohesion: 0.13
Nodes (11): EditEventPage(), EditOrganizerPage(), OrganizersListPage(), OrganizerDashboard(), SpecialSeriesListPage(), OrganizerForm(), OrganizerFormProps, ServiceForm() (+3 more)

### Community 185 - "footer.service.ts"
Cohesion: 0.19
Nodes (10): COMMUNITY, EXPLORE, Footer(), FOOTER_EXCLUDED_ROUTES, FooterLink, SOCIAL, BACKOFFICE_ROUTES, LayoutWrapper() (+2 more)

### Community 195 - "MapBlock.tsx"
Cohesion: 0.05
Nodes (49): BlockConfigModal(), BlockConfigModalProps, HeroConfigForm(), HeroConfigFormProps, CompetitionsBlock(), CompetitionsBlockProps, EditionsBlockProps, EventsBlock() (+41 more)

## Knowledge Gaps
- **736 isolated node(s):** `CalView`, `CalEdition`, `MONTHS_ES`, `EventMap`, `DashboardLayoutProps` (+731 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **79 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `apiClientV2` connect `SpecialSeries` to `admin.service.ts`, `button.tsx`, `useAuth`, `layout.tsx`, `edition.ts`, `competition.ts`, `rating.ts`, `page.tsx`, `promotion.ts`, `HomeService`, `Language`, `index.ts`, `organizers.service.ts`, `ZancadasBalance.tsx`, `home.ts`, `email-templates.service.ts`, `index.ts`, `page.tsx`, `HomeBlockRenderer.tsx`, `EventForm.tsx`, `MapBlock.tsx`, `services.service.ts`, `route.ts`, `page.tsx`, `SpecialSeries`, `ContentBlockConfig`, `page.tsx`, `photos.service.ts`, `page.tsx`, `events.service.ts`, `sharp`?**
  _High betweenness centrality (0.249) - this node is a cross-community bridge._
- **What connects `CalView`, `CalEdition`, `MONTHS_ES` to the rest of the system?**
  _745 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `apiSuccess` be split into smaller, more focused modules?**
  _Cohesion score 0.04989322461657931 - nodes in this community are weakly interconnected._
- **Should `requireRole` be split into smaller, more focused modules?**
  _Cohesion score 0.03989071038251366 - nodes in this community are weakly interconnected._
- **Should `admin.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04389212057112639 - nodes in this community are weakly interconnected._
- **Should `button.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1452991452991453 - nodes in this community are weakly interconnected._
- **Should `AdminService` be split into smaller, more focused modules?**
  _Cohesion score 0.038461538461538464 - nodes in this community are weakly interconnected._