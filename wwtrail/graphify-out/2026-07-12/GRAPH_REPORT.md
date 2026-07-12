# Graph Report - wwtrail  (2026-07-12)

## Corpus Check
- 558 files · ~276,370 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3099 nodes · 7377 edges · 192 communities (109 shown, 83 thin omitted)
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
- useSlugValidation.ts
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
- MapBlock.tsx
- bcryptjs
- eslint-config-next

## God Nodes (most connected - your core abstractions)
1. `apiError` - 414 edges
2. `apiSuccess()` - 405 edges
3. `requireRole()` - 257 edges
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
- `OrganizerCompetitionsPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/competitions/page.tsx → hooks/useAuth.ts
- `OrganizerEditionsPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/editions/page.tsx → hooks/useAuth.ts
- `NewEventPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/events/new/page.tsx → contexts/AuthContext.tsx
- `MyEventsPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/events/page.tsx → hooks/useAuth.ts

## Import Cycles
- None detected.

## Communities (192 total, 83 thin omitted)

### Community 0 - "apiSuccess"
Cohesion: 0.05
Nodes (44): loginSchema, POST(), GET(), POST(), POST(), registerSchema, POST(), GET() (+36 more)

### Community 1 - "requireRole"
Cohesion: 0.04
Nodes (33): adminService, GET(), adminService, GET(), adminService, GET(), PUT(), adminService (+25 more)

### Community 2 - "admin.service.ts"
Cohesion: 0.05
Nodes (40): FilterRow(), getOperatorsForType(), OPERATOR_LABELS, ENTITY_OPTIONS, EXAMPLE_JSON, FullImportResult, ImportData, ImportResult (+32 more)

### Community 3 - "button.tsx"
Cohesion: 0.06
Nodes (41): EditEditionPage(), EditionDetailTabs(), EditionDetailTabsProps, TODO: Get from API, TabKey, PodiumCardProps, PodiumPositionProps, PodiumFormProps (+33 more)

### Community 4 - "requireAuth"
Cohesion: 0.15
Nodes (11): ORG_COLORS, OrganizersPublicPage(), orgColor(), orgInitials(), OrganizersService, CreateOrganizerInput, Organizer, OrganizerFilters (+3 more)

### Community 6 - "useAuth"
Cohesion: 0.05
Nodes (40): LoginPage(), RegisterPage(), DashboardPage(), NewLandingPage(), PromotionsAnalyticsPage(), PromotionCategoriesPage(), EditPromotionPage(), NewPromotionPage() (+32 more)

### Community 7 - "homeConfiguration.schema.ts"
Cohesion: 0.10
Nodes (26): FooterAdminPage(), InsiderConfig, InsiderStats, EditLandingPage(), LandingsAdminPage(), SEOConfigPage(), GroupedSEO, SEOManagementPage() (+18 more)

### Community 8 - "page.tsx"
Cohesion: 0.09
Nodes (34): AdminUsersPage(), ROLE_OPTIONS, CategoryType, initialFormData, ParticipationFormData, ParticipationStatus, AddParticipationButtonProps, CategoryType (+26 more)

### Community 9 - "index.ts"
Cohesion: 0.10
Nodes (18): EventManagersPanelProps, Badge(), BadgeProps, badgeVariants, SelectContent, SelectItem, SelectLabel, SelectScrollDownButton (+10 more)

### Community 10 - "layout.tsx"
Cohesion: 0.14
Nodes (16): Skeleton(), ZancadasBalance(), ZancadasBalanceProps, ACTION_ICONS, ACTION_LABELS, ZancadasHistory(), ZancadasHistoryProps, UserParticipation (+8 more)

### Community 11 - "user.service.ts"
Cohesion: 0.08
Nodes (22): NewEventPage(), FileUpload(), FileUploadProps, CompetitionForm(), EventForm(), EventFormProps, ImageAssignment, ImageImportSelector() (+14 more)

### Community 12 - "edition.ts"
Cohesion: 0.12
Nodes (28): EditEditionPageProps, EditionCardProps, EditionsGridProps, EditionBackendResponse, editionsService, CompetitionWithEvent, EditionStatus, PaginatedCompetitionsResponse (+20 more)

