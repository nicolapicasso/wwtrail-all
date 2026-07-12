# Graph Report - wwtrail  (2026-07-12)

## Corpus Check
- 503 files · ~269,035 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2945 nodes · 6717 edges · 206 communities (123 shown, 83 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `287ea803`
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
- page.tsx
- UserStatsCards.tsx
- autoprefixer
- MapBlock.tsx
- bcryptjs
- eslint-config-next
- @types/node
- WeatherService
- LayoutWrapper.tsx
- EventSelect.tsx
- accordion.tsx
- InsiderContext.tsx
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
- `OrganizerEditionsPage()` --calls--> `useAuth()`  [EXTRACTED]
  wwtrail/app/[locale]/organizer/editions/page.tsx → wwtrail/hooks/useAuth.ts
- `NewEventPage()` --calls--> `useAuth()`  [EXTRACTED]
  wwtrail/app/[locale]/organizer/events/new/page.tsx → wwtrail/contexts/AuthContext.tsx
- `MyEventsPage()` --calls--> `useAuth()`  [EXTRACTED]
  wwtrail/app/[locale]/organizer/events/page.tsx → wwtrail/hooks/useAuth.ts
- `OrganizerLayout()` --calls--> `useAuth()`  [EXTRACTED]
  wwtrail/app/[locale]/organizer/layout.tsx → wwtrail/contexts/AuthContext.tsx

## Import Cycles
- None detected.

## Communities (206 total, 83 thin omitted)

### Community 0 - "apiSuccess"
Cohesion: 0.04
Nodes (80): POST(), POST(), POST(), autoFixEncoding(), fixCatalogEncoding(), fixCorruptedFaqs(), GET(), POST() (+72 more)

### Community 1 - "requireRole"
Cohesion: 0.04
Nodes (28): adminService, GET(), adminService, GET(), adminService, GET(), adminService, GET() (+20 more)

### Community 2 - "admin.service.ts"
Cohesion: 0.04
Nodes (48): FilterRow(), getOperatorsForType(), OPERATOR_LABELS, ENTITY_OPTIONS, EXAMPLE_JSON, FullImportResult, ImportData, ImportResult (+40 more)

### Community 3 - "button.tsx"
Cohesion: 0.14
Nodes (13): RatingCardProps, RatingFormProps, RatingSummaryProps, RecentRatingsWidgetProps, StarRatingProps, ratingsService, CreateRatingDTO, EditionRating (+5 more)

### Community 4 - "requireAuth"
Cohesion: 0.14
Nodes (15): MagazineCategoryPage(), OrganizerPostsPage(), EditPromotionPage(), PromotionDetailPage(), ArticleCard(), ArticleCardProps, ArticleGrid(), ArticleGridProps (+7 more)

### Community 6 - "useAuth"
Cohesion: 0.06
Nodes (36): LoginPage(), RegisterPage(), DashboardPage(), NewLandingPage(), PromotionsAnalyticsPage(), NewPromotionPage(), Competition, Edition (+28 more)

### Community 7 - "homeConfiguration.schema.ts"
Cohesion: 0.10
Nodes (28): COLUMNS, FooterAdminPage(), LANGUAGES, InsiderConfig, InsiderStats, EditLandingPage(), LandingsAdminPage(), SEOConfigPage() (+20 more)

### Community 8 - "page.tsx"
Cohesion: 0.12
Nodes (30): AdminUsersPage(), ROLE_OPTIONS, CategoryType, initialFormData, ParticipationFormData, ParticipationStatus, AddParticipationButtonProps, CategoryType (+22 more)

### Community 9 - "index.ts"
Cohesion: 0.13
Nodes (12): CreateEventInput, EventCompetitionSummary, EventCreatorRef, EventListResponse, EventNearby, EventSearchResult, EventStats, EventTranslation (+4 more)

### Community 10 - "layout.tsx"
Cohesion: 0.15
Nodes (15): Skeleton(), ZancadasBalance(), ZancadasBalanceProps, ACTION_ICONS, ACTION_LABELS, ZancadasHistory(), ZancadasHistoryProps, CompetitionMarker (+7 more)

### Community 11 - "user.service.ts"
Cohesion: 0.19
Nodes (10): InsiderBadge(), InsiderBadgeProps, positionClasses, sizeClasses, Avatar(), AVATAR_COLORS, colorFor(), initialsOf() (+2 more)

### Community 12 - "edition.ts"
Cohesion: 0.11
Nodes (28): EditionCard(), EditionCardProps, EditionsGridProps, EditionFormProps, EditionsBlock(), EditionsBlockProps, EditionBackendResponse, EditionStatus (+20 more)

### Community 13 - "competition.ts"
Cohesion: 0.22
Nodes (11): PodiumCardProps, PodiumPositionProps, PodiumFormProps, podiumsService, CreatePodiumDTO, EditionPodium, MEDAL_EMOJIS, PODIUM_TYPE_LABELS (+3 more)

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
Cohesion: 0.15
Nodes (14): ACTION_ICONS, ACTION_LABELS, PARTICIPATION_STATUSES, AdminEditUserPage(), Badge(), BadgeProps, badgeVariants, Switch (+6 more)

### Community 23 - "page.tsx"
Cohesion: 0.14
Nodes (17): EditProfilePage(), INSIDER_COLORS, insiderColor(), InsiderData, insiderInitials(), InsidersPage(), UserList(), UserListProps (+9 more)

### Community 24 - "promotion.ts"
Cohesion: 0.13
Nodes (17): PromotionsService, AddCodesResponse, AddCouponCodesInput, CouponAnalyticsResponse, CouponCode, CouponRedemption, CouponRedemptionResponse, CouponStats (+9 more)

### Community 25 - "compilerOptions"
Cohesion: 0.07
Nodes (28): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+20 more)

