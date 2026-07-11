# Graph Report - wwtrail  (2026-07-11)

## Corpus Check
- 496 files · ~266,660 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2914 nodes · 6610 edges · 200 communities (121 shown, 79 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `60b2516e`
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
- SpecialSeriesService
- route.ts
- review.schema.ts
- omniwallet.service.ts
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
- UserStatsCards.tsx
- @radix-ui/react-toast
- react-dom
- react-hook-form
- autoprefixer
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
- uuid
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
- page.tsx
- tailwind.config.ts
- apiClient
- cacheService
- fetcher.ts
- page.tsx
- User
- ServiceCategoriesService
- MapBlock.tsx
- CatalogService
- extractor.ts
- EventApprovalQueue.tsx
- @aws-sdk/client-s3

## God Nodes (most connected - your core abstractions)
1. `apiSuccess()` - 280 edges
2. `apiError` - 279 edges
3. `requireRole()` - 168 edges
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
- `MyEventsPage()` --calls--> `useAuth()`  [EXTRACTED]
  wwtrail/app/[locale]/organizer/events/page.tsx → wwtrail/hooks/useAuth.ts
- `OrganizerLayout()` --calls--> `useAuth()`  [EXTRACTED]
  wwtrail/app/[locale]/organizer/layout.tsx → wwtrail/contexts/AuthContext.tsx
- `EditPromotionPage()` --calls--> `useAuth()`  [EXTRACTED]
  wwtrail/app/[locale]/organizer/promotions/[id]/page.tsx → wwtrail/contexts/AuthContext.tsx

## Import Cycles
- None detected.

## Communities (200 total, 79 thin omitted)

### Community 0 - "apiSuccess"
Cohesion: 0.05
Nodes (68): POST(), GET(), autoFixEncoding(), fixCatalogEncoding(), fixCorruptedFaqs(), GET(), POST(), GET() (+60 more)

### Community 1 - "requireRole"
Cohesion: 0.04
Nodes (27): adminService, GET(), adminService, GET(), adminService, GET(), adminService, GET() (+19 more)

### Community 2 - "admin.service.ts"
Cohesion: 0.09
Nodes (24): FilterRow(), getOperatorsForType(), OPERATOR_LABELS, AdminStats, BulkEditEntityType, BulkEditFilters, BulkEditOperation, BulkEditPreview (+16 more)

### Community 3 - "button.tsx"
Cohesion: 0.15
Nodes (12): COMPETITION_TYPES, COUNTRIES, FilterState, SORT_OPTIONS, CompetitionCard(), CompetitionCardCompactProps, CompetitionCardProps, COUNTRY_FLAGS (+4 more)

### Community 4 - "requireAuth"
Cohesion: 0.11
Nodes (16): MagazineCategoryPage(), EditPromotionPage(), ArticleCard(), ArticleCardProps, ArticleGrid(), ArticleGridProps, RelatedArticlesProps, MyStats (+8 more)

### Community 6 - "useAuth"
Cohesion: 0.07
Nodes (35): LoginPage(), RegisterPage(), DashboardPage(), NewEventPage(), NewLandingPage(), OrganizerPostsPage(), PromotionsAnalyticsPage(), NewPromotionPage() (+27 more)

### Community 7 - "homeConfiguration.schema.ts"
Cohesion: 0.09
Nodes (23): COLUMNS, LANGUAGES, InsiderConfig, InsiderStats, GroupedSEO, AccordionContent, AccordionItem, AccordionTrigger (+15 more)

### Community 8 - "page.tsx"
Cohesion: 0.14
Nodes (26): AdminUsersPage(), ROLE_OPTIONS, CategoryType, initialFormData, ParticipationFormData, ParticipationStatus, AddParticipationButtonProps, CategoryType (+18 more)

### Community 9 - "index.ts"
Cohesion: 0.06
Nodes (33): POST(), POST(), GET(), POST(), toSpacesCdn(), adminService, GET(), PUT() (+25 more)

### Community 10 - "layout.tsx"
Cohesion: 0.09
Nodes (23): getCountryName(), ROLE_LABELS, StatsPage(), STATUS_LABELS, TYPE_LABELS, INSIDER_COLORS, insiderColor(), InsiderData (+15 more)

### Community 11 - "user.service.ts"
Cohesion: 0.05
Nodes (40): archivo, barlow, metadata, InsidersAdminPage(), ParticipationCard(), profileInitials(), UserProfilePage(), InsiderBadge() (+32 more)

### Community 12 - "edition.ts"
Cohesion: 0.10
Nodes (36): EditionCard(), EditionCardProps, EditionsGridProps, CompetitionFormProps, EditionFormProps, EditionsBlock(), EditionsBlockProps, EditionBackendResponse (+28 more)

### Community 13 - "competition.ts"
Cohesion: 0.24
Nodes (8): CompetitionCardProps, CompetitionList(), CompetitionListCompact(), CompetitionListCompactProps, CompetitionListProps, UseCompetitionResult, useCompetitions(), UseCompetitionsResult

### Community 14 - "page.tsx"
Cohesion: 0.12
Nodes (18): DELETE(), PATCH(), POST(), GET(), POST(), POST(), GET(), POST() (+10 more)

### Community 15 - "import.service.ts"
Cohesion: 0.17
Nodes (12): FullImport, FullImportResult, fullImportSchema, ImportCompetition, importCompetitionSchema, ImportEvent, importEventSchema, ImportOrganizer (+4 more)

### Community 16 - "EventService"
Cohesion: 0.10
Nodes (9): DELETE(), GET(), PUT(), GET(), GET(), GET(), POST(), GET() (+1 more)

### Community 17 - "post.ts"
Cohesion: 0.12
Nodes (11): ForgotPasswordInput, forgotPasswordSchema, LoginInput, loginSchema, RefreshTokenInput, refreshTokenSchema, RegisterInput, registerSchema (+3 more)

### Community 18 - "event.service.ts"
Cohesion: 0.11
Nodes (26): prisma, CreateEventInput, EventFilters, UpdateEventInput, CreatePostInput, PostFilters, UpdatePostInput, CreatePromotionInput (+18 more)

### Community 21 - "rating.ts"
Cohesion: 0.06
Nodes (42): EditEditionPage(), EditEditionPageProps, EditionDetailTabs(), EditionDetailTabsProps, TODO: Get from API, TabKey, PodiumCardProps, PodiumPositionProps (+34 more)

### Community 23 - "page.tsx"
Cohesion: 0.10
Nodes (16): OrganizerEditionsPage(), EditEventPage(), EditOrganizerPage(), OrganizersListPage(), OrganizerDashboard(), SpecialSeriesListPage(), OrganizerForm(), OrganizerFormProps (+8 more)

### Community 24 - "promotion.ts"
Cohesion: 0.13
Nodes (17): PromotionsService, AddCodesResponse, AddCouponCodesInput, CouponAnalyticsResponse, CouponCode, CouponRedemption, CouponRedemptionResponse, CouponStats (+9 more)

### Community 25 - "compilerOptions"
Cohesion: 0.07
Nodes (28): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+20 more)

