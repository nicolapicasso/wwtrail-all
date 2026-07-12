# Graph Report - wwtrail  (2026-07-12)

## Corpus Check
- 508 files · ~271,991 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2973 nodes · 6816 edges · 191 communities (118 shown, 73 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `eebda4e6`
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
- SearchableEntitySelect.tsx
- DirectoryMapClient.tsx
- participant.schema.ts
- js-cookie
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
- @types/node
- favorites.schema.ts
- next.config.js
- types.ts
- EventSelect.tsx
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
- page.tsx
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
- footer.service.ts
- tailwind.config.ts
- apiClient
- cacheService
- page.tsx
- MapBlock.tsx
- bcryptjs
- eslint-config-next

## God Nodes (most connected - your core abstractions)
1. `apiSuccess()` - 301 edges
2. `apiError` - 300 edges
3. `requireRole()` - 185 edges
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

## Communities (191 total, 73 thin omitted)

### Community 0 - "apiSuccess"
Cohesion: 0.05
Nodes (73): POST(), GET(), autoFixEncoding(), fixCatalogEncoding(), fixCorruptedFaqs(), GET(), POST(), GET() (+65 more)

### Community 1 - "requireRole"
Cohesion: 0.04
Nodes (28): adminService, GET(), adminService, GET(), adminService, GET(), adminService, GET() (+20 more)

### Community 2 - "admin.service.ts"
Cohesion: 0.08
Nodes (27): FilterRow(), getOperatorsForType(), OPERATOR_LABELS, EventApprovalQueueProps, AdminStats, BulkEditEntityType, BulkEditFilters, BulkEditOperation (+19 more)

### Community 3 - "button.tsx"
Cohesion: 0.06
Nodes (41): EditEditionPage(), EditionDetailTabs(), EditionDetailTabsProps, TODO: Get from API, TabKey, PodiumCardProps, PodiumPositionProps, PodiumFormProps (+33 more)

### Community 4 - "requireAuth"
Cohesion: 0.07
Nodes (28): MagazineCategoryPage(), NewEventPage(), OrganizerPostsPage(), ArticleCard(), ArticleCardProps, ArticleGrid(), ArticleGridProps, ServiceForm() (+20 more)

### Community 6 - "useAuth"
Cohesion: 0.06
Nodes (40): LoginPage(), RegisterPage(), DashboardPage(), NewLandingPage(), PromotionsAnalyticsPage(), EditPromotionPage(), NewPromotionPage(), ServiceCategoriesAdminPage() (+32 more)

### Community 7 - "homeConfiguration.schema.ts"
Cohesion: 0.11
Nodes (18): GroupedSEO, AccordionContent, AccordionItem, AccordionTrigger, Badge(), BadgeProps, badgeVariants, Table (+10 more)

### Community 8 - "page.tsx"
Cohesion: 0.11
Nodes (32): AdminUsersPage(), ROLE_OPTIONS, CategoryType, initialFormData, ParticipationFormData, ParticipationStatus, AddParticipationButton(), AddParticipationButtonProps (+24 more)

### Community 9 - "index.ts"
Cohesion: 0.09
Nodes (17): ENTITY_OPTIONS, EXAMPLE_JSON, FullImportResult, ImportData, ImportResult, ImportStats, NativeImportTab(), SelectContent (+9 more)

### Community 10 - "layout.tsx"
Cohesion: 0.11
Nodes (20): ProfilePage(), FavoriteButton(), FavoriteButtonProps, Skeleton(), ZancadasBalance(), ZancadasBalanceProps, ACTION_ICONS, ACTION_LABELS (+12 more)

### Community 11 - "user.service.ts"
Cohesion: 0.40
Nodes (3): POST(), ScraperService, ScrapedGraph

### Community 12 - "edition.ts"
Cohesion: 0.06
Nodes (49): EditCompetitionPageProps, OrganizerCompetitionsPage(), EditEditionPageProps, OrganizerEditionsPage(), CompetitionCardProps, CompetitionList(), CompetitionListCompact(), CompetitionListCompactProps (+41 more)

### Community 13 - "competition.ts"
Cohesion: 0.12
Nodes (15): cache, memoryCache, CreatePromotionInput, PromotionFilters, RedeemCouponInput, UpdatePromotionInput, CreateServiceCategoryInput, UpdateServiceCategoryInput (+7 more)

### Community 14 - "page.tsx"
Cohesion: 0.07
Nodes (46): POST(), POST(), autoFillCompetition(), autoFillEvent(), classifyImage(), CompetitionAutoFillResult, EventAutoFillResult, extractImagesFromHtml() (+38 more)

### Community 15 - "import.service.ts"
Cohesion: 0.17
Nodes (12): FullImport, FullImportResult, fullImportSchema, ImportCompetition, importCompetitionSchema, ImportEvent, importEventSchema, ImportOrganizer (+4 more)

### Community 16 - "EventService"
Cohesion: 0.15
Nodes (3): GET(), POST(), EventService

### Community 17 - "post.ts"
Cohesion: 0.12
Nodes (11): ForgotPasswordInput, forgotPasswordSchema, LoginInput, loginSchema, RefreshTokenInput, refreshTokenSchema, RegisterInput, registerSchema (+3 more)

### Community 18 - "event.service.ts"
Cohesion: 0.13
Nodes (22): prisma, CreateEventInput, EventFilters, UpdateEventInput, CreatePostInput, PostFilters, UpdatePostInput, GenerateSEOInput (+14 more)

### Community 20 - "CompetitionService"
Cohesion: 0.12
Nodes (10): POST(), POST(), DELETE(), GET(), PATCH(), PUT(), GET(), POST() (+2 more)

### Community 21 - "rating.ts"
Cohesion: 0.14
Nodes (13): CompetitionCard(), CompetitionCardCompactProps, CompetitionCardProps, COUNTRY_FLAGS, COMPETITION_TYPES, CompetitionFilters(), CompetitionFiltersProps, COUNTRIES (+5 more)

### Community 23 - "page.tsx"
Cohesion: 0.07
Nodes (36): InsidersAdminPage(), INSIDER_COLORS, insiderColor(), InsiderData, insiderInitials(), InsidersPage(), ParticipationCard(), profileInitials() (+28 more)

### Community 24 - "promotion.ts"
Cohesion: 0.13
Nodes (17): PromotionsService, AddCodesResponse, AddCouponCodesInput, CouponAnalyticsResponse, CouponCode, CouponRedemption, CouponRedemptionResponse, CouponStats (+9 more)

### Community 25 - "compilerOptions"
Cohesion: 0.07
Nodes (28): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+20 more)

