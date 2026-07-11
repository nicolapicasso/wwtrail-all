# Graph Report - wwtrail  (2026-07-11)

## Corpus Check
- 482 files · ~258,294 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2822 nodes · 6407 edges · 193 communities (115 shown, 78 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `afd89f64`
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
- react
- @tiptap/react

## God Nodes (most connected - your core abstractions)
1. `apiSuccess()` - 268 edges
2. `apiError` - 267 edges
3. `requireRole()` - 160 edges
4. `useAuth()` - 74 edges
5. `AdminService` - 65 edges
6. `Button` - 41 edges
7. `requireAuth()` - 40 edges
8. `ImportService` - 37 edges
9. `AdminService` - 35 edges
10. `cn()` - 35 edges

## Surprising Connections (you probably didn't know these)
- `LoginPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/auth/login/page.tsx → contexts/AuthContext.tsx
- `MagazineCategoryPage()` --indirect_call--> `PostCategory`  [INFERRED]
  app/[locale]/magazine/[category]/page.tsx → types/post.ts
- `MyEventsPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/events/page.tsx → hooks/useAuth.ts
- `OrganizerLayout()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/layout.tsx → contexts/AuthContext.tsx
- `OrganizerPostsPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/posts/page.tsx → contexts/AuthContext.tsx

## Import Cycles
- None detected.

## Communities (193 total, 78 thin omitted)

### Community 0 - "apiSuccess"
Cohesion: 0.05
Nodes (68): autoFixEncoding(), fixCatalogEncoding(), fixCorruptedFaqs(), GET(), POST(), GET(), POST(), typeMap (+60 more)

### Community 1 - "requireRole"
Cohesion: 0.04
Nodes (28): adminService, GET(), adminService, GET(), adminService, GET(), adminService, GET() (+20 more)

### Community 2 - "admin.service.ts"
Cohesion: 0.04
Nodes (41): FilterRow(), getOperatorsForType(), OPERATOR_LABELS, ENTITY_OPTIONS, EXAMPLE_JSON, FullImportResult, ImportData, ImportResult (+33 more)

### Community 3 - "button.tsx"
Cohesion: 0.12
Nodes (22): LoginPage(), EventMap, ExportStats, ENTITY_CONFIGS, EntityConfig, EntityStats, EntityType, TranslationsDashboardPage() (+14 more)

### Community 4 - "requireAuth"
Cohesion: 0.08
Nodes (32): POST(), GET(), DELETE(), ALLOWED_CONTENT_TYPES, POST(), ALLOWED_TYPES, POST(), ALLOWED_TYPES (+24 more)

### Community 6 - "useAuth"
Cohesion: 0.09
Nodes (25): RegisterPage(), DashboardPage(), NewEventPage(), NewLandingPage(), PromotionsAnalyticsPage(), EditPromotionPage(), NewPromotionPage(), EditServicePage() (+17 more)

### Community 7 - "homeConfiguration.schema.ts"
Cohesion: 0.08
Nodes (28): ContentBlockConfig, ContentBlockConfigSchema, CreateHomeBlockInput, createHomeBlockSchema, CreateHomeConfigurationInput, createHomeConfigurationSchema, HomeBlockTypeSchema, HomeBlockViewTypeSchema (+20 more)

### Community 8 - "page.tsx"
Cohesion: 0.07
Nodes (39): AdminUsersPage(), ROLE_OPTIONS, CategoryType, initialFormData, ParticipationFormData, ParticipationStatus, AddParticipationButton(), AddParticipationButtonProps (+31 more)

### Community 9 - "index.ts"
Cohesion: 0.15
Nodes (14): ACTION_ICONS, ACTION_LABELS, PARTICIPATION_STATUSES, AdminEditUserPage(), Badge(), BadgeProps, badgeVariants, Switch (+6 more)

### Community 10 - "layout.tsx"
Cohesion: 0.15
Nodes (12): archivo, barlow, metadata, BACKOFFICE_ROUTES, LayoutWrapper(), LayoutWrapperProps, NO_FOOTER_ROUTES, IntlProvider() (+4 more)

### Community 11 - "user.service.ts"
Cohesion: 0.09
Nodes (33): InsidersAdminPage(), EditProfilePage(), InsiderData, InsidersPage(), ParticipationCard(), UserProfilePage(), InsiderBadge(), InsiderBadgeProps (+25 more)

### Community 12 - "edition.ts"
Cohesion: 0.12
Nodes (24): EditionCardProps, EditionsGridProps, EditionFormProps, EditionBackendResponse, EditionStatus, RegistrationStatus, BulkCreateEditionsInput, CreateEditionInput (+16 more)

### Community 13 - "competition.ts"
Cohesion: 0.17
Nodes (15): EditCompetitionPageProps, ConfirmDialog(), ConfirmDialogProps, CompetitionFormProps, UseCompetitionResult, UseCompetitionsResult, competitionsService, editionsService (+7 more)

### Community 14 - "page.tsx"
Cohesion: 0.12
Nodes (16): CompetitionDetailPage(), EventDetailPage(), getMonthName(), OrganizerDetailPage(), EventMap, ServiceDetailPage(), EventGallery(), EventGalleryProps (+8 more)

### Community 15 - "import.service.ts"
Cohesion: 0.07
Nodes (24): FullImport, FullImportResult, fullImportSchema, ImportCompetition, importCompetitionSchema, ImportEvent, importEventSchema, ImportOrganizer (+16 more)

### Community 17 - "post.ts"
Cohesion: 0.15
Nodes (12): MagazineCategoryPage(), OrganizerPostsPage(), ArticleCard(), ArticleCardProps, ArticleGrid(), ArticleGridProps, RelatedArticlesProps, MyStats (+4 more)

### Community 18 - "event.service.ts"
Cohesion: 0.09
Nodes (34): cache, memoryCache, prisma, SendCouponEmailParams, CreateEmailTemplateInput, UpdateEmailTemplateInput, CreateEventInput, EventFilters (+26 more)

### Community 21 - "rating.ts"
Cohesion: 0.15
Nodes (13): RatingCardProps, RatingFormProps, RatingSummaryProps, RecentRatingsWidgetProps, StarRatingProps, ratingsService, CreateRatingDTO, EditionRating (+5 more)

### Community 22 - "page.tsx"
Cohesion: 0.20
Nodes (11): PodiumCardProps, PodiumPositionProps, PodiumFormProps, podiumsService, CreatePodiumDTO, EditionPodium, MEDAL_EMOJIS, PODIUM_TYPE_LABELS (+3 more)

### Community 23 - "page.tsx"
Cohesion: 0.11
Nodes (28): COLUMNS, FooterAdminPage(), LANGUAGES, InsiderConfig, InsiderStats, EditLandingPage(), LandingsAdminPage(), SEOConfigPage() (+20 more)

### Community 24 - "promotion.ts"
Cohesion: 0.13
Nodes (17): PromotionsService, AddCodesResponse, AddCouponCodesInput, CouponAnalyticsResponse, CouponCode, CouponRedemption, CouponRedemptionResponse, CouponStats (+9 more)

### Community 25 - "compilerOptions"
Cohesion: 0.07
Nodes (28): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+20 more)