### Community 26 - "ImportService"
Cohesion: 0.16
Nodes (16): loginSchema, POST(), POST(), POST(), registerSchema, POST(), GET(), AuthUser (+8 more)

### Community 27 - "HomeService"
Cohesion: 0.13
Nodes (12): BlockConfigModal(), BlockConfigModalProps, HeroConfigForm(), HeroConfigFormProps, HomeService, CreateHomeBlockDTO, HomeBlock, HomeBlockType (+4 more)

### Community 28 - "generateUniqueSlug"
Cohesion: 0.14
Nodes (14): MyEventsPage(), ViewMode, BulkActionsBar(), BulkActionsBarProps, EventStatusBadge(), EventStatusBadgeProps, COUNTRY_FLAGS, EventCard() (+6 more)

### Community 29 - "Language"
Cohesion: 0.09
Nodes (22): PromotionCategoriesPage(), AdminPromotionsPage(), FileUpload(), FileUploadProps, LandingForm(), PromotionCardProps, LANGUAGES, PromotionForm() (+14 more)

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
Cohesion: 0.27
Nodes (12): POST(), autoFillCompetition(), autoFillEvent(), classifyImage(), CompetitionAutoFillResult, EventAutoFillResult, extractImagesFromHtml(), fetchPageContent() (+4 more)