### Community 14 - "page.tsx"
Cohesion: 0.14
Nodes (16): POST(), POST(), competitionSchema, editionSchema, extractGraph(), graphSchema, ImportGraphResult, resolveOrganizerId() (+8 more)

### Community 15 - "import.service.ts"
Cohesion: 0.11
Nodes (21): FullImport, FullImportResult, fullImportSchema, ImportCompetition, importCompetitionSchema, ImportEvent, importEventSchema, ImportOrganizer (+13 more)

### Community 16 - "EventService"
Cohesion: 0.07
Nodes (17): GET(), GET(), POST(), PATCH(), POST(), DELETE(), GET(), PUT() (+9 more)

### Community 17 - "post.ts"
Cohesion: 0.06
Nodes (29): CompetitionCard(), CompetitionCardCompactProps, CompetitionCardProps, COUNTRY_FLAGS, CompetitionFilters(), FilterState, CompetitionGrid(), CompetitionGridProps (+21 more)

### Community 18 - "event.service.ts"
Cohesion: 0.13
Nodes (20): GET(), prisma, CreateEventInput, EventFilters, UpdateEventInput, CreatePostInput, PostFilters, UpdatePostInput (+12 more)

### Community 20 - "CompetitionService"
Cohesion: 0.06
Nodes (33): POST(), POST(), autoFixEncoding(), fixCatalogEncoding(), fixCorruptedFaqs(), GET(), POST(), GET() (+25 more)

### Community 21 - "rating.ts"
Cohesion: 0.25
Nodes (11): catalogsService, competitionTypesService, specialSeriesService, CatalogType, CompetitionType, CreateCatalogDTO, CreateSpecialSeriesDTO, SpecialSeries (+3 more)

### Community 22 - "page.tsx"
Cohesion: 0.16
Nodes (8): GET(), POST(), DELETE(), GET(), PUT(), GET(), POST(), EditionPodiumService

### Community 23 - "page.tsx"
Cohesion: 0.06
Nodes (37): InsidersAdminPage(), INSIDER_COLORS, insiderColor(), InsiderData, insiderInitials(), InsidersPage(), ParticipationCard(), profileInitials() (+29 more)

### Community 24 - "promotion.ts"
Cohesion: 0.13
Nodes (17): PromotionsService, AddCodesResponse, AddCouponCodesInput, CouponAnalyticsResponse, CouponCode, CouponRedemption, CouponRedemptionResponse, CouponStats (+9 more)

### Community 25 - "compilerOptions"
Cohesion: 0.07
Nodes (28): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+20 more)

### Community 26 - "ImportService"
Cohesion: 0.07
Nodes (37): DELETE(), PATCH(), GET(), POST(), GET(), POST(), GET(), POST() (+29 more)

### Community 27 - "HomeService"
Cohesion: 0.11
Nodes (14): DirectoryFilters, DirectoryMapClient(), ItemType, MAP_TILES, MapMode, spreadOverlappingMarkers(), OrganizerCompetitionsPage(), OrganizerEditionsPage() (+6 more)

### Community 28 - "generateUniqueSlug"
Cohesion: 0.10
Nodes (18): cache, memoryCache, CreateOrganizerInput, OrganizerFilters, UpdateOrganizerInput, CreatePromotionInput, PromotionFilters, RedeemCouponInput (+10 more)

### Community 29 - "Language"
Cohesion: 0.18
Nodes (13): CompetitionCardProps, CompetitionList(), CompetitionListCompact(), CompetitionListCompactProps, CompetitionListProps, CompetitionFormProps, EditionFormProps, UseCompetitionResult (+5 more)

### Community 30 - "use-toast.ts"
Cohesion: 0.12
Nodes (22): Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle, toastVariants (+14 more)

### Community 31 - "user.service.ts"
Cohesion: 0.11
Nodes (15): ChangePasswordInput, changePasswordSchema, GetPublicUsersQuery, getPublicUsersSchema, GetUsersQuery, getUsersSchema, UpdateUserInput, updateUserSchema (+7 more)

### Community 32 - "EditionService"
Cohesion: 0.10
Nodes (12): POST(), GET(), POST(), GET(), DELETE(), GET(), PUT(), GET() (+4 more)