### Community 26 - "ImportService"
Cohesion: 0.08
Nodes (27): ContentBlockConfig, ContentBlockConfigSchema, CreateHomeBlockInput, createHomeBlockSchema, CreateHomeConfigurationInput, createHomeConfigurationSchema, HomeBlockTypeSchema, HomeBlockViewTypeSchema (+19 more)

### Community 27 - "HomeService"
Cohesion: 0.12
Nodes (19): EditCompetitionPageProps, OrganizerEditionsPage(), CompetitionCardProps, CompetitionList(), CompetitionListCompact(), CompetitionListCompactProps, CompetitionListProps, ConfirmDialog() (+11 more)

### Community 28 - "generateUniqueSlug"
Cohesion: 0.12
Nodes (14): MyEventsPage(), ViewMode, BulkActionsBar(), BulkActionsBarProps, EventStatusBadge(), EventStatusBadgeProps, COUNTRY_FLAGS, EventCard() (+6 more)

### Community 29 - "Language"
Cohesion: 0.13
Nodes (11): PostForm(), PostFormProps, editionsService, PostsService, CreatePostInput, Post, PostFilters, PostImage (+3 more)

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
Cohesion: 0.80
Nodes (3): ImpersonationBar(), getImpersonatedName(), stopImpersonation()

### Community 35 - "index.ts"
Cohesion: 0.14
Nodes (12): ALL_LANGUAGES, PageProps, LandingFormProps, LANGUAGES, CreateLandingInput, GetLandingsParams, GetLandingsResponse, Landing (+4 more)

### Community 36 - "organizers.service.ts"
Cohesion: 0.21
Nodes (7): OrganizersService, CreateOrganizerInput, Organizer, OrganizerFilters, OrganizerListItem, UpdateOrganizerInput, PaginatedResponse

### Community 37 - "events.service.ts"
Cohesion: 0.15
Nodes (19): CompetitionDetailPage(), CompetitionDetailPage(), OrganizerDetailPage(), ServiceDetailPage(), EditionSelector(), EditionSelectorCompact(), EditionSelectorProps, EventGallery() (+11 more)

### Community 39 - "ZancadasBalance.tsx"
Cohesion: 0.12
Nodes (24): EventMap, ExportStats, ENTITY_CONFIGS, EntityConfig, EntityStats, EntityType, TranslationsDashboardPage(), TranslationStats (+16 more)