### Community 35 - "index.ts"
Cohesion: 0.09
Nodes (18): FooterAdminPage(), ALL_LANGUAGES, EditLandingPage(), LandingsAdminPage(), SEOConfigPage(), SEOManagementPage(), PageProps, LandingFormProps (+10 more)

### Community 36 - "organizers.service.ts"
Cohesion: 0.22
Nodes (6): OrganizersService, CreateOrganizerInput, Organizer, OrganizerFilters, OrganizerListItem, UpdateOrganizerInput

### Community 37 - "events.service.ts"
Cohesion: 0.19
Nodes (12): CompetitionDetailPage(), OrganizerDetailPage(), EventMap, ServiceDetailPage(), EventGallery(), EventGalleryProps, ServiceForm(), OrganizerCard() (+4 more)

### Community 39 - "ZancadasBalance.tsx"
Cohesion: 0.11
Nodes (21): ProfilePage(), Badge(), BadgeProps, badgeVariants, Skeleton(), ZancadasBalance(), ZancadasBalanceProps, ACTION_ICONS (+13 more)

### Community 40 - "errors.ts"
Cohesion: 0.05
Nodes (22): PUT(), GET(), POST(), CreatePodiumInput, createPodiumSchema, UpdateChronicleInput, updateChronicleSchema, UpdatePodiumInput (+14 more)

### Community 41 - "EditionPodiumService"
Cohesion: 0.19
Nodes (8): AgendaRow(), CalEdition, CalView, editionHref(), effDistance(), effElevation(), MONTHS_ES, MonthView()

### Community 42 - "serviceCategories.service.ts"
Cohesion: 0.12
Nodes (17): EventCardProps, CreateEventInput, Event, EventCompetitionSummary, EventCreatorRef, EventDetail, EventListResponse, EventNearby (+9 more)

### Community 43 - "home.ts"
Cohesion: 0.23
Nodes (11): BORDER_RADIUS_OPTIONS, FONT_OPTIONS, SHADOW_OPTIONS, SiteConfig, SiteConfigPage(), ThemePresetService, BUILTIN_PRESETS, pickThemeValues() (+3 more)

### Community 44 - "user-competitions.service.ts"
Cohesion: 0.16
Nodes (8): userCompetitionsService, AddResultData, MarkCompetitionData, RankingEntry, UpdateUserCompetitionData, UserCompetition, UserCompetitionStatus, UserStats

### Community 45 - "apiClientV2"
Cohesion: 0.17
Nodes (7): AddManagerResponse, AvailableOrganizer, AvailableOrganizersResponse, EventManager, EventManagersService, ManagersResponse, RemoveManagerResponse

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
Cohesion: 0.14
Nodes (14): CompetitionForm(), EventForm(), EventFormProps, ImageAssignment, ImageImportSelector(), ImageRole, Props, ROLE_COLORS (+6 more)

### Community 50 - "ai-autofill.service.ts"
Cohesion: 0.10
Nodes (24): DELETE(), ALLOWED_CONTENT_TYPES, POST(), ALLOWED_TYPES, POST(), ALLOWED_TYPES, POST(), DELETE() (+16 more)

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
Cohesion: 0.18
Nodes (14): convertUrl(), DRY_RUN, fileExistsOnSpaces(), fs, getAllFiles(), main(), MIME_TYPES, path (+6 more)

### Community 56 - "useAuth.ts"
Cohesion: 0.20
Nodes (9): AuthContextType, AuthContextValue, AuthService, AuthResponse, LoginCredentials, RefreshTokenResponse, RegisterData, User (+1 more)