### Community 26 - "ImportService"
Cohesion: 0.07
Nodes (34): PATCH(), GET(), POST(), GET(), POST(), PUT(), ContentBlockConfig, ContentBlockConfigSchema (+26 more)

### Community 27 - "HomeService"
Cohesion: 0.29
Nodes (7): DirectoryFilters, DirectoryMapClient(), ItemType, MAP_TILES, MapMode, spreadOverlappingMarkers(), terrainTypesService

### Community 28 - "generateUniqueSlug"
Cohesion: 0.16
Nodes (12): MyEventsPage(), ViewMode, BulkActionsBar(), BulkActionsBarProps, COUNTRY_FLAGS, EventCard(), EventCardProps, MONTHS (+4 more)

### Community 29 - "Language"
Cohesion: 0.20
Nodes (9): FeaturedEvents(), LargeCard(), mediaUrl(), SmallCard(), Result, ResultType, SearchResultsHero(), toArray() (+1 more)

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

### Community 35 - "index.ts"
Cohesion: 0.09
Nodes (17): FooterAdminPage(), ALL_LANGUAGES, EditLandingPage(), LandingsAdminPage(), SEOConfigPage(), SEOManagementPage(), PageProps, LandingForm() (+9 more)

### Community 36 - "organizers.service.ts"
Cohesion: 0.15
Nodes (10): ORG_COLORS, OrganizersPublicPage(), orgColor(), orgInitials(), OrganizersService, CreateOrganizerInput, Organizer, OrganizerFilters (+2 more)