### Community 33 - "catalog.service.ts"
Cohesion: 0.13
Nodes (14): CreateCatalogInput, createCatalogSchema, CreateSpecialSeriesInput, createSpecialSeriesSchema, GetCatalogQuery, getCatalogQuerySchema, UpdateCatalogInput, updateCatalogSchema (+6 more)

### Community 34 - "PromotionForm.tsx"
Cohesion: 0.16
Nodes (10): EditEventPage(), EditOrganizerPage(), OrganizersListPage(), OrganizerDashboard(), SpecialSeriesListPage(), OrganizerForm(), OrganizerFormProps, SpecialSeriesForm() (+2 more)

### Community 35 - "index.ts"
Cohesion: 0.13
Nodes (13): ALL_LANGUAGES, PageProps, LandingFormProps, LANGUAGES, CreateLandingInput, GetLandingsParams, GetLandingsResponse, Landing (+5 more)

### Community 36 - "organizers.service.ts"
Cohesion: 0.26
Nodes (13): classifyImage(), decodeEntities(), extractImages(), fetchContent(), FetchedContent, fetchRendered(), fetchStatic(), htmlToText() (+5 more)

### Community 37 - "events.service.ts"
Cohesion: 0.09
Nodes (9): EventDetailPage(), getMonthName(), FAQItem, SEOFaqSchema(), SEOFaqSchemaProps, GenerateSEOInput, SEOConfig, SEOService (+1 more)

### Community 39 - "ZancadasBalance.tsx"
Cohesion: 0.09
Nodes (43): EventMap, ExportStats, COLUMNS, LANGUAGES, ACTION_ICONS, ACTION_LABELS, PARTICIPATION_STATUSES, ENTITY_CONFIGS (+35 more)

### Community 40 - "errors.ts"
Cohesion: 0.14
Nodes (10): prisma, EditionWeather, AppError, BadRequestError, ConflictError, ForbiddenError, InternalServerError, NotFoundError (+2 more)

### Community 41 - "EditionPodiumService"
Cohesion: 0.19
Nodes (8): AgendaRow(), CalEdition, CalView, editionHref(), effDistance(), effElevation(), MONTHS_ES, MonthView()

### Community 43 - "home.ts"
Cohesion: 0.20
Nodes (12): DELETE(), BORDER_RADIUS_OPTIONS, FONT_OPTIONS, SHADOW_OPTIONS, SiteConfig, SiteConfigPage(), ThemePresetService, BUILTIN_PRESETS (+4 more)

### Community 44 - "user-competitions.service.ts"
Cohesion: 0.14
Nodes (10): UserStatsCards(), useUserStats(), userCompetitionsService, AddResultData, MarkCompetitionData, RankingEntry, UpdateUserCompetitionData, UserCompetition (+2 more)

### Community 46 - "email-templates.service.ts"
Cohesion: 0.18
Nodes (11): EmailTemplatesPage(), EmailTemplatesService, CreateEmailTemplateInput, EMAIL_TEMPLATE_TYPES, EmailTemplate, EmailTemplatePreviewResponse, EmailTemplateResponse, EmailTemplatesResponse (+3 more)

### Community 48 - "event.schema.ts"
Cohesion: 0.10
Nodes (19): CreateEventInput, createEventSchema, eventIdSchema, EventsByCountryParams, EventsByCountryQuery, eventsByCountrySchema, eventSlugSchema, FeaturedEventsQuery (+11 more)

### Community 49 - "index.ts"
Cohesion: 0.31
Nodes (9): importService, POST(), NativeImportOptions, ENCODING_FIXES, fixEncoding(), fixString(), normalizeUnicode(), parseJsonWithEncoding() (+1 more)

### Community 50 - "ai-autofill.service.ts"
Cohesion: 0.08
Nodes (29): DELETE(), ALLOWED_CONTENT_TYPES, POST(), ALLOWED_TYPES, POST(), ALLOWED_TYPES, POST(), GET() (+21 more)

### Community 51 - "OrganizerService"
Cohesion: 0.12
Nodes (10): GET(), POST(), POST(), DELETE(), GET(), PUT(), GET(), POST() (+2 more)

### Community 52 - "page.tsx"
Cohesion: 0.29
Nodes (7): DRY, main(), prisma, repairValue(), Rule, RULES, TEXT_KEYS

