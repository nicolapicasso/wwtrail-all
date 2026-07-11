# Graph Report - wwtrail  (2026-07-11)

## Corpus Check
- 477 files · ~256,990 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2806 nodes · 6352 edges · 191 communities (109 shown, 82 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a6d1753b`
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
- migrate-uploads-to-spaces.js
- DashboardNav.tsx
- WeatherCard.tsx
- SpecialSeries
- user-competition.schema.ts
- OmniwalletService
- page.tsx
- userEdition.schema.ts
- EventManagersPanel.tsx
- catalogs.service.ts
- admin.schema.ts
- CountrySelect.tsx
- photos.service.ts
- devDependencies
- error-handler.ts
- competition-admin.service.ts
- Service
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
- UserCompetitionService
- FeaturedEvents.tsx
- useSlugValidation.ts
- WeatherService
- package.json
- EditionStats.tsx
- CatalogService
- EventManagerService
- FavoritesService
- client.ts
- EmailService
- EventSelect.tsx
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
- bcryptjs
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
- @radix-ui/react-switch
- @radix-ui/react-toast
- react-dom
- react-hook-form
- sharp
- slugify
- sonner
- tailwind-merge
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
- @types/react
- @types/react-dom
- typescript
- tailwind.config.ts
- apiClient
- cacheService

## God Nodes (most connected - your core abstractions)
1. `apiSuccess()` - 263 edges
2. `apiError` - 262 edges
3. `requireRole()` - 155 edges
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
- `NewEventPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/events/new/page.tsx → contexts/AuthContext.tsx
- `MyEventsPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/events/page.tsx → hooks/useAuth.ts
- `OrganizerLayout()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/layout.tsx → contexts/AuthContext.tsx
- `OrganizerPostsPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/posts/page.tsx → contexts/AuthContext.tsx

## Import Cycles
- None detected.

## Communities (191 total, 82 thin omitted)

### Community 0 - "apiSuccess"
Cohesion: 0.05
Nodes (59): POST(), autoFixEncoding(), fixCatalogEncoding(), fixCorruptedFaqs(), GET(), POST(), GET(), POST() (+51 more)

### Community 1 - "requireRole"
Cohesion: 0.04
Nodes (50): adminService, GET(), adminService, GET(), GET(), POST(), toSpacesCdn(), adminService (+42 more)

### Community 2 - "admin.service.ts"
Cohesion: 0.04
Nodes (48): FilterRow(), getOperatorsForType(), OPERATOR_LABELS, ENTITY_OPTIONS, EXAMPLE_JSON, FullImportResult, ImportData, ImportResult (+40 more)

### Community 3 - "button.tsx"
Cohesion: 0.10
Nodes (40): EventMap, ExportStats, InsiderConfig, InsiderStats, ACTION_ICONS, ACTION_LABELS, PARTICIPATION_STATUSES, ENTITY_CONFIGS (+32 more)

### Community 4 - "requireAuth"
Cohesion: 0.06
Nodes (39): GET(), DELETE(), ALLOWED_CONTENT_TYPES, POST(), ALLOWED_TYPES, POST(), ALLOWED_TYPES, POST() (+31 more)

### Community 6 - "useAuth"
Cohesion: 0.07
Nodes (35): LoginPage(), RegisterPage(), DashboardPage(), NewLandingPage(), PromotionsAnalyticsPage(), NewPromotionPage(), ServiceCategoriesAdminPage(), EditServicePage() (+27 more)

### Community 7 - "homeConfiguration.schema.ts"
Cohesion: 0.07
Nodes (33): PATCH(), POST(), GET(), POST(), PUT(), ContentBlockConfig, ContentBlockConfigSchema, CreateHomeBlockInput (+25 more)

### Community 8 - "page.tsx"
Cohesion: 0.08
Nodes (35): AdminUsersPage(), ROLE_OPTIONS, CategoryType, initialFormData, ParticipationFormData, ParticipationStatus, AddParticipationButtonProps, CategoryType (+27 more)

### Community 9 - "index.ts"
Cohesion: 0.09
Nodes (25): globalForPrisma, TokenPayload, SendCouponEmailParams, CreateEmailTemplateInput, UpdateEmailTemplateInput, AddManagerInput, EventManagerWithUser, UpdateFooterInput (+17 more)

### Community 10 - "layout.tsx"
Cohesion: 0.07
Nodes (30): archivo, barlow, metadata, COMMUNITY, EXPLORE, Footer(), FOOTER_EXCLUDED_ROUTES, FooterLink (+22 more)

### Community 11 - "user.service.ts"
Cohesion: 0.09
Nodes (32): InsidersAdminPage(), InsiderData, InsidersPage(), ParticipationCard(), UserProfilePage(), InsiderBadge(), InsiderBadgeProps, positionClasses (+24 more)

### Community 12 - "edition.ts"
Cohesion: 0.12
Nodes (26): EditionCard(), EditionCardProps, EditionsGridProps, EditionDetailTabsProps, EditionFormProps, EditionBackendResponse, editionsService, EditionStatus (+18 more)

### Community 13 - "competition.ts"
Cohesion: 0.14
Nodes (18): EditCompetitionPageProps, CompetitionCard(), CompetitionCardCompactProps, CompetitionCardProps, COUNTRY_FLAGS, CompetitionGrid(), CompetitionGridProps, ConfirmDialog() (+10 more)

### Community 14 - "page.tsx"
Cohesion: 0.10
Nodes (19): CompetitionDetailPage(), EventDetailPage(), getMonthName(), OrganizerDetailPage(), EventMap, ServiceDetailPage(), EventGallery(), EventGalleryProps (+11 more)

### Community 15 - "import.service.ts"
Cohesion: 0.11
Nodes (21): FullImport, FullImportResult, fullImportSchema, ImportCompetition, importCompetitionSchema, ImportEvent, importEventSchema, ImportOrganizer (+13 more)

### Community 16 - "EventService"
Cohesion: 0.10
Nodes (10): DELETE(), GET(), PUT(), GET(), GET(), GET(), POST(), getAuthUser() (+2 more)

### Community 17 - "post.ts"
Cohesion: 0.11
Nodes (19): MagazineCategoryPage(), NewEventPage(), OrganizerPostsPage(), ArticleCard(), ArticleCardProps, ArticleGrid(), ArticleGridProps, ServiceForm() (+11 more)

### Community 18 - "event.service.ts"
Cohesion: 0.15
Nodes (18): prisma, CreateEventInput, EventFilters, UpdateEventInput, CreatePostInput, PostFilters, UpdatePostInput, CreateServiceInput (+10 more)

### Community 20 - "CompetitionService"
Cohesion: 0.12
Nodes (10): POST(), POST(), DELETE(), GET(), PATCH(), PUT(), GET(), POST() (+2 more)

### Community 21 - "rating.ts"
Cohesion: 0.14
Nodes (13): RatingCardProps, RatingFormProps, RatingSummaryProps, RecentRatingsWidgetProps, StarRatingProps, ratingsService, CreateRatingDTO, EditionRating (+5 more)

### Community 22 - "page.tsx"
Cohesion: 0.15
Nodes (19): EditEditionPage(), EditEditionPageProps, EditionDetailTabs(), TODO: Get from API, TabKey, PodiumCardProps, PodiumPositionProps, PodiumFormProps (+11 more)

### Community 23 - "page.tsx"
Cohesion: 0.11
Nodes (24): COLUMNS, FooterAdminPage(), LANGUAGES, EditLandingPage(), LandingsAdminPage(), SEOConfigPage(), GroupedSEO, SEOManagementPage() (+16 more)

### Community 24 - "promotion.ts"
Cohesion: 0.13
Nodes (17): PromotionsService, AddCodesResponse, AddCouponCodesInput, CouponAnalyticsResponse, CouponCode, CouponRedemption, CouponRedemptionResponse, CouponStats (+9 more)

### Community 25 - "compilerOptions"
Cohesion: 0.07
Nodes (28): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+20 more)

### Community 27 - "HomeService"
Cohesion: 0.13
Nodes (12): BlockConfigModal(), BlockConfigModalProps, HeroConfigForm(), HeroConfigFormProps, HomeBlockRendererProps, HomeService, CreateHomeBlockDTO, HomeBlock (+4 more)

### Community 28 - "generateUniqueSlug"
Cohesion: 0.11
Nodes (16): cache, memoryCache, CreateOrganizerInput, OrganizerFilters, UpdateOrganizerInput, CreatePromotionInput, PromotionFilters, RedeemCouponInput (+8 more)

### Community 29 - "Language"
Cohesion: 0.13
Nodes (13): ALL_LANGUAGES, PageProps, LandingFormProps, LANGUAGES, CreateLandingInput, GetLandingsParams, GetLandingsResponse, Landing (+5 more)

### Community 30 - "use-toast.ts"
Cohesion: 0.12
Nodes (23): Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle, toastVariants (+15 more)

### Community 31 - "user.service.ts"
Cohesion: 0.11
Nodes (15): ChangePasswordInput, changePasswordSchema, GetPublicUsersQuery, getPublicUsersSchema, GetUsersQuery, getUsersSchema, UpdateUserInput, updateUserSchema (+7 more)

### Community 32 - "EditionService"
Cohesion: 0.12
Nodes (8): GET(), DELETE(), GET(), PUT(), GET(), POST(), GET(), EditionService

### Community 33 - "catalog.service.ts"
Cohesion: 0.13
Nodes (14): CreateCatalogInput, createCatalogSchema, CreateSpecialSeriesInput, createSpecialSeriesSchema, GetCatalogQuery, getCatalogQuerySchema, UpdateCatalogInput, updateCatalogSchema (+6 more)

### Community 34 - "PromotionForm.tsx"
Cohesion: 0.13
Nodes (16): BORDER_RADIUS_OPTIONS, FONT_OPTIONS, SHADOW_OPTIONS, SiteConfig, SiteConfigPage(), FileUpload(), FileUploadProps, LANGUAGES (+8 more)

### Community 35 - "index.ts"
Cohesion: 0.13
Nodes (7): PostForm(), PostFormProps, MyStats, PostsService, CreatePostInput, Post, UpdatePostInput

### Community 36 - "organizers.service.ts"
Cohesion: 0.15
Nodes (11): ORG_COLORS, OrganizersPublicPage(), orgColor(), orgInitials(), OrganizersService, CreateOrganizerInput, Organizer, OrganizerFilters (+3 more)

### Community 37 - "events.service.ts"
Cohesion: 0.16
Nodes (8): EventsService, CreateEventData, EventFilters, EventResponse, EventsResponse, EventStatsResponse, RejectEventData, UpdateEventData

### Community 38 - "page.tsx"
Cohesion: 0.16
Nodes (16): CompetitionDetailPage(), CompetitionCardProps, CompetitionList(), CompetitionListCompact(), CompetitionListCompactProps, CompetitionListProps, EditionSelector(), EditionSelectorCompact() (+8 more)

### Community 39 - "ZancadasBalance.tsx"
Cohesion: 0.15
Nodes (15): Skeleton(), ZancadasBalance(), ZancadasBalanceProps, ACTION_ICONS, ACTION_LABELS, ZancadasHistory(), ZancadasHistoryProps, CompetitionMarker (+7 more)

### Community 40 - "errors.ts"
Cohesion: 0.14
Nodes (10): prisma, EditionWeather, AppError, BadRequestError, ConflictError, ForbiddenError, InternalServerError, NotFoundError (+2 more)

### Community 41 - "EditionPodiumService"
Cohesion: 0.13
Nodes (11): DELETE(), PUT(), GET(), POST(), CreatePodiumInput, createPodiumSchema, UpdateChronicleInput, updateChronicleSchema (+3 more)

### Community 42 - "serviceCategories.service.ts"
Cohesion: 0.13
Nodes (12): PromotionCategoriesPage(), EditPromotionPage(), AdminPromotionsPage(), PromotionDetailPage(), PromotionCardProps, PromotionFormProps, CreateServiceCategoryInput, ServiceCategory (+4 more)

### Community 43 - "home.ts"
Cohesion: 0.20
Nodes (15): LinksBlockProps, MAP_TILES, MapBlockProps, TextBlockProps, BlockConfig, HomeBlockType, HomeBlockViewType, HomeTextAlign (+7 more)

### Community 44 - "user-competitions.service.ts"
Cohesion: 0.16
Nodes (8): userCompetitionsService, AddResultData, MarkCompetitionData, RankingEntry, UpdateUserCompetitionData, UserCompetition, UserCompetitionStatus, UserStats

### Community 45 - "apiClientV2"
Cohesion: 0.12
Nodes (12): apiClientV2, Footer, FooterContent, FooterService, GenerateSEOInput, SEOConfig, UpsertConfigInput, BulkTranslationResponse (+4 more)

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
Cohesion: 0.20
Nodes (13): loginSchema, POST(), POST(), POST(), registerSchema, POST(), AuthUser, comparePassword() (+5 more)

### Community 50 - "ai-autofill.service.ts"
Cohesion: 0.21
Nodes (16): POST(), autoFillCompetition(), autoFillEvent(), classifyImage(), CompetitionAutoFillResult, EventAutoFillResult, extractImagesFromHtml(), fetchPageContent() (+8 more)

### Community 51 - "OrganizerService"
Cohesion: 0.15
Nodes (7): DELETE(), GET(), PUT(), GET(), POST(), GET(), OrganizerService

### Community 52 - "page.tsx"
Cohesion: 0.13
Nodes (13): COMPETITION_TYPES, COUNTRIES, FilterState, SORT_OPTIONS, COMPETITION_TYPES, CompetitionFilters(), CompetitionFiltersProps, COUNTRIES (+5 more)

### Community 53 - "page.tsx"
Cohesion: 0.14
Nodes (12): MyEventsPage(), ViewMode, BulkActionsBar(), BulkActionsBarProps, COUNTRY_FLAGS, EventCard(), EventCardProps, MONTHS (+4 more)

### Community 54 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 55 - "HomeBlockRenderer.tsx"
Cohesion: 0.16
Nodes (15): CompetitionsBlock(), CompetitionsBlockProps, EditionsBlock(), EditionsBlockProps, EventsBlock(), EventsBlockProps, MapBlock, LinksBlock() (+7 more)

### Community 56 - "useAuth.ts"
Cohesion: 0.22
Nodes (9): AuthContextType, AuthContextValue, AuthService, AuthResponse, LoginCredentials, RefreshTokenResponse, RegisterData, User (+1 more)

### Community 57 - "bulk-edit.service.ts"
Cohesion: 0.15
Nodes (10): BulkEditEntityType, BulkEditFilters, BulkEditOperation, BulkEditPreview, BulkEditResult, BulkEditService, EntityMetadata, FieldMetadata (+2 more)

### Community 59 - "useAuth"
Cohesion: 0.15
Nodes (11): OrganizerCompetitionsPage(), OrganizerEditionsPage(), EditEventPage(), EditOrganizerPage(), OrganizersListPage(), OrganizerDashboard(), SpecialSeriesListPage(), CompetitionForm() (+3 more)

### Community 60 - "EventList.tsx"
Cohesion: 0.13
Nodes (9): EventFiltersProps, EventFilters, EventList(), EventListProps, EventListSimple(), EventListSimpleProps, PaginationData, useEvents() (+1 more)

### Community 61 - "EventForm.tsx"
Cohesion: 0.13
Nodes (13): EventForm(), EventFormProps, ImageAssignment, ImageImportSelector(), ImageRole, Props, ROLE_COLORS, ROLE_LABELS (+5 more)

### Community 62 - "editionRating.schema.ts"
Cohesion: 0.14
Nodes (10): CreateEditionRatingInput, createEditionRatingSchema, GetRatingsQuery, getRatingsQuerySchema, GetRecentRatingsQuery, getRecentRatingsSchema, ratingSchema, UpdateEditionRatingInput (+2 more)

### Community 63 - "ExportService"
Cohesion: 0.24
Nodes (3): ExportOptions, ExportResult, ExportService

### Community 65 - "PromotionService"
Cohesion: 0.18
Nodes (7): DELETE(), GET(), PUT(), GET(), POST(), GET(), PromotionService

### Community 66 - "CompetitionActions.tsx"
Cohesion: 0.18
Nodes (14): CompetitionActions(), CompetitionActionsProps, LanguageSelector(), Navbar(), DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel (+6 more)

### Community 67 - "Event"
Cohesion: 0.16
Nodes (12): EventCardProps, EventStatusBadge(), EventStatusBadgeProps, ApiResponse, EventFilters, EventResponseV1, EventsResponseV1, PaginationData (+4 more)

### Community 68 - "services.service.ts"
Cohesion: 0.22
Nodes (8): ServicesService, CategoriesResponse, CreateServiceInput, ServiceFilters, ServiceResponse, ServicesResponse, ServiceStatus, UpdateServiceInput

### Community 69 - "LandingService"
Cohesion: 0.15
Nodes (9): CreateLandingInput, createLandingSchema, GetLandingsQuery, getLandingsSchema, TranslateLandingInput, translateLandingSchema, UpdateLandingInput, updateLandingSchema (+1 more)

### Community 70 - "route.ts"
Cohesion: 0.20
Nodes (13): importService, POST(), DELETE(), GET(), importService, POST(), NativeImportOptions, ENCODING_FIXES (+5 more)

### Community 71 - "EmailTemplateService"
Cohesion: 0.17
Nodes (5): GET(), PUT(), GET(), POST(), EmailTemplateService

### Community 72 - "page.tsx"
Cohesion: 0.13
Nodes (8): AddParticipationButton(), EditionParticipants(), EventMap(), EventMapMarker, EventMapProps, MAP_TILES, MapMode, spreadOverlappingMarkers()

### Community 73 - "event.ts"
Cohesion: 0.13
Nodes (12): CreateEventInput, EventCompetitionSummary, EventCreatorRef, EventListResponse, EventNearby, EventSearchResult, EventStats, EventTranslation (+4 more)

### Community 74 - "v2.ts"
Cohesion: 0.21
Nodes (9): abbreviate(), colorFor(), HEADER_COLORS, SpecialSeriesCard(), SpecialSeriesCardProps, SpecialSeriesGrid(), SpecialSeriesGridProps, SpecialSeriesListItem (+1 more)

### Community 75 - "competition-admin.schema.ts"
Cohesion: 0.12
Nodes (15): ApproveCompetitionInput, ApproveCompetitionParams, approveCompetitionSchema, GetOrganizerCompetitionsQuery, getOrganizerCompetitionsSchema, GetPendingCompetitionsQuery, getPendingCompetitionsSchema, GetStatsQuery (+7 more)

### Community 76 - "migrate-uploads-to-spaces.js"
Cohesion: 0.17
Nodes (15): s3Client, convertUrl(), DRY_RUN, fileExistsOnSpaces(), fs, getAllFiles(), main(), MIME_TYPES (+7 more)

### Community 77 - "DashboardNav.tsx"
Cohesion: 0.18
Nodes (11): DashboardLayout(), DashboardLayoutProps, OrganizerLayout(), CollapsibleUserInfo(), CollapsibleUserInfoProps, DashboardNav(), NavItem, navItems (+3 more)

### Community 78 - "WeatherCard.tsx"
Cohesion: 0.22
Nodes (9): WeatherCardProps, WeatherDetailProps, WeatherResponse, weatherService, EditionWeather, WEATHER_COLORS, WEATHER_ICONS, WeatherCondition (+1 more)

### Community 79 - "SpecialSeries"
Cohesion: 0.21
Nodes (5): SpecialSeriesService, CreateSpecialSeriesInput, SpecialSeries, SpecialSeriesFilters, UpdateSpecialSeriesInput

### Community 80 - "user-competition.schema.ts"
Cohesion: 0.13
Nodes (14): AddResultInput, addResultSchema, competitionIdParamSchema, GetMyCompetitionsQuery, getMyCompetitionsSchema, GetUserCompetitionsParams, getUserCompetitionsSchema, GlobalRankingParams (+6 more)

### Community 82 - "page.tsx"
Cohesion: 0.19
Nodes (9): fetchTotal(), HeroSection(), HeroSectionProps, Stat, HomeBlockRenderer(), MapBand(), PINS, ITEMS (+1 more)

### Community 83 - "userEdition.schema.ts"
Cohesion: 0.16
Nodes (8): ParticipationsPage(), editionIdParamSchema, participationIdParamSchema, SearchEditionsQuery, searchEditionsSchema, UserEditionInput, userEditionSchema, UserEditionService

### Community 84 - "EventManagersPanel.tsx"
Cohesion: 0.20
Nodes (11): EventManagersPanelProps, Badge(), BadgeProps, badgeVariants, SelectContent, SelectItem, SelectLabel, SelectScrollDownButton (+3 more)

### Community 85 - "catalogs.service.ts"
Cohesion: 0.27
Nodes (10): catalogsService, competitionTypesService, CatalogType, CompetitionType, CreateCatalogDTO, CreateSpecialSeriesDTO, SpecialSeries, TerrainType (+2 more)

### Community 86 - "admin.schema.ts"
Cohesion: 0.14
Nodes (13): DeleteUserInput, deleteUserSchema, getStatsSchema, GetUserByIdInput, getUserByIdSchema, GetUsersInput, getUsersSchema, GetUserStatsInput (+5 more)

### Community 87 - "CountrySelect.tsx"
Cohesion: 0.21
Nodes (7): CountrySelect(), CountrySelectProps, SpecialSeriesForm(), SpecialSeriesFormProps, COUNTRIES, Country, searchCountries()

### Community 88 - "photos.service.ts"
Cohesion: 0.28
Nodes (7): EditionGalleryProps, photosService, EditionPhoto, PHOTO_UPLOAD_CONFIG, ReorderPhotosDTO, UpdatePhotoDTO, UploadPhotoDTO

### Community 89 - "devDependencies"
Cohesion: 0.15
Nodes (13): eslint, devDependencies, eslint, tailwindcss, @types/js-cookie, @types/node, @types/nodemailer, @types/uuid (+5 more)

### Community 90 - "error-handler.ts"
Cohesion: 0.17
Nodes (5): ApiError, ApiResponse, Language, LANGUAGE_NAMES, LANGUAGES

### Community 91 - "competition-admin.service.ts"
Cohesion: 0.17
Nodes (6): CompetitionAdminService, GetOrganizerOptions, GetPendingOptions, PaginatedCompetitions, TODO: Enviar notificación al organizador, TODO: Enviar notificación al organizador con razón

### Community 92 - "Service"
Cohesion: 0.26
Nodes (6): OrganizerServicesPage(), COUNTRY_FLAGS, ServiceCard(), ServiceCardProps, Service, ServiceCategory

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
Cohesion: 0.17
Nodes (12): scripts, build, db:export, db:import, dev, lint, prisma:generate, prisma:migrate (+4 more)

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
Cohesion: 0.22
Nodes (8): AddPointsData, CreateCustomerData, CustomerAttributes, CustomerLinks, CustomerResponse, OmniwalletConfig, TransactionAttributes, TransactionResponse

### Community 108 - "DirectoryMapClient.tsx"
Cohesion: 0.29
Nodes (7): DirectoryFilters, DirectoryMapClient(), ItemType, MAP_TILES, MapMode, spreadOverlappingMarkers(), terrainTypesService

### Community 110 - "participant.schema.ts"
Cohesion: 0.25
Nodes (7): CreateParticipantInput, createParticipantSchema, GetParticipantsQuery, getParticipantsSchema, participantIdSchema, UpdateParticipantInput, updateParticipantSchema

### Community 113 - "FeaturedEvents.tsx"
Cohesion: 0.43
Nodes (4): FeaturedEvents(), LargeCard(), mediaUrl(), SmallCard()

### Community 114 - "useSlugValidation.ts"
Cohesion: 0.38
Nodes (5): SlugInput(), SlugInputProps, SlugValidationResult, useSlugValidation(), UseSlugValidationOptions

### Community 116 - "package.json"
Cohesion: 0.29
Nodes (6): description, engines, node, name, private, version

### Community 117 - "EditionStats.tsx"
Cohesion: 0.40
Nodes (3): EditionStatsCompactProps, EditionStatsProps, EditionStats

### Community 125 - "export-local.ts"
Cohesion: 0.67
Nodes (3): exportAll(), getCoordinates(), prisma

## Knowledge Gaps
- **708 isolated node(s):** `EventMap`, `DashboardLayoutProps`, `SiteConfig`, `FONT_OPTIONS`, `BORDER_RADIUS_OPTIONS` (+703 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **82 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ParticipationsPage()` connect `userEdition.schema.ts` to `page.tsx`, `useAuth`?**
  _High betweenness centrality (0.393) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `useAuth` to `CompetitionActions.tsx`, `button.tsx`, `UserStatsCards.tsx`, `page.tsx`, `page.tsx`, `serviceCategories.service.ts`, `user-competitions.service.ts`, `DashboardNav.tsx`, `post.ts`, `userEdition.schema.ts`, `EventManagersPanel.tsx`, `page.tsx`, `page.tsx`, `Service`, `Language`, `useUserCompetitions`?**
  _High betweenness centrality (0.300) - this node is a cross-community bridge._
- **Why does `UserEditionService` connect `userEdition.schema.ts` to `index.ts`?**
  _High betweenness centrality (0.197) - this node is a cross-community bridge._
- **What connects `EventMap`, `DashboardLayoutProps`, `SiteConfig` to the rest of the system?**
  _717 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `apiSuccess` be split into smaller, more focused modules?**
  _Cohesion score 0.053989488772097464 - nodes in this community are weakly interconnected._
- **Should `requireRole` be split into smaller, more focused modules?**
  _Cohesion score 0.03559483994266603 - nodes in this community are weakly interconnected._
- **Should `admin.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.03822937625754527 - nodes in this community are weakly interconnected._