### Community 26 - "ImportService"
Cohesion: 0.13
Nodes (11): DELETE(), PUT(), GET(), POST(), ReorderPhotosInput, reorderPhotosSchema, UpdatePhotoMetadataInput, updatePhotoMetadataSchema (+3 more)

### Community 27 - "HomeService"
Cohesion: 0.06
Nodes (48): BlockConfigModal(), BlockConfigModalProps, HeroConfigForm(), HeroConfigFormProps, CompetitionsBlock(), CompetitionsBlockProps, EditionsBlock(), EditionsBlockProps (+40 more)

### Community 28 - "generateUniqueSlug"
Cohesion: 0.10
Nodes (6): ServiceCategoryService, CreateSpecialSeriesInput, SpecialSeriesFilters, SpecialSeriesService, UpdateSpecialSeriesInput, generateUniqueSlug()

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
Cohesion: 0.17
Nodes (13): CreateCatalogInput, createCatalogSchema, CreateSpecialSeriesInput, createSpecialSeriesSchema, GetCatalogQuery, getCatalogQuerySchema, UpdateCatalogInput, updateCatalogSchema (+5 more)

### Community 34 - "PromotionForm.tsx"
Cohesion: 0.16
Nodes (12): FileUpload(), FileUploadProps, LandingForm(), LANGUAGES, PromotionForm(), RichTextEditor(), RichTextEditorProps, apiClientFiles (+4 more)