### Community 37 - "events.service.ts"
Cohesion: 0.18
Nodes (14): CompetitionDetailPage(), EventMap, OrganizerDetailPage(), EventMap, ServiceDetailPage(), EventGallery(), EventGalleryProps, OrganizerCard() (+6 more)

### Community 39 - "ZancadasBalance.tsx"
Cohesion: 0.10
Nodes (37): ExportStats, COLUMNS, LANGUAGES, InsiderConfig, InsiderStats, ACTION_ICONS, ACTION_LABELS, PARTICIPATION_STATUSES (+29 more)

### Community 40 - "errors.ts"
Cohesion: 0.05
Nodes (22): PUT(), GET(), POST(), CreatePodiumInput, createPodiumSchema, UpdateChronicleInput, updateChronicleSchema, UpdatePodiumInput (+14 more)

### Community 41 - "EditionPodiumService"
Cohesion: 0.19
Nodes (8): AgendaRow(), CalEdition, CalView, editionHref(), effDistance(), effElevation(), MONTHS_ES, MonthView()

### Community 42 - "serviceCategories.service.ts"
Cohesion: 0.12
Nodes (22): loginSchema, POST(), POST(), POST(), registerSchema, POST(), POST(), POST() (+14 more)

### Community 43 - "home.ts"
Cohesion: 0.20
Nodes (12): DELETE(), BORDER_RADIUS_OPTIONS, FONT_OPTIONS, SHADOW_OPTIONS, SiteConfig, SiteConfigPage(), ThemePresetService, BUILTIN_PRESETS (+4 more)

### Community 44 - "user-competitions.service.ts"
Cohesion: 0.14
Nodes (10): UserStatsCards(), useUserStats(), userCompetitionsService, AddResultData, MarkCompetitionData, RankingEntry, UpdateUserCompetitionData, UserCompetition (+2 more)

### Community 45 - "apiClientV2"
Cohesion: 0.14
Nodes (14): CompetitionForm(), EventForm(), EventFormProps, ImageAssignment, ImageImportSelector(), ImageRole, Props, ROLE_COLORS (+6 more)

### Community 46 - "email-templates.service.ts"
Cohesion: 0.18
Nodes (11): EmailTemplatesPage(), EmailTemplatesService, CreateEmailTemplateInput, EMAIL_TEMPLATE_TYPES, EmailTemplate, EmailTemplatePreviewResponse, EmailTemplateResponse, EmailTemplatesResponse (+3 more)

### Community 47 - "auth.schema.ts"
Cohesion: 0.18
Nodes (7): editionIdParamSchema, participationIdParamSchema, SearchEditionsQuery, searchEditionsSchema, UserEditionInput, userEditionSchema, UserEditionService

### Community 48 - "event.schema.ts"
Cohesion: 0.10
Nodes (19): CreateEventInput, createEventSchema, eventIdSchema, EventsByCountryParams, EventsByCountryQuery, eventsByCountrySchema, eventSlugSchema, FeaturedEventsQuery (+11 more)

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
Cohesion: 0.16
Nodes (8): EventsService, CreateEventData, EventFilters, EventResponse, EventsResponse, EventStatsResponse, RejectEventData, UpdateEventData

### Community 54 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 55 - "HomeBlockRenderer.tsx"
Cohesion: 0.17
Nodes (9): Competition, Edition, EventNode, FetchMode, Graph, MatchInfo, ScanResult, ScraperPage() (+1 more)

### Community 56 - "useAuth.ts"
Cohesion: 0.17
Nodes (12): CreateEventInput, EventCompetitionSummary, EventCreatorRef, EventListResponse, EventNearby, EventSearchResult, EventStats, EventTranslation (+4 more)

### Community 57 - "bulk-edit.service.ts"
Cohesion: 0.15
Nodes (10): BulkEditEntityType, BulkEditFilters, BulkEditOperation, BulkEditPreview, BulkEditResult, BulkEditService, EntityMetadata, FieldMetadata (+2 more)

### Community 58 - "SEOService"
Cohesion: 0.16
Nodes (3): getOpenAIKey(), SEOService, getOpenAIKey()