### Community 53 - "page.tsx"
Cohesion: 0.08
Nodes (20): EventsService, CreateEventData, CreateEventInput, EventCompetitionSummary, EventCreatorRef, EventFilters, EventListResponse, EventNearby (+12 more)

### Community 54 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 55 - "HomeBlockRenderer.tsx"
Cohesion: 0.08
Nodes (19): Competition, Edition, EventNode, FetchMode, Graph, MatchInfo, ScanResult, ScraperPage() (+11 more)

### Community 56 - "useAuth.ts"
Cohesion: 0.16
Nodes (12): MyEventsPage(), ViewMode, BulkActionsBar(), BulkActionsBarProps, COUNTRY_FLAGS, EventCard(), EventCardProps, MONTHS (+4 more)

### Community 57 - "bulk-edit.service.ts"
Cohesion: 0.15
Nodes (10): BulkEditEntityType, BulkEditFilters, BulkEditOperation, BulkEditPreview, BulkEditResult, BulkEditService, EntityMetadata, FieldMetadata (+2 more)

### Community 58 - "SEOService"
Cohesion: 0.15
Nodes (4): getOpenAIKey(), getOpenAIKey(), SEOService, getOpenAIKey()

### Community 59 - "useAuth"
Cohesion: 0.25
Nodes (6): CountrySelect(), CountrySelectProps, EventFiltersProps, COUNTRIES, Country, searchCountries()

### Community 61 - "EventForm.tsx"
Cohesion: 0.42
Nodes (10): annotateExisting(), bigrams(), dice(), distSim(), jaccard(), nameSim(), norm(), pct() (+2 more)

### Community 62 - "editionRating.schema.ts"
Cohesion: 0.09
Nodes (19): GET(), POST(), GET(), DELETE(), GET(), PUT(), GET(), GET() (+11 more)

### Community 65 - "PromotionService"
Cohesion: 0.13
Nodes (10): GET(), POST(), POST(), DELETE(), GET(), PUT(), GET(), POST() (+2 more)

### Community 66 - "CompetitionActions.tsx"
Cohesion: 0.15
Nodes (17): CompetitionActionsProps, LanguageSelector(), Navbar(), DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem (+9 more)

### Community 67 - "Event"
Cohesion: 0.27
Nodes (5): EditCompetitionPageProps, GenerateTranslationsButton(), GenerateTranslationsButtonProps, TranslationStatus, TranslatableEntityType

### Community 68 - "services.service.ts"
Cohesion: 0.13
Nodes (14): OrganizerServicesPage(), COUNTRY_FLAGS, ServiceCard(), ServiceCardProps, ServicesService, CategoriesResponse, CreateServiceInput, Service (+6 more)

### Community 69 - "LandingService"
Cohesion: 0.15
Nodes (9): CreateLandingInput, createLandingSchema, GetLandingsQuery, getLandingsSchema, TranslateLandingInput, translateLandingSchema, UpdateLandingInput, updateLandingSchema (+1 more)

### Community 70 - "route.ts"
Cohesion: 0.12
Nodes (11): ForgotPasswordInput, forgotPasswordSchema, LoginInput, loginSchema, RefreshTokenInput, refreshTokenSchema, RegisterInput, registerSchema (+3 more)

### Community 71 - "EmailTemplateService"
Cohesion: 0.21
Nodes (3): GET(), EmailService, EmailTemplateService

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
Cohesion: 0.16
Nodes (8): ParticipationsPage(), editionIdParamSchema, participationIdParamSchema, SearchEditionsQuery, searchEditionsSchema, UserEditionInput, userEditionSchema, UserEditionService

### Community 78 - "page.tsx"
Cohesion: 0.27
Nodes (12): POST(), autoFillCompetition(), autoFillEvent(), classifyImage(), CompetitionAutoFillResult, EventAutoFillResult, extractImagesFromHtml(), fetchPageContent() (+4 more)

### Community 80 - "user-competition.schema.ts"
Cohesion: 0.13
Nodes (14): AddResultInput, addResultSchema, competitionIdParamSchema, GetMyCompetitionsQuery, getMyCompetitionsSchema, GetUserCompetitionsParams, getUserCompetitionsSchema, GlobalRankingParams (+6 more)