### Community 40 - "errors.ts"
Cohesion: 0.14
Nodes (10): prisma, EditionWeather, AppError, BadRequestError, ConflictError, ForbiddenError, InternalServerError, NotFoundError (+2 more)

### Community 41 - "EditionPodiumService"
Cohesion: 0.19
Nodes (8): AgendaRow(), CalEdition, CalView, editionHref(), effDistance(), effElevation(), MONTHS_ES, MonthView()

### Community 42 - "serviceCategories.service.ts"
Cohesion: 0.11
Nodes (22): loginSchema, POST(), POST(), POST(), registerSchema, POST(), GET(), POST() (+14 more)

### Community 43 - "home.ts"
Cohesion: 0.23
Nodes (11): BORDER_RADIUS_OPTIONS, FONT_OPTIONS, SHADOW_OPTIONS, SiteConfig, SiteConfigPage(), ThemePresetService, BUILTIN_PRESETS, pickThemeValues() (+3 more)

### Community 44 - "user-competitions.service.ts"
Cohesion: 0.16
Nodes (7): userCompetitionsService, AddResultData, MarkCompetitionData, RankingEntry, UpdateUserCompetitionData, UserCompetition, UserStats

### Community 45 - "apiClientV2"
Cohesion: 0.10
Nodes (19): PromotionCategoriesPage(), AdminPromotionsPage(), LandingForm(), PromotionCardProps, LANGUAGES, PromotionForm(), PromotionFormProps, RichTextEditor() (+11 more)

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
Nodes (41): GET(), DELETE(), ALLOWED_CONTENT_TYPES, POST(), ALLOWED_TYPES, POST(), ALLOWED_TYPES, POST() (+33 more)

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
Cohesion: 0.19
Nodes (14): CompetitionsBlock(), CompetitionsBlockProps, EventsBlock(), EventsBlockProps, HomeBlockRendererProps, MapBlock, LinksBlock(), PostsBlock() (+6 more)

### Community 56 - "useAuth.ts"
Cohesion: 0.19
Nodes (10): AuthContextType, AuthContextValue, AuthService, createResponseInterceptor(), AuthResponse, LoginCredentials, RefreshTokenResponse, RegisterData (+2 more)

### Community 57 - "bulk-edit.service.ts"
Cohesion: 0.15
Nodes (10): BulkEditEntityType, BulkEditFilters, BulkEditOperation, BulkEditPreview, BulkEditResult, BulkEditService, EntityMetadata, FieldMetadata (+2 more)

### Community 59 - "useAuth"
Cohesion: 0.36
Nodes (6): LanguageSelector(), Locale, localeFlags, localeNames, locales, { Link, redirect, usePathname, useRouter }

### Community 60 - "EventList.tsx"
Cohesion: 0.12
Nodes (10): EventFiltersProps, EventFilters, EventList(), EventListProps, EventListSimple(), EventListSimpleProps, PublicEventCard(), PaginationData (+2 more)

### Community 61 - "EventForm.tsx"
Cohesion: 0.20
Nodes (6): HomeService, CreateHomeBlockDTO, HomeConfiguration, UpdateFullHomeConfigDTO, UpdateHomeBlockDTO, UpdateHomeConfigurationDTO

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
Cohesion: 0.23
Nodes (10): Navbar(), DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut() (+2 more)

### Community 67 - "Event"
Cohesion: 0.18
Nodes (10): ConflictItem, ConflictResolution, EntityType, LANGUAGE_MAPPING, NativeImportFile, NativeImportOptions, NativeImportResult, NativeImportResultItem (+2 more)

### Community 68 - "services.service.ts"
Cohesion: 0.22
Nodes (8): ServicesService, CategoriesResponse, CreateServiceInput, ServiceFilters, ServiceResponse, ServicesResponse, ServiceStatus, UpdateServiceInput