### Community 35 - "index.ts"
Cohesion: 0.13
Nodes (11): PostForm(), PostFormProps, PostsService, CreatePostInput, Post, PostFilters, PostImage, PostStatus (+3 more)

### Community 36 - "organizers.service.ts"
Cohesion: 0.15
Nodes (11): ORG_COLORS, OrganizersPublicPage(), orgColor(), orgInitials(), OrganizersService, CreateOrganizerInput, Organizer, OrganizerFilters (+3 more)

### Community 37 - "events.service.ts"
Cohesion: 0.16
Nodes (8): EventsService, CreateEventData, EventFilters, EventResponse, EventsResponse, EventStatsResponse, RejectEventData, UpdateEventData

### Community 38 - "page.tsx"
Cohesion: 0.33
Nodes (9): CompetitionDetailPage(), EditionCard(), EditionSelector(), EditionSelectorCompact(), EditionSelectorProps, useCompetition(), useAvailableYears(), useEditionByYear() (+1 more)

### Community 39 - "ZancadasBalance.tsx"
Cohesion: 0.15
Nodes (15): Skeleton(), ZancadasBalance(), ZancadasBalanceProps, ACTION_ICONS, ACTION_LABELS, ZancadasHistory(), ZancadasHistoryProps, CompetitionMarker (+7 more)

### Community 40 - "errors.ts"
Cohesion: 0.14
Nodes (10): prisma, EditionWeather, AppError, BadRequestError, ConflictError, ForbiddenError, InternalServerError, NotFoundError (+2 more)

### Community 41 - "EditionPodiumService"
Cohesion: 0.18
Nodes (7): CreatePodiumInput, createPodiumSchema, UpdateChronicleInput, updateChronicleSchema, UpdatePodiumInput, updatePodiumSchema, EditionPodiumService

### Community 42 - "serviceCategories.service.ts"
Cohesion: 0.25
Nodes (6): AdminPromotionsPage(), PromotionCardProps, PromotionFormProps, Promotion, PromotionStatus, PromotionType

### Community 43 - "home.ts"
Cohesion: 0.23
Nodes (11): BORDER_RADIUS_OPTIONS, FONT_OPTIONS, SHADOW_OPTIONS, SiteConfig, SiteConfigPage(), ThemePresetService, BUILTIN_PRESETS, pickThemeValues() (+3 more)

### Community 44 - "user-competitions.service.ts"
Cohesion: 0.16
Nodes (8): userCompetitionsService, AddResultData, MarkCompetitionData, RankingEntry, UpdateUserCompetitionData, UserCompetition, UserCompetitionStatus, UserStats

### Community 45 - "apiClientV2"
Cohesion: 0.13
Nodes (9): apiClientV2, createResponseInterceptor(), Footer, FooterContent, FooterService, BulkTranslationResponse, EntityStats, TranslationResponse (+1 more)

### Community 46 - "email-templates.service.ts"
Cohesion: 0.18
Nodes (11): EmailTemplatesPage(), EmailTemplatesService, CreateEmailTemplateInput, EMAIL_TEMPLATE_TYPES, EmailTemplate, EmailTemplatePreviewResponse, EmailTemplateResponse, EmailTemplatesResponse (+3 more)

### Community 47 - "auth.schema.ts"
Cohesion: 0.12
Nodes (12): ForgotPasswordInput, forgotPasswordSchema, LoginInput, loginSchema, RefreshTokenInput, refreshTokenSchema, RegisterInput, registerSchema (+4 more)