### Community 82 - "page.tsx"
Cohesion: 0.39
Nodes (7): base64UrlDecodeToString(), base64UrlToUint8Array(), EdgeTokenPayload, verifyJwtEdge(), config, intlMiddleware, middleware()

### Community 83 - "userEdition.schema.ts"
Cohesion: 0.11
Nodes (24): CompetitionDetailPage(), CompetitionDetailPage(), OrganizerDetailPage(), EditionCard(), EditionSelector(), EditionSelectorCompact(), EditionSelectorProps, EventGallery() (+16 more)

### Community 84 - "User"
Cohesion: 0.36
Nodes (6): CreatePodiumInput, createPodiumSchema, UpdateChronicleInput, updateChronicleSchema, UpdatePodiumInput, updatePodiumSchema

### Community 85 - "catalogs.service.ts"
Cohesion: 0.17
Nodes (15): s3Client, convertUrl(), DRY_RUN, fileExistsOnSpaces(), fs, getAllFiles(), main(), MIME_TYPES (+7 more)

### Community 86 - "admin.schema.ts"
Cohesion: 0.14
Nodes (13): DeleteUserInput, deleteUserSchema, getStatsSchema, GetUserByIdInput, getUserByIdSchema, GetUsersInput, getUsersSchema, GetUserStatsInput (+5 more)

### Community 87 - "CatalogService"
Cohesion: 0.53
Nodes (5): AuthContext, AuthProvider(), log(), logError(), logWarn()

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

### Community 93 - "ServiceCategoriesService"
Cohesion: 0.16
Nodes (7): DELETE(), GET(), PUT(), GET(), POST(), GET(), ServiceCategoryService

### Community 94 - ".deleteAllImportedData"
Cohesion: 0.15
Nodes (14): DashboardLayout(), DashboardLayoutProps, OrganizerLayout(), CollapsibleUserInfo(), CollapsibleUserInfoProps, DashboardNav(), NavItem, navItems (+6 more)

### Community 96 - "edition.schema.ts"
Cohesion: 0.17
Nodes (11): competitionIdSchema, CreateBulkEditionsInput, createBulkEditionsSchema, CreateEditionInput, createEditionSchema, EditionByYearParams, editionByYearSchema, editionIdSchema (+3 more)

### Community 97 - "translation.schema.ts"
Cohesion: 0.17
Nodes (11): AutoTranslateInput, autoTranslateSchema, CreateTranslationInput, createTranslationSchema, GetTranslationsQuery, getTranslationsSchema, translationIdSchema, UpdateTranslationInput (+3 more)

### Community 98 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, db:export, db:fix-home-encoding, db:import, dev, lint, prisma:generate (+5 more)

### Community 100 - "PostsService"
Cohesion: 0.33
Nodes (5): UpdateActionInput, UpdateConfigInput, ZancadasAction, ZancadasConfig, ZancadasStats

### Community 102 - "competition.schema.ts"
Cohesion: 0.20
Nodes (9): competitionIdSchema, competitionSlugSchema, CreateCompetitionInput, createCompetitionSchema, eventIdSchema, ReorderCompetitionsInput, reorderCompetitionsSchema, UpdateCompetitionInput (+1 more)

### Community 103 - "result.schema.ts"
Cohesion: 0.20
Nodes (9): CreateResultInput, createResultSchema, GetResultsQuery, getResultsSchema, ImportResultsInput, importResultsSchema, resultIdSchema, UpdateResultInput (+1 more)

### Community 104 - "uuid"
Cohesion: 0.50
Nodes (4): MyRegistrationsPage(), CompetitionActions(), useCompetitionStatus(), useUserCompetitions()

### Community 106 - "review.schema.ts"
Cohesion: 0.22
Nodes (8): CreateReviewInput, createReviewSchema, GetReviewsParams, GetReviewsQuery, getReviewsSchema, reviewIdSchema, UpdateReviewInput, updateReviewSchema

### Community 107 - "omniwallet.service.ts"
Cohesion: 0.08
Nodes (30): POST(), POST(), getEntitiesWithoutSEO(), POST(), readAccessTokenPayload(), signAccessToken(), globalForPrisma, TokenPayload (+22 more)