### Community 69 - "LandingService"
Cohesion: 0.15
Nodes (9): CreateLandingInput, createLandingSchema, GetLandingsQuery, getLandingsSchema, TranslateLandingInput, translateLandingSchema, UpdateLandingInput, updateLandingSchema (+1 more)

### Community 70 - "route.ts"
Cohesion: 0.24
Nodes (8): DashboardLayoutProps, OrganizerLayout(), CollapsibleUserInfo(), CollapsibleUserInfoProps, DashboardNav(), NavItem, navItems, PendingContentCounts

### Community 72 - "page.tsx"
Cohesion: 0.22
Nodes (9): WeatherCardProps, WeatherDetailProps, WeatherResponse, weatherService, EditionWeather, WEATHER_COLORS, WEATHER_ICONS, WeatherCondition (+1 more)

### Community 74 - "v2.ts"
Cohesion: 0.18
Nodes (14): convertUrl(), DRY_RUN, fileExistsOnSpaces(), fs, getAllFiles(), main(), MIME_TYPES, path (+6 more)

### Community 75 - "competition-admin.schema.ts"
Cohesion: 0.12
Nodes (15): ApproveCompetitionInput, ApproveCompetitionParams, approveCompetitionSchema, GetOrganizerCompetitionsQuery, getOrganizerCompetitionsSchema, GetPendingCompetitionsQuery, getPendingCompetitionsSchema, GetStatsQuery (+7 more)

### Community 76 - "SpecialSeries"
Cohesion: 0.21
Nodes (5): SpecialSeriesService, CreateSpecialSeriesInput, SpecialSeries, SpecialSeriesFilters, UpdateSpecialSeriesInput

### Community 77 - "ContentBlockConfig"
Cohesion: 0.23
Nodes (10): ApiError, ApiResponse, AuthResponse, Competition, CompetitionFilters, LoginCredentials, PaginatedResponse, RegisterData (+2 more)

### Community 78 - "page.tsx"
Cohesion: 0.13
Nodes (13): EventMap, EventCardProps, apiClientV1, ApiResponse, EventFilters, EventResponseV1, EventsResponseV1, eventsService (+5 more)

### Community 80 - "user-competition.schema.ts"
Cohesion: 0.13
Nodes (14): AddResultInput, addResultSchema, competitionIdParamSchema, GetMyCompetitionsQuery, getMyCompetitionsSchema, GetUserCompetitionsParams, getUserCompetitionsSchema, GlobalRankingParams (+6 more)

### Community 82 - "page.tsx"
Cohesion: 0.39
Nodes (7): base64UrlDecodeToString(), base64UrlToUint8Array(), EdgeTokenPayload, verifyJwtEdge(), config, intlMiddleware, middleware()

### Community 83 - "userEdition.schema.ts"
Cohesion: 0.15
Nodes (13): EventManagersPanel(), EventManagersPanelProps, GenerateTranslationsButton(), GenerateTranslationsButtonProps, TranslationStatus, SelectContent, SelectItem, SelectLabel (+5 more)

### Community 84 - "User"
Cohesion: 0.19
Nodes (9): fetchTotal(), HeroSection(), HeroSectionProps, Stat, HomeBlockRenderer(), MapBand(), PINS, ITEMS (+1 more)

### Community 85 - "catalogs.service.ts"
Cohesion: 0.08
Nodes (24): CompetitionCard(), CompetitionCardCompactProps, CompetitionCardProps, COUNTRY_FLAGS, COMPETITION_TYPES, CompetitionFilters(), CompetitionFiltersProps, COUNTRIES (+16 more)

### Community 86 - "admin.schema.ts"
Cohesion: 0.14
Nodes (13): DeleteUserInput, deleteUserSchema, getStatsSchema, GetUserByIdInput, getUserByIdSchema, GetUsersInput, getUsersSchema, GetUserStatsInput (+5 more)

### Community 87 - "CatalogService"
Cohesion: 0.13
Nodes (8): AddParticipationButton(), EditionParticipants(), EventMap(), EventMapMarker, EventMapProps, MAP_TILES, MapMode, spreadOverlappingMarkers()

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
Cohesion: 0.18
Nodes (7): CreatePodiumInput, createPodiumSchema, UpdateChronicleInput, updateChronicleSchema, UpdatePodiumInput, updatePodiumSchema, EditionPodiumService