### Community 57 - "bulk-edit.service.ts"
Cohesion: 0.15
Nodes (10): BulkEditEntityType, BulkEditFilters, BulkEditOperation, BulkEditPreview, BulkEditResult, BulkEditService, EntityMetadata, FieldMetadata (+2 more)

### Community 59 - "useAuth"
Cohesion: 0.17
Nodes (10): ORG_COLORS, OrganizersPublicPage(), orgColor(), orgInitials(), CountrySelect(), CountrySelectProps, EventFiltersProps, COUNTRIES (+2 more)

### Community 60 - "EventList.tsx"
Cohesion: 0.16
Nodes (8): EventFilters, EventList(), EventListProps, EventListSimple(), EventListSimpleProps, PaginationData, useEvents(), UseEventsResult

### Community 61 - "EventForm.tsx"
Cohesion: 0.09
Nodes (17): ENTITY_OPTIONS, EXAMPLE_JSON, FullImportResult, ImportData, ImportResult, ImportStats, NativeImportTab(), SelectContent (+9 more)

### Community 62 - "editionRating.schema.ts"
Cohesion: 0.14
Nodes (10): CreateEditionRatingInput, createEditionRatingSchema, GetRatingsQuery, getRatingsQuerySchema, GetRecentRatingsQuery, getRecentRatingsSchema, ratingSchema, UpdateEditionRatingInput (+2 more)

### Community 63 - "ExportService"
Cohesion: 0.24
Nodes (3): ExportOptions, ExportResult, ExportService

### Community 64 - "TranslationService"
Cohesion: 0.17
Nodes (3): GET(), POST(), TranslationService

### Community 65 - "PromotionService"
Cohesion: 0.18
Nodes (7): DELETE(), GET(), PUT(), GET(), POST(), GET(), PromotionService

### Community 66 - "CompetitionActions.tsx"
Cohesion: 0.18
Nodes (16): CompetitionActions(), CompetitionActionsProps, LanguageSelector(), Button, ButtonProps, buttonVariants, DropdownMenuCheckboxItem, DropdownMenuContent (+8 more)

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
Cohesion: 0.11
Nodes (31): EventMap, ExportStats, ACTION_ICONS, ACTION_LABELS, PARTICIPATION_STATUSES, TODO: Implement actual API call to change password, EditionParticipantsProps, Participant (+23 more)

### Community 72 - "page.tsx"
Cohesion: 0.33
Nodes (6): EventMap(), EventMapMarker, EventMapProps, MAP_TILES, MapMode, spreadOverlappingMarkers()

### Community 74 - "v2.ts"
Cohesion: 0.15
Nodes (8): PostForm(), PostFormProps, PostsService, CreatePostInput, Post, PostFilters, UpdatePostInput, ApiResponse

### Community 75 - "competition-admin.schema.ts"
Cohesion: 0.12
Nodes (15): ApproveCompetitionInput, ApproveCompetitionParams, approveCompetitionSchema, GetOrganizerCompetitionsQuery, getOrganizerCompetitionsSchema, GetPendingCompetitionsQuery, getPendingCompetitionsSchema, GetStatsQuery (+7 more)

### Community 76 - "SpecialSeries"
Cohesion: 0.13
Nodes (14): abbreviate(), colorFor(), HEADER_COLORS, SpecialSeriesCard(), SpecialSeriesCardProps, SpecialSeriesGrid(), SpecialSeriesGridProps, SpecialSeriesService (+6 more)

### Community 77 - "ContentBlockConfig"
Cohesion: 0.12
Nodes (9): AddParticipationButton(), EditionParticipants(), RelatedArticles(), ApiResponse, EventFilters, EventResponseV1, EventsResponseV1, eventsService (+1 more)

### Community 78 - "Service"
Cohesion: 0.13
Nodes (24): CompetitionsBlock(), CompetitionsBlockProps, EventsBlock(), EventsBlockProps, HomeBlockRendererProps, MapBlock, LinksBlock(), LinksBlockProps (+16 more)