### Community 59 - "useAuth"
Cohesion: 0.20
Nodes (5): EventDetailPage(), getMonthName(), AdminEditButton(), AdminEditButtonFloating(), AdminEditButtonProps

### Community 60 - "EventList.tsx"
Cohesion: 0.13
Nodes (9): EventFiltersProps, EventFilters, EventList(), EventListProps, EventListSimple(), EventListSimpleProps, PaginationData, useEvents() (+1 more)

### Community 61 - "EventForm.tsx"
Cohesion: 0.17
Nodes (7): AddManagerResponse, AvailableOrganizer, AvailableOrganizersResponse, EventManager, EventManagersService, ManagersResponse, RemoveManagerResponse

### Community 62 - "editionRating.schema.ts"
Cohesion: 0.13
Nodes (11): POST(), CreateEditionRatingInput, createEditionRatingSchema, GetRatingsQuery, getRatingsQuerySchema, GetRecentRatingsQuery, getRecentRatingsSchema, ratingSchema (+3 more)

### Community 63 - "ExportService"
Cohesion: 0.24
Nodes (3): ExportOptions, ExportResult, ExportService

### Community 65 - "PromotionService"
Cohesion: 0.15
Nodes (8): GET(), DELETE(), GET(), PUT(), GET(), POST(), GET(), PromotionService

### Community 66 - "CompetitionActions.tsx"
Cohesion: 0.16
Nodes (15): LanguageSelector(), Navbar(), DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuShortcut() (+7 more)

### Community 67 - "Event"
Cohesion: 0.20
Nodes (9): ConflictItem, ConflictResolution, EntityType, LANGUAGE_MAPPING, NativeImportFile, NativeImportResult, NativeImportResultItem, TERRAIN_MAPPING (+1 more)

### Community 68 - "services.service.ts"
Cohesion: 0.12
Nodes (15): OrganizerServicesPage(), ServicesBlock(), COUNTRY_FLAGS, ServiceCard(), ServiceCardProps, ServicesService, CategoriesResponse, CreateServiceInput (+7 more)

### Community 69 - "LandingService"
Cohesion: 0.15
Nodes (9): CreateLandingInput, createLandingSchema, GetLandingsQuery, getLandingsSchema, TranslateLandingInput, translateLandingSchema, UpdateLandingInput, updateLandingSchema (+1 more)

### Community 70 - "route.ts"
Cohesion: 0.33
Nodes (6): OrganizerLayout(), CollapsibleUserInfo(), CollapsibleUserInfoProps, ImpersonationBar(), getImpersonatedName(), stopImpersonation()

### Community 71 - "EmailTemplateService"
Cohesion: 0.19
Nodes (3): GET(), EmailService, EmailTemplateService

### Community 72 - "page.tsx"
Cohesion: 0.20
Nodes (8): EventsBlock(), EventsBlockProps, EventMedia(), MONTHS_ES, PublicEventCard(), PublicEventCardProps, StatChip(), StatChipProps

### Community 74 - "v2.ts"
Cohesion: 0.20
Nodes (3): EditionParticipants(), RelatedArticles(), RelatedArticlesProps

### Community 75 - "competition-admin.schema.ts"
Cohesion: 0.12
Nodes (15): ApproveCompetitionInput, ApproveCompetitionParams, approveCompetitionSchema, GetOrganizerCompetitionsQuery, getOrganizerCompetitionsSchema, GetPendingCompetitionsQuery, getPendingCompetitionsSchema, GetStatsQuery (+7 more)

### Community 76 - "SpecialSeries"
Cohesion: 0.08
Nodes (24): abbreviate(), colorFor(), HEADER_COLORS, SpecialSeriesCard(), SpecialSeriesCardProps, SpecialSeriesGrid(), SpecialSeriesGridProps, apiClientV2 (+16 more)

### Community 77 - "ContentBlockConfig"
Cohesion: 0.22
Nodes (8): AddPointsData, CreateCustomerData, CustomerAttributes, CustomerLinks, CustomerResponse, OmniwalletConfig, TransactionAttributes, TransactionResponse