### Community 109 - "DirectoryMapClient.tsx"
Cohesion: 0.06
Nodes (25): EventMap, ServiceDetailPage(), AddParticipationButton(), EventCardProps, EventStatusBadge(), EventStatusBadgeProps, EditionParticipants(), EventMap() (+17 more)

### Community 110 - "participant.schema.ts"
Cohesion: 0.25
Nodes (7): CreateParticipantInput, createParticipantSchema, GetParticipantsQuery, getParticipantsSchema, participantIdSchema, UpdateParticipantInput, updateParticipantSchema

### Community 111 - "js-cookie"
Cohesion: 0.80
Nodes (4): assertSafeUrl(), isBlockedIP(), isBlockedIPv4(), isBlockedIPv6()

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

### Community 127 - "LayoutWrapper.tsx"
Cohesion: 0.14
Nodes (13): archivo, barlow, metadata, BACKOFFICE_ROUTES, LayoutWrapper(), LayoutWrapperProps, NO_FOOTER_ROUTES, IntlProvider() (+5 more)

### Community 131 - "@types/node"
Cohesion: 0.08
Nodes (26): MagazineCategoryPage(), OrganizerPostsPage(), ArticleCard(), ArticleCardProps, ArticleGrid(), ArticleGridProps, PostsBlock(), PostsBlockProps (+18 more)

### Community 138 - "EventSelect.tsx"
Cohesion: 0.13
Nodes (12): PATCH(), DELETE(), GET(), PUT(), GET(), GET(), POST(), GET() (+4 more)

### Community 140 - "clsx"
Cohesion: 0.18
Nodes (11): js-cookie, jsonwebtoken, dependencies, js-cookie, jsonwebtoken, @radix-ui/react-tabs, @tiptap/react, uuid (+3 more)

### Community 143 - "eslint-config-next"
Cohesion: 0.03
Nodes (81): POST(), POST(), POST(), GET(), POST(), POST(), GET(), GET() (+73 more)

### Community 185 - "footer.service.ts"
Cohesion: 0.29
Nodes (6): COMMUNITY, EXPLORE, Footer(), FOOTER_EXCLUDED_ROUTES, FooterLink, SOCIAL

### Community 195 - "MapBlock.tsx"
Cohesion: 0.06
Nodes (48): BlockConfigModal(), BlockConfigModalProps, HeroConfigForm(), HeroConfigFormProps, CompetitionsBlock(), CompetitionsBlockProps, EditionsBlock(), EditionsBlockProps (+40 more)

## Knowledge Gaps
- **752 isolated node(s):** `CalView`, `CalEdition`, `MONTHS_ES`, `EventMap`, `DashboardLayoutProps` (+747 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **83 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `apiClientV2` connect `HomeBlockRenderer.tsx` to `admin.service.ts`, `button.tsx`, `requireAuth`, `@types/node`, `useAuth`, `index.ts`, `layout.tsx`, `user.service.ts`, `edition.ts`, `post.ts`, `rating.ts`, `page.tsx`, `promotion.ts`, `HomeService`, `index.ts`, `events.service.ts`, `home.ts`, `email-templates.service.ts`, `page.tsx`, `MapBlock.tsx`, `services.service.ts`, `SpecialSeries`, `userEdition.schema.ts`, `photos.service.ts`, `.deleteAllImportedData`, `PostsService`, `DirectoryMapClient.tsx`?**
  _High betweenness centrality (0.275) - this node is a cross-community bridge._
- **What connects `CalView`, `CalEdition`, `MONTHS_ES` to the rest of the system?**
  _761 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `apiSuccess` be split into smaller, more focused modules?**
  _Cohesion score 0.05311676909569798 - nodes in this community are weakly interconnected._
- **Should `requireRole` be split into smaller, more focused modules?**
  _Cohesion score 0.036635006784260515 - nodes in this community are weakly interconnected._
- **Should `admin.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04576271186440678 - nodes in this community are weakly interconnected._
- **Should `button.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.056338028169014086 - nodes in this community are weakly interconnected._
- **Should `AdminService` be split into smaller, more focused modules?**
  _Cohesion score 0.038461538461538464 - nodes in this community are weakly interconnected._