### Community 48 - "event.schema.ts"
Cohesion: 0.10
Nodes (19): CreateEventInput, createEventSchema, eventIdSchema, EventsByCountryParams, EventsByCountryQuery, eventsByCountrySchema, eventSlugSchema, FeaturedEventsQuery (+11 more)

### Community 49 - "index.ts"
Cohesion: 0.11
Nodes (21): loginSchema, POST(), POST(), POST(), registerSchema, POST(), POST(), toSpacesCdn() (+13 more)

### Community 50 - "ai-autofill.service.ts"
Cohesion: 0.21
Nodes (16): POST(), autoFillCompetition(), autoFillEvent(), classifyImage(), CompetitionAutoFillResult, EventAutoFillResult, extractImagesFromHtml(), fetchPageContent() (+8 more)

### Community 51 - "OrganizerService"
Cohesion: 0.15
Nodes (7): DELETE(), GET(), PUT(), GET(), POST(), GET(), OrganizerService

### Community 52 - "page.tsx"
Cohesion: 0.24
Nodes (8): CreatePromotionInput, PromotionFilters, RedeemCouponInput, UpdatePromotionInput, applyTranslations(), applyTranslationsToList(), parseLanguage(), Translatable

### Community 53 - "page.tsx"
Cohesion: 0.16
Nodes (12): MyEventsPage(), ViewMode, BulkActionsBar(), BulkActionsBarProps, COUNTRY_FLAGS, EventCard(), EventCardProps, MONTHS (+4 more)

### Community 54 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 55 - "HomeBlockRenderer.tsx"
Cohesion: 0.22
Nodes (7): getCountryName(), ROLE_LABELS, StatsPage(), STATUS_LABELS, TYPE_LABELS, ComprehensiveStats, ZancadasStats

### Community 56 - "useAuth.ts"
Cohesion: 0.22
Nodes (9): AuthContextType, AuthContextValue, AuthService, AuthResponse, LoginCredentials, RefreshTokenResponse, RegisterData, User (+1 more)

### Community 57 - "bulk-edit.service.ts"
Cohesion: 0.15
Nodes (10): BulkEditEntityType, BulkEditFilters, BulkEditOperation, BulkEditPreview, BulkEditResult, BulkEditService, EntityMetadata, FieldMetadata (+2 more)

### Community 58 - "SEOService"
Cohesion: 0.14
Nodes (4): getOpenAIKey(), SEOService, PUBLIC_SELECT, getOpenAIKey()

### Community 59 - "useAuth"
Cohesion: 0.15
Nodes (11): OrganizerCompetitionsPage(), OrganizerEditionsPage(), EditEventPage(), EditOrganizerPage(), OrganizersListPage(), OrganizerDashboard(), SpecialSeriesListPage(), CompetitionForm() (+3 more)

### Community 60 - "EventList.tsx"
Cohesion: 0.22
Nodes (8): EventFiltersProps, EventFilters, EventList(), EventListProps, EventListSimple(), EventListSimpleProps, PublicEventCard(), useEvents()

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
Cohesion: 0.16
Nodes (16): LanguageSelector(), Navbar(), DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator (+8 more)

### Community 67 - "Event"
Cohesion: 0.13
Nodes (11): PaginationData, UseEventsResult, apiClientV1, ApiResponse, EventFilters, EventResponseV1, EventsResponseV1, PaginationData (+3 more)

### Community 68 - "services.service.ts"
Cohesion: 0.12
Nodes (16): OrganizerServicesPage(), ServicesBlock(), ServicesBlockProps, COUNTRY_FLAGS, ServiceCard(), ServiceCardProps, ServicesService, CategoriesResponse (+8 more)

### Community 69 - "LandingService"
Cohesion: 0.15
Nodes (10): CreateLandingInput, createLandingSchema, GetLandingsQuery, getLandingsSchema, TranslateLandingInput, translateLandingSchema, UpdateLandingInput, updateLandingSchema (+2 more)

### Community 70 - "route.ts"
Cohesion: 0.05
Nodes (43): POST(), POST(), GET(), importService, POST(), DELETE(), GET(), importService (+35 more)