### Community 78 - "page.tsx"
Cohesion: 0.16
Nodes (9): EventCardProps, EventStatusBadge(), EventStatusBadgeProps, EventResponseV1, EventsResponseV1, Event, EventDetail, EventWithCounts (+1 more)

### Community 80 - "user-competition.schema.ts"
Cohesion: 0.13
Nodes (14): AddResultInput, addResultSchema, competitionIdParamSchema, GetMyCompetitionsQuery, getMyCompetitionsSchema, GetUserCompetitionsParams, getUserCompetitionsSchema, GlobalRankingParams (+6 more)

### Community 82 - "page.tsx"
Cohesion: 0.39
Nodes (7): base64UrlDecodeToString(), base64UrlToUint8Array(), EdgeTokenPayload, verifyJwtEdge(), config, intlMiddleware, middleware()

### Community 83 - "userEdition.schema.ts"
Cohesion: 0.36
Nodes (6): MyRegistrationsPage(), CompetitionActions(), CompetitionActionsProps, DropdownMenuSeparator, useCompetitionStatus(), useUserCompetitions()

### Community 84 - "User"
Cohesion: 0.17
Nodes (15): s3Client, convertUrl(), DRY_RUN, fileExistsOnSpaces(), fs, getAllFiles(), main(), MIME_TYPES (+7 more)

### Community 85 - "catalogs.service.ts"
Cohesion: 0.17
Nodes (11): CatalogService, catalogsService, competitionTypesService, CatalogType, CompetitionType, CreateCatalogDTO, CreateSpecialSeriesDTO, SpecialSeries (+3 more)

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
Nodes (13): autoprefixer, devDependencies, autoprefixer, @types/js-cookie, @types/nodemailer, @types/react, @types/uuid, typescript (+5 more)

### Community 90 - "error-handler.ts"
Cohesion: 0.17
Nodes (5): ApiError, ApiResponse, Language, LANGUAGE_NAMES, LANGUAGES

### Community 91 - "competition-admin.service.ts"
Cohesion: 0.17
Nodes (6): CompetitionAdminService, GetOrganizerOptions, GetPendingOptions, PaginatedCompetitions, TODO: Enviar notificación al organizador, TODO: Enviar notificación al organizador con razón

### Community 92 - "CountrySelect.tsx"
Cohesion: 0.32
Nodes (4): roles, UserEditModalProps, UserTableProps, User

### Community 93 - "ServiceCategoriesService"
Cohesion: 0.18
Nodes (6): DELETE(), GET(), PUT(), GET(), POST(), ServiceCategoryService

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
Nodes (11): @aws-sdk/client-s3, axios, dependencies, @aws-sdk/client-s3, axios, @radix-ui/react-switch, sharp, tailwind-merge (+3 more)

### Community 101 - "EventMap.tsx"
Cohesion: 0.07
Nodes (22): PromotionCategoriesPage(), AdminPromotionsPage(), FileUpload(), FileUploadProps, PromotionCardProps, LANGUAGES, PromotionForm(), PromotionFormProps (+14 more)

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
Nodes (25): globalForPrisma, TokenPayload, SendCouponEmailParams, CreateEmailTemplateInput, DEFAULT_TEMPLATES, UpdateEmailTemplateInput, AddManagerInput, EventManagerWithUser (+17 more)

### Community 110 - "participant.schema.ts"
Cohesion: 0.25
Nodes (7): CreateParticipantInput, createParticipantSchema, GetParticipantsQuery, getParticipantsSchema, participantIdSchema, UpdateParticipantInput, updateParticipantSchema

### Community 113 - "events.service.ts"
Cohesion: 0.11
Nodes (7): FAQItem, SEOFaqSchema(), SEOFaqSchemaProps, GenerateSEOInput, SEOConfig, SEOService, UpsertConfigInput

### Community 114 - "useSlugValidation.ts"
Cohesion: 0.38
Nodes (5): SlugInput(), SlugInputProps, SlugValidationResult, useSlugValidation(), UseSlugValidationOptions

### Community 115 - "SpecialSeries"
Cohesion: 0.25
Nodes (5): apiClientV1, createResponseInterceptor(), ApiResponse, EventFilters, PaginationData

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