### Community 94 - "CatalogService"
Cohesion: 0.18
Nodes (9): FeaturedEvents(), LargeCard(), mediaUrl(), SmallCard(), EventMedia(), MONTHS_ES, PublicEventCardProps, StatChip() (+1 more)

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

### Community 101 - "EventMap.tsx"
Cohesion: 0.21
Nodes (10): InsidersAdminPage(), ParticipationCard(), profileInitials(), UserProfilePage(), UserCard(), useInsiderBadge(), PublicUserProfile, UserParticipation (+2 more)

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
Cohesion: 0.07
Nodes (34): POST(), readAccessTokenPayload(), signAccessToken(), globalForPrisma, TokenPayload, SendCouponEmailParams, CreateEmailTemplateInput, UpdateEmailTemplateInput (+26 more)

### Community 108 - "page.tsx"
Cohesion: 0.60
Nodes (4): ORG_COLORS, OrganizersPublicPage(), orgColor(), orgInitials()

### Community 109 - "DirectoryMapClient.tsx"
Cohesion: 0.29
Nodes (7): DirectoryFilters, DirectoryMapClient(), ItemType, MAP_TILES, MapMode, spreadOverlappingMarkers(), terrainTypesService

### Community 110 - "participant.schema.ts"
Cohesion: 0.25
Nodes (7): CreateParticipantInput, createParticipantSchema, GetParticipantsQuery, getParticipantsSchema, participantIdSchema, UpdateParticipantInput, updateParticipantSchema

### Community 111 - "ServiceService"
Cohesion: 0.26
Nodes (6): OrganizerServicesPage(), COUNTRY_FLAGS, ServiceCard(), ServiceCardProps, Service, ServiceCategory

### Community 112 - "EventCard.tsx"
Cohesion: 0.08
Nodes (40): POST(), autoFillCompetition(), autoFillEvent(), classifyImage(), CompetitionAutoFillResult, EventAutoFillResult, extractImagesFromHtml(), fetchPageContent() (+32 more)