### Community 72 - "page.tsx"
Cohesion: 0.11
Nodes (11): AdminEditButton(), AdminEditButtonFloating(), AdminEditButtonProps, EditionParticipants(), EventMap(), EventMapMarker, EventMapProps, MAP_TILES (+3 more)

### Community 73 - "event.ts"
Cohesion: 0.13
Nodes (12): CreateEventInput, EventCompetitionSummary, EventCreatorRef, EventListResponse, EventNearby, EventSearchResult, EventStats, EventTranslation (+4 more)

### Community 75 - "competition-admin.schema.ts"
Cohesion: 0.12
Nodes (15): ApproveCompetitionInput, ApproveCompetitionParams, approveCompetitionSchema, GetOrganizerCompetitionsQuery, getOrganizerCompetitionsSchema, GetPendingCompetitionsQuery, getPendingCompetitionsSchema, GetStatsQuery (+7 more)

### Community 76 - "migrate-uploads-to-spaces.js"
Cohesion: 0.18
Nodes (14): convertUrl(), DRY_RUN, fileExistsOnSpaces(), fs, getAllFiles(), main(), MIME_TYPES, path (+6 more)

### Community 77 - "DashboardNav.tsx"
Cohesion: 0.22
Nodes (9): DashboardLayout(), DashboardLayoutProps, OrganizerLayout(), CollapsibleUserInfo(), CollapsibleUserInfoProps, DashboardNav(), NavItem, navItems (+1 more)

### Community 78 - "WeatherCard.tsx"
Cohesion: 0.14
Nodes (18): EditEditionPage(), EditEditionPageProps, EditionDetailTabs(), EditionDetailTabsProps, TODO: Get from API, TabKey, WeatherCardProps, WeatherDetailProps (+10 more)

### Community 79 - "SpecialSeries"
Cohesion: 0.13
Nodes (13): abbreviate(), colorFor(), HEADER_COLORS, SpecialSeriesCard(), SpecialSeriesCardProps, SpecialSeriesGrid(), SpecialSeriesGridProps, SpecialSeriesService (+5 more)

### Community 80 - "user-competition.schema.ts"
Cohesion: 0.13
Nodes (14): AddResultInput, addResultSchema, competitionIdParamSchema, GetMyCompetitionsQuery, getMyCompetitionsSchema, GetUserCompetitionsParams, getUserCompetitionsSchema, GlobalRankingParams (+6 more)

### Community 82 - "page.tsx"
Cohesion: 0.39
Nodes (7): base64UrlDecodeToString(), base64UrlToUint8Array(), EdgeTokenPayload, verifyJwtEdge(), config, intlMiddleware, middleware()

### Community 83 - "userEdition.schema.ts"
Cohesion: 0.17
Nodes (9): ParticipationsPage(), editionIdParamSchema, participationIdParamSchema, SearchEditionsQuery, searchEditionsSchema, UserEditionInput, userEditionSchema, UserEditionResult (+1 more)

### Community 84 - "EventManagersPanel.tsx"
Cohesion: 0.09
Nodes (22): COMPETITION_TYPES, COUNTRIES, FilterState, SORT_OPTIONS, CompetitionGridSkeleton(), EventManagersPanel(), EventManagersPanelProps, GenerateTranslationsButton() (+14 more)

### Community 85 - "catalogs.service.ts"
Cohesion: 0.08
Nodes (24): CompetitionCard(), CompetitionCardCompactProps, CompetitionCardProps, COUNTRY_FLAGS, COMPETITION_TYPES, CompetitionFilters(), CompetitionFiltersProps, COUNTRIES (+16 more)

### Community 86 - "admin.schema.ts"
Cohesion: 0.14
Nodes (13): DeleteUserInput, deleteUserSchema, getStatsSchema, GetUserByIdInput, getUserByIdSchema, GetUsersInput, getUsersSchema, GetUserStatsInput (+5 more)