### Community 79 - "SpecialSeries"
Cohesion: 0.26
Nodes (6): OrganizerServicesPage(), COUNTRY_FLAGS, ServiceCard(), ServiceCardProps, Service, ServiceCategory

### Community 80 - "user-competition.schema.ts"
Cohesion: 0.13
Nodes (14): AddResultInput, addResultSchema, competitionIdParamSchema, GetMyCompetitionsQuery, getMyCompetitionsSchema, GetUserCompetitionsParams, getUserCompetitionsSchema, GlobalRankingParams (+6 more)

### Community 82 - "page.tsx"
Cohesion: 0.39
Nodes (7): base64UrlDecodeToString(), base64UrlToUint8Array(), EdgeTokenPayload, verifyJwtEdge(), config, intlMiddleware, middleware()

### Community 83 - "userEdition.schema.ts"
Cohesion: 0.16
Nodes (8): apiClientV2, Footer, FooterContent, FooterService, BulkTranslationResponse, EntityStats, TranslationResponse, TranslationStatsResponse

### Community 84 - "EventManagersPanel.tsx"
Cohesion: 0.38
Nodes (8): CompetitionDetailPage(), EditionSelector(), EditionSelectorCompact(), EditionSelectorProps, useCompetition(), useAvailableYears(), useEditionByYear(), useEditions()

### Community 85 - "catalogs.service.ts"
Cohesion: 0.16
Nodes (17): COMPETITION_TYPES, CompetitionFilters(), CompetitionFiltersProps, COUNTRIES, FilterState, SORT_OPTIONS, catalogsService, competitionTypesService (+9 more)

### Community 86 - "admin.schema.ts"
Cohesion: 0.14
Nodes (13): DeleteUserInput, deleteUserSchema, getStatsSchema, GetUserByIdInput, getUserByIdSchema, GetUsersInput, getUsersSchema, GetUserStatsInput (+5 more)