### Community 113 - "events.service.ts"
Cohesion: 0.08
Nodes (11): EventDetailPage(), getMonthName(), NOTE: event favorites are not yet backed by an API (the spec marks this as, SaveEventButton(), FAQItem, SEOFaqSchema(), SEOFaqSchemaProps, GenerateSEOInput (+3 more)

### Community 114 - "useSlugValidation.ts"
Cohesion: 0.38
Nodes (5): SlugInput(), SlugInputProps, SlugValidationResult, useSlugValidation(), UseSlugValidationOptions

### Community 115 - "SpecialSeries"
Cohesion: 0.08
Nodes (16): apiClientV2, Footer, FooterContent, FooterService, AddManagerResponse, AvailableOrganizer, AvailableOrganizersResponse, EventManager (+8 more)

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

### Community 127 - "LayoutWrapper.tsx"
Cohesion: 0.20
Nodes (8): archivo, barlow, metadata, IntlProvider(), Props, SHADOW_MAP, SiteStyles, SiteStylesProvider()

### Community 131 - ".deleteAllImportedData"
Cohesion: 0.29
Nodes (8): abbreviate(), colorFor(), HEADER_COLORS, SpecialSeriesCard(), SpecialSeriesCardProps, SpecialSeriesGrid(), SpecialSeriesGridProps, SpecialSeriesListItem

### Community 136 - "SearchableEntitySelect.tsx"
Cohesion: 0.29
Nodes (9): EditEditionPage(), EditEditionPageProps, EditionDetailTabs(), EditionDetailTabsProps, TODO: Get from API, TabKey, usePodiums(), useRatings() (+1 more)

### Community 139 - "class-variance-authority"
Cohesion: 0.10
Nodes (16): cache, memoryCache, CreateOrganizerInput, OrganizerFilters, UpdateOrganizerInput, CreatePromotionInput, PromotionFilters, RedeemCouponInput (+8 more)

### Community 143 - "eslint-config-next"
Cohesion: 0.05
Nodes (39): GET(), POST(), toSpacesCdn(), POST(), adminService, GET(), PUT(), POST() (+31 more)

### Community 162 - "@types/node"
Cohesion: 0.25
Nodes (6): COMPETITION_TYPES, COUNTRIES, FilterState, SORT_OPTIONS, CompetitionGridSkeleton(), competitionsService

### Community 165 - ".approveContent"
Cohesion: 0.08
Nodes (23): OrganizerCompetitionsPage(), EditEventPage(), NewEventPage(), EditOrganizerPage(), OrganizersListPage(), OrganizerDashboard(), SpecialSeriesListPage(), CountrySelect() (+15 more)

### Community 174 - "@types/nodemailer"
Cohesion: 0.32
Nodes (5): GET(), POST(), GET(), POST(), PUT()

### Community 183 - "CompetitionActions.tsx"
Cohesion: 0.36
Nodes (6): MyRegistrationsPage(), CompetitionActions(), CompetitionActionsProps, useCompetitionStatus(), useUserCompetitions(), UserCompetitionStatus

### Community 185 - "footer.service.ts"
Cohesion: 0.29
Nodes (6): COMMUNITY, EXPLORE, Footer(), FOOTER_EXCLUDED_ROUTES, FooterLink, SOCIAL

### Community 191 - "MapBlock.tsx"
Cohesion: 0.40
Nodes (4): MAP_TILES, MapBlockProps, MapBlockConfig, MapMode

### Community 195 - "MapBlock.tsx"
Cohesion: 0.18
Nodes (15): BlockConfigModal(), BlockConfigModalProps, HeroConfigForm(), HeroConfigFormProps, LinksBlockProps, TextBlockProps, BlockConfig, HomeBlock (+7 more)

### Community 201 - "LayoutWrapper.tsx"
Cohesion: 0.60
Nodes (4): BACKOFFICE_ROUTES, LayoutWrapper(), LayoutWrapperProps, NO_FOOTER_ROUTES

### Community 203 - "accordion.tsx"
Cohesion: 0.50
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

### Community 204 - "InsiderContext.tsx"
Cohesion: 0.50
Nodes (3): InsiderContext, InsiderContextValue, InsiderProvider()

### Community 205 - "react"
Cohesion: 0.67
Nodes (3): DashboardLayout(), react, react

## Knowledge Gaps
- **735 isolated node(s):** `CalView`, `CalEdition`, `MONTHS_ES`, `EventMap`, `DashboardLayoutProps` (+730 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **83 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `apiClientV2` connect `SpecialSeries` to `admin.service.ts`, `button.tsx`, `useAuth`, `layout.tsx`, `edition.ts`, `competition.ts`, `rating.ts`, `page.tsx`, `promotion.ts`, `HomeService`, `Language`, `PromotionForm.tsx`, `index.ts`, `organizers.service.ts`, `events.service.ts`, `home.ts`, `apiClientV2`, `email-templates.service.ts`, `index.ts`, `page.tsx`, `EventForm.tsx`, `services.service.ts`, `page.tsx`, `ContentBlockConfig`, `page.tsx`, `catalogs.service.ts`, `photos.service.ts`, `events.service.ts`?**
  _High betweenness centrality (0.243) - this node is a cross-community bridge._
- **What connects `CalView`, `CalEdition`, `MONTHS_ES` to the rest of the system?**
  _744 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `apiSuccess` be split into smaller, more focused modules?**
  _Cohesion score 0.04242424242424243 - nodes in this community are weakly interconnected._
- **Should `requireRole` be split into smaller, more focused modules?**
  _Cohesion score 0.03989071038251366 - nodes in this community are weakly interconnected._
- **Should `admin.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.03822937625754527 - nodes in this community are weakly interconnected._
- **Should `button.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14039408866995073 - nodes in this community are weakly interconnected._
- **Should `requireAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.13756613756613756 - nodes in this community are weakly interconnected._