### Community 87 - "CountrySelect.tsx"
Cohesion: 0.39
Nodes (5): CountrySelect(), CountrySelectProps, COUNTRIES, Country, searchCountries()

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
Cohesion: 0.32
Nodes (6): CompetitionCardProps, CompetitionList(), CompetitionListCompact(), CompetitionListCompactProps, CompetitionListProps, useCompetitions()

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

### Community 101 - "SEOService"
Cohesion: 0.11
Nodes (7): FAQItem, SEOFaqSchema(), SEOFaqSchemaProps, GenerateSEOInput, SEOConfig, SEOService, UpsertConfigInput

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
Cohesion: 0.15
Nodes (11): AddPointsData, CreateCustomerData, CustomerAttributes, CustomerLinks, CustomerResponse, OmniwalletConfig, TransactionAttributes, TransactionResponse (+3 more)

### Community 108 - "DirectoryMapClient.tsx"
Cohesion: 0.29
Nodes (7): DirectoryFilters, DirectoryMapClient(), ItemType, MAP_TILES, MapMode, spreadOverlappingMarkers(), terrainTypesService

### Community 109 - "ServiceCategoriesService"
Cohesion: 0.15
Nodes (7): PromotionCategoriesPage(), ServiceCategoriesAdminPage(), CreateServiceCategoryInput, ServiceCategoriesService, ServiceCategory, ServiceCategoryWithCount, UpdateServiceCategoryInput

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

### Community 118 - "CatalogService"
Cohesion: 0.38
Nodes (4): EventCardProps, EventStatusBadge(), EventStatusBadgeProps, EventWithCounts

### Community 119 - "EventManagerService"
Cohesion: 0.22
Nodes (3): AddManagerInput, EventManagerService, EventManagerWithUser

### Community 121 - "client.ts"
Cohesion: 0.52
Nodes (6): ENCODING_FIXES, fixEncoding(), fixString(), normalizeUnicode(), parseJsonWithEncoding(), stripBOM()

### Community 125 - "export-local.ts"
Cohesion: 0.67
Nodes (3): exportAll(), getCoordinates(), prisma

### Community 127 - "useUserCompetitions"
Cohesion: 0.43
Nodes (5): MyRegistrationsPage(), CompetitionActions(), CompetitionActionsProps, useCompetitionStatus(), useUserCompetitions()

### Community 137 - "axios"
Cohesion: 0.18
Nodes (11): axios, bcryptjs, dependencies, axios, bcryptjs, @radix-ui/react-switch, sharp, tailwind-merge (+3 more)

## Knowledge Gaps
- **708 isolated node(s):** `EventMap`, `DashboardLayoutProps`, `SiteConfig`, `FONT_OPTIONS`, `BORDER_RADIUS_OPTIONS` (+703 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **78 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `apiClientV2` connect `apiClientV2` to `admin.service.ts`, `useAuth`, `index.ts`, `user.service.ts`, `edition.ts`, `competition.ts`, `rating.ts`, `page.tsx`, `promotion.ts`, `HomeService`, `Language`, `index.ts`, `organizers.service.ts`, `events.service.ts`, `page.tsx`, `ZancadasBalance.tsx`, `home.ts`, `email-templates.service.ts`, `EventForm.tsx`, `Event`, `services.service.ts`, `WeatherCard.tsx`, `SpecialSeries`, `catalogs.service.ts`, `photos.service.ts`, `types.ts`, `eventManagers.service.ts`, `SEOService`, `ServiceCategoriesService`?**
  _High betweenness centrality (0.246) - this node is a cross-community bridge._
- **What connects `EventMap`, `DashboardLayoutProps`, `SiteConfig` to the rest of the system?**
  _717 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `apiSuccess` be split into smaller, more focused modules?**
  _Cohesion score 0.051287128712871284 - nodes in this community are weakly interconnected._
- **Should `requireRole` be split into smaller, more focused modules?**
  _Cohesion score 0.03989071038251366 - nodes in this community are weakly interconnected._
- **Should `admin.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04480874316939891 - nodes in this community are weakly interconnected._
- **Should `button.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11861861861861862 - nodes in this community are weakly interconnected._
- **Should `requireAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.07896575821104122 - nodes in this community are weakly interconnected._