### Community 127 - "LayoutWrapper.tsx"
Cohesion: 0.15
Nodes (11): archivo, barlow, metadata, IntlProvider(), Props, SHADOW_MAP, SiteStyles, SiteStylesProvider() (+3 more)

### Community 137 - "types.ts"
Cohesion: 0.23
Nodes (10): ApiError, ApiResponse, AuthResponse, Competition, CompetitionFilters, LoginCredentials, PaginatedResponse, RegisterData (+2 more)

### Community 138 - "EventSelect.tsx"
Cohesion: 0.26
Nodes (5): GET(), PUT(), resolveOrganizerId(), ServiceService, generateUniqueSlug()

### Community 143 - "eslint-config-next"
Cohesion: 0.05
Nodes (37): GET(), POST(), toSpacesCdn(), adminService, GET(), PUT(), GET(), POST() (+29 more)

### Community 157 - "page.tsx"
Cohesion: 0.38
Nodes (8): CompetitionDetailPage(), EditionSelector(), EditionSelectorCompact(), EditionSelectorProps, useCompetition(), useAvailableYears(), useEditionByYear(), useEditions()

### Community 163 - "page.tsx"
Cohesion: 0.29
Nodes (5): getCountryName(), ROLE_LABELS, StatsPage(), STATUS_LABELS, TYPE_LABELS

### Community 165 - ".approveContent"
Cohesion: 0.07
Nodes (29): DashboardLayout(), DashboardLayoutProps, EditEventPage(), EditOrganizerPage(), OrganizersListPage(), OrganizerDashboard(), SpecialSeriesListPage(), CountrySelect() (+21 more)

### Community 185 - "footer.service.ts"
Cohesion: 0.19
Nodes (10): COMMUNITY, EXPLORE, Footer(), FOOTER_EXCLUDED_ROUTES, FooterLink, SOCIAL, BACKOFFICE_ROUTES, LayoutWrapper() (+2 more)

### Community 191 - "page.tsx"
Cohesion: 0.22
Nodes (6): COMPETITION_TYPES, COUNTRIES, FilterState, SORT_OPTIONS, CompetitionGridSkeleton(), competitionsService

### Community 195 - "MapBlock.tsx"
Cohesion: 0.06
Nodes (46): BlockConfigModal(), BlockConfigModalProps, HeroConfigForm(), HeroConfigFormProps, CompetitionsBlock(), CompetitionsBlockProps, EditionsBlock(), EditionsBlockProps (+38 more)

## Knowledge Gaps
- **740 isolated node(s):** `CalView`, `CalEdition`, `MONTHS_ES`, `EventMap`, `DashboardLayoutProps` (+735 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **73 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `apiClientV2` connect `SpecialSeries` to `admin.service.ts`, `button.tsx`, `types.ts`, `layout.tsx`, `edition.ts`, `page.tsx`, `promotion.ts`, `page.tsx`, `index.ts`, `ZancadasBalance.tsx`, `home.ts`, `apiClientV2`, `email-templates.service.ts`, `page.tsx`, `HomeBlockRenderer.tsx`, `EventForm.tsx`, `MapBlock.tsx`, `services.service.ts`, `route.ts`, `catalogs.service.ts`, `photos.service.ts`, `EventMap.tsx`, `events.service.ts`, `SpecialSeries`?**
  _High betweenness centrality (0.252) - this node is a cross-community bridge._
- **What connects `CalView`, `CalEdition`, `MONTHS_ES` to the rest of the system?**
  _749 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `apiSuccess` be split into smaller, more focused modules?**
  _Cohesion score 0.046476761619190406 - nodes in this community are weakly interconnected._
- **Should `requireRole` be split into smaller, more focused modules?**
  _Cohesion score 0.03989071038251366 - nodes in this community are weakly interconnected._
- **Should `admin.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0784313725490196 - nodes in this community are weakly interconnected._
- **Should `button.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.056338028169014086 - nodes in this community are weakly interconnected._
- **Should `requireAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.06558441558441558 - nodes in this community are weakly interconnected._