### Community 87 - "CatalogService"
Cohesion: 0.13
Nodes (10): EventDetailPage(), getMonthName(), AdminEditButton(), AdminEditButtonFloating(), AdminEditButtonProps, NOTE: event favorites are not yet backed by an API (the spec marks this as, SaveEventButton(), FAQItem (+2 more)

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

### Community 92 - "FeaturedEvents.tsx"
Cohesion: 0.18
Nodes (9): FeaturedEvents(), LargeCard(), mediaUrl(), SmallCard(), EventMedia(), MONTHS_ES, PublicEventCardProps, StatChip() (+1 more)

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
Nodes (11): class-variance-authority, js-cookie, jsonwebtoken, dependencies, class-variance-authority, js-cookie, jsonwebtoken, @radix-ui/react-tabs (+3 more)

### Community 100 - "PostsService"
Cohesion: 0.18
Nodes (3): PostsService, ServiceCategoryService, generateUniqueSlug()

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
Cohesion: 0.33
Nodes (5): Locale, localeFlags, localeNames, locales, { Link, redirect, usePathname, useRouter }

### Community 105 - "route.ts"
Cohesion: 0.23
Nodes (6): GET(), PUT(), GET(), getOpenAIKey(), PUBLIC_SELECT, SiteConfigService

### Community 106 - "review.schema.ts"
Cohesion: 0.22
Nodes (8): CreateReviewInput, createReviewSchema, GetReviewsParams, GetReviewsQuery, getReviewsSchema, reviewIdSchema, UpdateReviewInput, updateReviewSchema

### Community 107 - "omniwallet.service.ts"
Cohesion: 0.09
Nodes (26): getEntitiesWithoutSEO(), POST(), globalForPrisma, TokenPayload, SendCouponEmailParams, CreateEmailTemplateInput, UpdateEmailTemplateInput, AddManagerInput (+18 more)

### Community 108 - "omniwallet.service.ts"
Cohesion: 0.09
Nodes (21): ContentBlockConfig, ContentBlockConfigSchema, createHomeBlockSchema, createHomeConfigurationSchema, HomeBlockTypeSchema, HomeBlockViewTypeSchema, HomeTextSizeSchema, HomeTextVariantSchema (+13 more)

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
Cohesion: 0.19
Nodes (12): POST(), POST(), annotateExisting(), norm(), ImportGraphResult, ScraperService, ScanInput, ScanResult (+4 more)

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

### Community 138 - "EventSelect.tsx"
Cohesion: 0.14
Nodes (8): EditCompetitionPageProps, OrganizerCompetitionsPage(), ConfirmDialog(), ConfirmDialogProps, EventOption, EventSelectProps, competitionsService, PaginatedCompetitionsResponse

### Community 139 - "class-variance-authority"
Cohesion: 0.15
Nodes (12): cache, memoryCache, CreateOrganizerInput, OrganizerFilters, UpdateOrganizerInput, CreateSpecialSeriesInput, SpecialSeriesFilters, UpdateSpecialSeriesInput (+4 more)

### Community 165 - ".approveContent"
Cohesion: 0.18
Nodes (11): DashboardLayout(), DashboardLayoutProps, OrganizerLayout(), CollapsibleUserInfo(), CollapsibleUserInfoProps, DashboardNav(), NavItem, navItems (+3 more)

### Community 185 - "page.tsx"
Cohesion: 0.19
Nodes (9): fetchTotal(), HeroSection(), HeroSectionProps, Stat, HomeBlockRenderer(), MapBand(), PINS, ITEMS (+1 more)

### Community 191 - "fetcher.ts"
Cohesion: 0.29
Nodes (11): decodeEntities(), fetchContent(), FetchedContent, fetchRendered(), fetchStatic(), htmlToText(), FetchMode, assertSafeUrl() (+3 more)

### Community 192 - "page.tsx"
Cohesion: 0.22
Nodes (7): Competition, Edition, EventNode, FetchMode, Graph, ScanResult, ScraperPage()

### Community 193 - "User"
Cohesion: 0.32
Nodes (4): roles, UserEditModalProps, UserTableProps, User

### Community 195 - "MapBlock.tsx"
Cohesion: 0.40
Nodes (4): MAP_TILES, MapBlockProps, MapBlockConfig, MapMode

### Community 197 - "extractor.ts"
Cohesion: 0.40
Nodes (5): competitionSchema, editionSchema, extractGraph(), getOpenAIKey(), graphSchema

## Knowledge Gaps
- **734 isolated node(s):** `CalView`, `CalEdition`, `MONTHS_ES`, `EventMap`, `DashboardLayoutProps` (+729 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **79 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `apiClientV2` connect `userEdition.schema.ts` to `admin.service.ts`, `layout.tsx`, `EventSelect.tsx`, `edition.ts`, `rating.ts`, `promotion.ts`, `HomeService`, `Language`, `index.ts`, `organizers.service.ts`, `ZancadasBalance.tsx`, `home.ts`, `apiClientV2`, `email-templates.service.ts`, `index.ts`, `page.tsx`, `page.tsx`, `services.service.ts`, `route.ts`, `v2.ts`, `SpecialSeries`, `ContentBlockConfig`, `EventManagersPanel.tsx`, `catalogs.service.ts`, `photos.service.ts`, `types.ts`, `SEOService`, `events.service.ts`?**
  _High betweenness centrality (0.270) - this node is a cross-community bridge._
- **What connects `CalView`, `CalEdition`, `MONTHS_ES` to the rest of the system?**
  _743 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `apiSuccess` be split into smaller, more focused modules?**
  _Cohesion score 0.05103324348607367 - nodes in this community are weakly interconnected._
- **Should `requireRole` be split into smaller, more focused modules?**
  _Cohesion score 0.04149620105201637 - nodes in this community are weakly interconnected._
- **Should `admin.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09113300492610837 - nodes in this community are weakly interconnected._
- **Should `button.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14736842105263157 - nodes in this community are weakly interconnected._
- **Should `requireAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.10960960960960961 - nodes in this community are weakly interconnected._