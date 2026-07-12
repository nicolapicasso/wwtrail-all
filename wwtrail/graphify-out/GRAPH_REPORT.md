# Graph Report - wwtrail  (2026-07-12)

## Corpus Check
- 573 files · ~302,597 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3140 nodes · 7551 edges · 198 communities (114 shown, 84 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.57)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e1373cb6`
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
- page.tsx
- bulk-edit.service.ts
- SEOService
- useAuth
- EventList.tsx
- PromotionForm.tsx
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
- EventForm.tsx
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
- serviceCategories.service.ts
- admin.schema.ts
- CatalogService
- photos.service.ts
- devDependencies
- error-handler.ts
- competition-admin.service.ts
- page.tsx
- ServiceCategoriesService
- .deleteAllImportedData
- TranslationsService
- edition.schema.ts
- translation.schema.ts
- scripts
- dependencies
- next
- EventMap.tsx
- competition.schema.ts
- result.schema.ts
- @radix-ui/react-select
- route.ts
- review.schema.ts
- omniwallet.service.ts
- WeatherCard.tsx
- react-dom
- participant.schema.ts
- react-hook-form
- EventCard.tsx
- slugify
- useSlugValidation.ts
- route.ts
- package.json
- migrate-uploads-to-spaces.js
- @radix-ui/react-switch
- EventManagerService
- tailwind-merge
- tailwindcss-animate
- @tiptap/extension-text-style
- tailwind-merge
- export-local.ts
- SEOService
- LayoutWrapper.tsx
- route.ts
- StatsCard.tsx
- StatsCard.tsx
- @types/node
- favorites.schema.ts
- next.config.js
- PATCH
- @tiptap/extension-underline
- EventSelect.tsx
- PATCH
- clsx
- date-fns
- entrypoint.sh
- eslint-config-next
- @tiptap/starter-kit
- leaflet
- uuid
- postcss
- next-intl
- nodemailer
- @prisma/client
- @radix-ui/react-accordion
- @radix-ui/react-alert-dialog
- @radix-ui/react-dialog
- @radix-ui/react-dropdown-menu
- @radix-ui/react-label
- prisma
- page.tsx
- @aws-sdk/client-s3
- @radix-ui/react-toast
- tailwindcss
- tsx
- PATCH
- page.tsx
- @types/bcryptjs
- LanguageSelector.tsx
- @types/leaflet
- @tiptap/extension-color
- @tiptap/extension-image
- @tiptap/extension-link
- @types/node
- @types/react-dom
- PATCH
- axios
- yet-another-react-lightbox
- PATCH
- @aws-sdk/client-s3
- InsiderBadge.tsx
- tailwind.config.ts
- apiClient
- cacheService
- DirectoryMapClient.tsx
- @types/nodemailer
- FooterService
- autoprefixer
- fetcher.ts
- @types/node
- PATCH
- PATCH
- PATCH
- eventManagers.service.ts
- TranslationsService
- CompetitionService
- EventManagersPanel.tsx
- CatalogService
- date-fns

## God Nodes (most connected - your core abstractions)
1. `apiError` - 450 edges
2. `apiSuccess()` - 441 edges
3. `requireRole()` - 283 edges
4. `useAuth()` - 76 edges
5. `requireAuth()` - 66 edges
6. `AdminService` - 65 edges
7. `ZancadasService` - 47 edges
8. `Button` - 41 edges
9. `ImportService` - 37 edges
10. `apiClientV2` - 35 edges

## Surprising Connections (you probably didn't know these)
- `LoginPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/auth/login/page.tsx → contexts/AuthContext.tsx
- `MagazineCategoryPage()` --indirect_call--> `PostCategory`  [INFERRED]
  app/[locale]/magazine/[category]/page.tsx → types/post.ts
- `OrganizerLayout()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/layout.tsx → contexts/AuthContext.tsx
- `OrganizerPostsPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/posts/page.tsx → contexts/AuthContext.tsx
- `EditPromotionPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/promotions/[id]/page.tsx → contexts/AuthContext.tsx

## Import Cycles
- None detected.

## Communities (198 total, 84 thin omitted)

### Community 0 - "apiSuccess"
Cohesion: 0.09
Nodes (21): ContentBlockConfig, ContentBlockConfigSchema, createHomeBlockSchema, createHomeConfigurationSchema, HomeBlockTypeSchema, HomeBlockViewTypeSchema, HomeTextSizeSchema, HomeTextVariantSchema (+13 more)

### Community 1 - "requireRole"
Cohesion: 0.04
Nodes (33): adminService, GET(), adminService, GET(), adminService, GET(), PUT(), adminService (+25 more)

### Community 2 - "admin.service.ts"
Cohesion: 0.10
Nodes (23): FilterRow(), getOperatorsForType(), AdminStats, AdminUser, BulkEditEntityType, BulkEditFilters, BulkEditOperation, BulkEditPreview (+15 more)

### Community 3 - "button.tsx"
Cohesion: 0.15
Nodes (13): RatingCardProps, RatingFormProps, RatingSummaryProps, RecentRatingsWidgetProps, StarRatingProps, ratingsService, CreateRatingDTO, EditionRating (+5 more)

### Community 4 - "requireAuth"
Cohesion: 0.12
Nodes (13): apiClientV2, Footer, FooterContent, OrganizersService, CreateOrganizerInput, Organizer, OrganizerFilters, OrganizerListItem (+5 more)

### Community 6 - "useAuth"
Cohesion: 0.07
Nodes (36): RegisterPage(), DashboardPage(), EditCompetitionPageProps, NewEventPage(), NewLandingPage(), LandingsAdminPage(), PromotionsAnalyticsPage(), NewPromotionPage() (+28 more)

### Community 7 - "homeConfiguration.schema.ts"
Cohesion: 0.09
Nodes (23): CompetitionCard(), CompetitionCardCompactProps, CompetitionCardProps, COUNTRY_FLAGS, CompetitionGrid(), CompetitionGridProps, CompetitionCardProps, CompetitionList() (+15 more)

### Community 8 - "page.tsx"
Cohesion: 0.09
Nodes (34): AdminUsersPage(), CategoryType, initialFormData, ParticipationFormData, ParticipationStatus, AddParticipationButtonProps, CategoryType, initialFormData (+26 more)

### Community 9 - "index.ts"
Cohesion: 0.14
Nodes (19): EditEditionPage(), EditEditionPageProps, EditionDetailTabs(), TODO: Get from API, TabKey, PodiumCardProps, PodiumPositionProps, PodiumFormProps (+11 more)

### Community 10 - "layout.tsx"
Cohesion: 0.11
Nodes (19): ProfilePage(), FavoriteButton(), FavoriteButtonProps, ZancadasBalance(), ZancadasBalanceProps, ACTION_ICONS, ACTION_LABEL_KEYS, ZancadasHistory() (+11 more)

### Community 11 - "user.service.ts"
Cohesion: 0.04
Nodes (51): POST(), GET(), POST(), POST(), autoFixEncoding(), fixCatalogEncoding(), fixCorruptedFaqs(), GET() (+43 more)

### Community 12 - "edition.ts"
Cohesion: 0.06
Nodes (38): EditionCard(), EditionCardProps, EditionsGridProps, EditionDetailTabsProps, EditionSelector(), EditionSelectorCompact(), EditionSelectorProps, EditionStatsCompactProps (+30 more)

### Community 14 - "page.tsx"
Cohesion: 0.11
Nodes (14): EventMedia(), MONTH_KEYS, PublicEventCardProps, PaginationData, UseEventsResult, ApiResponse, EventFilters, EventResponseV1 (+6 more)

### Community 15 - "import.service.ts"
Cohesion: 0.17
Nodes (12): FullImport, FullImportResult, fullImportSchema, ImportCompetition, importCompetitionSchema, ImportEvent, importEventSchema, ImportOrganizer (+4 more)

### Community 16 - "EventService"
Cohesion: 0.07
Nodes (20): cache, memoryCache, CompetitionAdminService, GetOrganizerOptions, GetPendingOptions, PaginatedCompetitions, TODO: Enviar notificación al organizador, TODO: Enviar notificación al organizador con razón (+12 more)

### Community 17 - "post.ts"
Cohesion: 0.22
Nodes (9): AuthContextType, AuthContextValue, AuthService, AuthResponse, LoginCredentials, RefreshTokenResponse, RegisterData, User (+1 more)

### Community 18 - "event.service.ts"
Cohesion: 0.11
Nodes (26): prisma, CreateEventInput, EventFilters, UpdateEventInput, CreatePostInput, PostFilters, UpdatePostInput, GenerateSEOInput (+18 more)

### Community 19 - "ZancadasService"
Cohesion: 0.06
Nodes (10): ParticipationsPage(), editionIdParamSchema, participationIdParamSchema, SearchEditionsQuery, searchEditionsSchema, UserEditionInput, userEditionSchema, UserEditionResult (+2 more)

### Community 20 - "CompetitionService"
Cohesion: 0.05
Nodes (34): GET(), GET(), GET(), POST(), GET(), POST(), GET(), GET() (+26 more)

### Community 21 - "rating.ts"
Cohesion: 0.17
Nodes (11): CatalogService, catalogsService, competitionTypesService, CatalogType, CompetitionType, CreateCatalogDTO, CreateSpecialSeriesDTO, SpecialSeries (+3 more)

### Community 22 - "page.tsx"
Cohesion: 0.08
Nodes (23): MagazineCategoryPage(), OrganizerPostsPage(), ArticleCard(), ArticleCardProps, ArticleGrid(), ArticleGridProps, ServiceForm(), ServiceFormProps (+15 more)

### Community 23 - "page.tsx"
Cohesion: 0.06
Nodes (40): InsidersAdminPage(), INSIDER_COLORS, insiderColor(), InsiderData, insiderInitials(), InsidersPage(), ParticipationCard(), profileInitials() (+32 more)

### Community 24 - "promotion.ts"
Cohesion: 0.13
Nodes (17): PromotionsService, AddCodesResponse, AddCouponCodesInput, CouponAnalyticsResponse, CouponCode, CouponRedemption, CouponRedemptionResponse, CouponStats (+9 more)

### Community 25 - "compilerOptions"
Cohesion: 0.07
Nodes (28): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+20 more)

### Community 26 - "ImportService"
Cohesion: 0.10
Nodes (22): DELETE(), PATCH(), POST(), GET(), POST(), PUT(), POST(), DELETE() (+14 more)

### Community 27 - "HomeService"
Cohesion: 0.11
Nodes (28): FooterAdminPage(), LANGUAGES, InsiderConfig, InsiderStats, EditLandingPage(), SEOConfigPage(), GroupedSEO, SEOManagementPage() (+20 more)

### Community 28 - "generateUniqueSlug"
Cohesion: 0.09
Nodes (12): EventDetailPage(), getMonthName(), AddParticipationButton(), AdminEditButton(), AdminEditButtonFloating(), AdminEditButtonProps, EditionParticipants(), RelatedArticles() (+4 more)

### Community 29 - "Language"
Cohesion: 0.27
Nodes (12): POST(), autoFillCompetition(), autoFillEvent(), classifyImage(), CompetitionAutoFillResult, EventAutoFillResult, extractImagesFromHtml(), fetchPageContent() (+4 more)

### Community 30 - "use-toast.ts"
Cohesion: 0.12
Nodes (23): Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle, toastVariants (+15 more)

### Community 31 - "user.service.ts"
Cohesion: 0.11
Nodes (15): ChangePasswordInput, changePasswordSchema, GetPublicUsersQuery, getPublicUsersSchema, GetUsersQuery, getUsersSchema, UpdateUserInput, updateUserSchema (+7 more)

### Community 32 - "EditionService"
Cohesion: 0.08
Nodes (13): POST(), GET(), POST(), GET(), DELETE(), GET(), PUT(), GET() (+5 more)

### Community 33 - "catalog.service.ts"
Cohesion: 0.17
Nodes (13): CreateCatalogInput, createCatalogSchema, CreateSpecialSeriesInput, createSpecialSeriesSchema, GetCatalogQuery, getCatalogQuerySchema, UpdateCatalogInput, updateCatalogSchema (+5 more)

### Community 34 - "PromotionForm.tsx"
Cohesion: 0.16
Nodes (8): EventsService, CreateEventData, EventFilters, EventResponse, EventsResponse, EventStatsResponse, RejectEventData, UpdateEventData

### Community 35 - "index.ts"
Cohesion: 0.14
Nodes (13): EventFilters, EventList(), EventListProps, EventListSimple(), EventListSimpleProps, FeaturedEvents(), Result, ResultType (+5 more)

### Community 36 - "organizers.service.ts"
Cohesion: 0.05
Nodes (50): BlockConfigModal(), BlockConfigModalProps, HeroConfigForm(), HeroConfigFormProps, CompetitionsBlock(), CompetitionsBlockProps, EditionsBlock(), EditionsBlockProps (+42 more)

### Community 37 - "events.service.ts"
Cohesion: 0.40
Nodes (5): COUNTRY_FLAGS, EventCard(), EventCardProps, MONTHS, ManagedEvent

### Community 38 - "page.tsx"
Cohesion: 0.31
Nodes (4): GET(), PUT(), GET(), SiteConfigService

### Community 39 - "ZancadasBalance.tsx"
Cohesion: 0.10
Nodes (30): LoginPage(), EventMap, ExportStats, ACTION_ICONS, getCountryName(), ROLE_LABELS, StatsPage(), STATUS_LABELS (+22 more)

### Community 40 - "errors.ts"
Cohesion: 0.06
Nodes (19): CreatePodiumInput, createPodiumSchema, UpdateChronicleInput, updateChronicleSchema, UpdatePodiumInput, updatePodiumSchema, EditionPodiumService, prisma (+11 more)

### Community 41 - "EditionPodiumService"
Cohesion: 0.19
Nodes (8): AgendaRow(), CalEdition, CalView, editionHref(), effDistance(), effElevation(), MONTHS_ES, MonthView()

### Community 43 - "home.ts"
Cohesion: 0.15
Nodes (11): ORG_COLORS, OrganizersPublicPage(), orgColor(), orgInitials(), CountrySelect(), CountrySelectProps, SpecialSeriesForm(), SpecialSeriesFormProps (+3 more)

### Community 44 - "user-competitions.service.ts"
Cohesion: 0.13
Nodes (12): MyRegistrationsPage(), UserStatsCards(), useUserCompetitions(), useUserStats(), userCompetitionsService, AddResultData, MarkCompetitionData, RankingEntry (+4 more)

### Community 45 - "apiClientV2"
Cohesion: 0.17
Nodes (10): FilterState, COMPETITION_TYPES, CompetitionFilters(), CompetitionFiltersProps, COUNTRIES, FilterState, SORT_OPTIONS, CompetitionGridSkeleton() (+2 more)

### Community 46 - "email-templates.service.ts"
Cohesion: 0.18
Nodes (11): EmailTemplatesPage(), EmailTemplatesService, CreateEmailTemplateInput, EMAIL_TEMPLATE_TYPES, EmailTemplate, EmailTemplatePreviewResponse, EmailTemplateResponse, EmailTemplatesResponse (+3 more)

### Community 47 - "auth.schema.ts"
Cohesion: 0.27
Nodes (11): DELETE(), ALLOWED_TYPES, POST(), ALLOWED_TYPES, POST(), deleteFromSpaces(), getKeyFromUrl(), getSpacesStatus() (+3 more)

### Community 48 - "event.schema.ts"
Cohesion: 0.10
Nodes (19): CreateEventInput, createEventSchema, eventIdSchema, EventsByCountryParams, EventsByCountryQuery, eventsByCountrySchema, eventSlugSchema, FeaturedEventsQuery (+11 more)

### Community 49 - "index.ts"
Cohesion: 0.52
Nodes (6): ENCODING_FIXES, fixEncoding(), fixString(), normalizeUnicode(), parseJsonWithEncoding(), stripBOM()

### Community 50 - "ai-autofill.service.ts"
Cohesion: 0.16
Nodes (17): CompetitionDetailPage(), CompetitionDetailPage(), OrganizerDetailPage(), EventMap, ServiceDetailPage(), EventGallery(), EventGalleryProps, OrganizerCard() (+9 more)

### Community 51 - "OrganizerService"
Cohesion: 0.12
Nodes (10): GET(), POST(), POST(), DELETE(), GET(), PUT(), GET(), POST() (+2 more)

### Community 52 - "page.tsx"
Cohesion: 0.29
Nodes (7): DRY, main(), prisma, repairValue(), Rule, RULES, TEXT_KEYS

### Community 53 - "page.tsx"
Cohesion: 0.12
Nodes (18): BulkActionsBarProps, EventCardProps, EventStatusBadge(), EventStatusBadgeProps, CreateEventInput, EventCompetitionSummary, EventCreatorRef, EventListResponse (+10 more)

### Community 54 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 55 - "HomeBlockRenderer.tsx"
Cohesion: 0.22
Nodes (8): DirectoryFilters, DirectoryMapClient(), ItemType, MAP_TILES, MapMode, spreadOverlappingMarkers(), DirectoryPage(), terrainTypesService

### Community 56 - "page.tsx"
Cohesion: 0.18
Nodes (7): ReorderPhotosInput, reorderPhotosSchema, UpdatePhotoMetadataInput, updatePhotoMetadataSchema, UploadPhotoInput, uploadPhotoSchema, EditionPhotoService

### Community 57 - "bulk-edit.service.ts"
Cohesion: 0.15
Nodes (10): BulkEditEntityType, BulkEditFilters, BulkEditOperation, BulkEditPreview, BulkEditResult, BulkEditService, EntityMetadata, FieldMetadata (+2 more)

### Community 58 - "SEOService"
Cohesion: 0.14
Nodes (3): getOpenAIKey(), SEOService, getOpenAIKey()

### Community 59 - "useAuth"
Cohesion: 0.13
Nodes (13): ALL_LANGUAGES, PageProps, LandingFormProps, LANGUAGES, CreateLandingInput, GetLandingsParams, GetLandingsResponse, Landing (+5 more)

### Community 61 - "PromotionForm.tsx"
Cohesion: 0.16
Nodes (12): FileUpload(), FileUploadProps, LandingForm(), LANGUAGES, PromotionForm(), RichTextEditor(), RichTextEditorProps, apiClientFiles (+4 more)

### Community 62 - "editionRating.schema.ts"
Cohesion: 0.12
Nodes (11): GET(), POST(), GET(), GET(), DELETE(), GET(), PUT(), GET() (+3 more)

### Community 65 - "PromotionService"
Cohesion: 0.13
Nodes (10): GET(), POST(), POST(), DELETE(), GET(), PUT(), GET(), POST() (+2 more)

### Community 66 - "CompetitionActions.tsx"
Cohesion: 0.14
Nodes (19): CompetitionActions(), CompetitionActionsProps, LanguageSelector(), Navbar(), DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel (+11 more)

### Community 68 - "services.service.ts"
Cohesion: 0.13
Nodes (14): OrganizerServicesPage(), COUNTRY_FLAGS, ServiceCard(), ServiceCardProps, ServicesService, CategoriesResponse, CreateServiceInput, Service (+6 more)

### Community 69 - "LandingService"
Cohesion: 0.15
Nodes (9): CreateLandingInput, createLandingSchema, GetLandingsQuery, getLandingsSchema, TranslateLandingInput, translateLandingSchema, UpdateLandingInput, updateLandingSchema (+1 more)

### Community 70 - "route.ts"
Cohesion: 0.12
Nodes (11): ForgotPasswordInput, forgotPasswordSchema, LoginInput, loginSchema, RefreshTokenInput, refreshTokenSchema, RegisterInput, registerSchema (+3 more)

### Community 72 - "page.tsx"
Cohesion: 0.26
Nodes (13): classifyImage(), decodeEntities(), extractImages(), fetchContent(), FetchedContent, fetchRendered(), fetchStatic(), htmlToText() (+5 more)

### Community 73 - "event.ts"
Cohesion: 0.18
Nodes (10): ConflictItem, ConflictResolution, EntityType, LANGUAGE_MAPPING, NativeImportFile, NativeImportOptions, NativeImportResult, NativeImportResultItem (+2 more)

### Community 74 - "EventForm.tsx"
Cohesion: 0.14
Nodes (14): CompetitionFormProps, EventForm(), EventFormProps, ImageAssignment, ImageImportSelector(), ImageRole, Props, ROLE_COLORS (+6 more)

### Community 75 - "competition-admin.schema.ts"
Cohesion: 0.12
Nodes (15): ApproveCompetitionInput, ApproveCompetitionParams, approveCompetitionSchema, GetOrganizerCompetitionsQuery, getOrganizerCompetitionsSchema, GetPendingCompetitionsQuery, getPendingCompetitionsSchema, GetStatsQuery (+7 more)

### Community 77 - "ContentBlockConfig"
Cohesion: 0.46
Nodes (6): ALLOWED_CONTENT_TYPES, POST(), assertSafeUrl(), isBlockedIP(), isBlockedIPv4(), isBlockedIPv6()

### Community 78 - "page.tsx"
Cohesion: 0.13
Nodes (25): annotateExisting(), bigrams(), dice(), distSim(), jaccard(), nameSim(), norm(), pct() (+17 more)

### Community 79 - "SpecialSeries"
Cohesion: 0.32
Nodes (4): roles, UserEditModalProps, UserTableProps, User

### Community 80 - "user-competition.schema.ts"
Cohesion: 0.13
Nodes (14): AddResultInput, addResultSchema, competitionIdParamSchema, GetMyCompetitionsQuery, getMyCompetitionsSchema, GetUserCompetitionsParams, getUserCompetitionsSchema, GlobalRankingParams (+6 more)

### Community 82 - "page.tsx"
Cohesion: 0.39
Nodes (7): base64UrlDecodeToString(), base64UrlToUint8Array(), EdgeTokenPayload, verifyJwtEdge(), config, intlMiddleware, middleware()

### Community 85 - "serviceCategories.service.ts"
Cohesion: 0.11
Nodes (11): PromotionCategoriesPage(), AdminPromotionsPage(), PromotionCardProps, PromotionFormProps, CreateServiceCategoryInput, ServiceCategoriesService, ServiceCategory, UpdateServiceCategoryInput (+3 more)

### Community 86 - "admin.schema.ts"
Cohesion: 0.14
Nodes (13): DeleteUserInput, deleteUserSchema, getStatsSchema, GetUserByIdInput, getUserByIdSchema, GetUsersInput, getUsersSchema, GetUserStatsInput (+5 more)

### Community 88 - "photos.service.ts"
Cohesion: 0.28
Nodes (7): EditionGalleryProps, photosService, EditionPhoto, PHOTO_UPLOAD_CONFIG, ReorderPhotosDTO, UpdatePhotoDTO, UploadPhotoDTO

### Community 89 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, postcss, @types/js-cookie, @types/nodemailer, @types/react, @types/uuid, typescript, postcss (+5 more)

### Community 90 - "error-handler.ts"
Cohesion: 0.17
Nodes (5): ApiError, ApiResponse, Language, LANGUAGE_NAMES, LANGUAGES

### Community 91 - "competition-admin.service.ts"
Cohesion: 0.33
Nodes (6): EventMap(), EventMapMarker, EventMapProps, MAP_TILES, MapMode, spreadOverlappingMarkers()

### Community 92 - "page.tsx"
Cohesion: 0.43
Nodes (5): LargeCard(), mediaUrl(), SmallCard(), StatChip(), StatChipProps

### Community 93 - "ServiceCategoriesService"
Cohesion: 0.16
Nodes (7): DELETE(), GET(), PUT(), GET(), POST(), GET(), ServiceCategoryService

### Community 94 - ".deleteAllImportedData"
Cohesion: 0.18
Nodes (11): DashboardLayout(), DashboardLayoutProps, OrganizerLayout(), CollapsibleUserInfo(), CollapsibleUserInfoProps, DashboardNav(), NavItem, navItems (+3 more)

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
Cohesion: 0.80
Nodes (3): ImpersonationBar(), getImpersonatedName(), stopImpersonation()

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
Cohesion: 0.07
Nodes (34): getEntitiesWithoutSEO(), POST(), globalForPrisma, CreateEditionRatingInput, createEditionRatingSchema, GetRatingsQuery, getRatingsQuerySchema, GetRecentRatingsQuery (+26 more)

### Community 108 - "WeatherCard.tsx"
Cohesion: 0.22
Nodes (9): WeatherCardProps, WeatherDetailProps, WeatherResponse, weatherService, EditionWeather, WEATHER_COLORS, WEATHER_ICONS, WeatherCondition (+1 more)

### Community 110 - "participant.schema.ts"
Cohesion: 0.25
Nodes (7): CreateParticipantInput, createParticipantSchema, GetParticipantsQuery, getParticipantsSchema, participantIdSchema, UpdateParticipantInput, updateParticipantSchema

### Community 114 - "useSlugValidation.ts"
Cohesion: 0.38
Nodes (5): SlugInput(), SlugInputProps, SlugValidationResult, useSlugValidation(), UseSlugValidationOptions

### Community 116 - "package.json"
Cohesion: 0.29
Nodes (6): description, engines, node, name, private, version

### Community 117 - "migrate-uploads-to-spaces.js"
Cohesion: 0.17
Nodes (15): s3Client, convertUrl(), DRY_RUN, fileExistsOnSpaces(), fs, getAllFiles(), main(), MIME_TYPES (+7 more)

### Community 125 - "export-local.ts"
Cohesion: 0.67
Nodes (3): exportAll(), getCoordinates(), prisma

### Community 126 - "SEOService"
Cohesion: 0.14
Nodes (4): GenerateSEOInput, SEOConfig, SEOService, UpsertConfigInput

### Community 127 - "LayoutWrapper.tsx"
Cohesion: 0.09
Nodes (21): archivo, barlow, metadata, COMMUNITY, EXPLORE, Footer(), FOOTER_EXCLUDED_ROUTES, FooterLink (+13 more)

### Community 131 - "@types/node"
Cohesion: 0.10
Nodes (8): EditPromotionPage(), PromotionDetailPage(), EventFiltersProps, MyStats, BulkTranslationResponse, EntityStats, TranslationResponse, TranslationStatsResponse

### Community 140 - "clsx"
Cohesion: 0.08
Nodes (25): bcryptjs, class-variance-authority, jsonwebtoken, next, next-intl, dependencies, bcryptjs, class-variance-authority (+17 more)

### Community 141 - "date-fns"
Cohesion: 0.12
Nodes (11): Competition, Edition, EventNode, FetchMode, Graph, MatchInfo, ScanResult, ScraperPage() (+3 more)

### Community 143 - "eslint-config-next"
Cohesion: 0.03
Nodes (100): POST(), POST(), GET(), POST(), POST(), GET(), DELETE(), PUT() (+92 more)

### Community 146 - "uuid"
Cohesion: 0.29
Nodes (8): abbreviate(), colorFor(), HEADER_COLORS, SpecialSeriesCard(), SpecialSeriesCardProps, SpecialSeriesGrid(), SpecialSeriesGridProps, SpecialSeriesListItem

### Community 152 - "@radix-ui/react-alert-dialog"
Cohesion: 0.23
Nodes (11): BORDER_RADIUS_OPTIONS, FONT_OPTIONS, SHADOW_OPTIONS, SiteConfig, SiteConfigPage(), ThemePresetService, BUILTIN_PRESETS, pickThemeValues() (+3 more)

### Community 179 - "InsiderBadge.tsx"
Cohesion: 0.10
Nodes (16): OrganizerCompetitionsPage(), OrganizerEditionsPage(), EditEventPage(), MyEventsPage(), ViewMode, EditOrganizerPage(), OrganizersListPage(), OrganizerDashboard() (+8 more)

### Community 193 - "@types/nodemailer"
Cohesion: 0.06
Nodes (35): loginSchema, POST(), POST(), POST(), registerSchema, POST(), POST(), toSpacesCdn() (+27 more)

### Community 206 - "eventManagers.service.ts"
Cohesion: 0.17
Nodes (7): AddManagerResponse, AvailableOrganizer, AvailableOrganizersResponse, EventManager, EventManagersService, ManagersResponse, RemoveManagerResponse

### Community 209 - "EventManagersPanel.tsx"
Cohesion: 0.08
Nodes (20): ENTITY_OPTIONS, EXAMPLE_JSON, FullImportResult, ImportData, ImportResult, ImportStats, NativeImportTab(), EntityOption (+12 more)

## Knowledge Gaps
- **751 isolated node(s):** `CalView`, `CalEdition`, `MONTHS_ES`, `EventMap`, `DashboardLayoutProps` (+746 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **84 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `apiClientV2` connect `requireAuth` to `admin.service.ts`, `button.tsx`, `@types/node`, `homeConfiguration.schema.ts`, `index.ts`, `layout.tsx`, `edition.ts`, `date-fns`, `page.tsx`, `rating.ts`, `page.tsx`, `@radix-ui/react-alert-dialog`, `promotion.ts`, `PromotionForm.tsx`, `organizers.service.ts`, `ZancadasBalance.tsx`, `email-templates.service.ts`, `useAuth`, `services.service.ts`, `EventForm.tsx`, `eventManagers.service.ts`, `serviceCategories.service.ts`, `photos.service.ts`, `dependencies`, `EventMap.tsx`, `WeatherCard.tsx`, `SEOService`?**
  _High betweenness centrality (0.236) - this node is a cross-community bridge._
- **What connects `CalView`, `CalEdition`, `MONTHS_ES` to the rest of the system?**
  _760 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `apiSuccess` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `requireRole` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Should `admin.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `button.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1452991452991453 - nodes in this community are weakly interconnected._
- **Should `requireAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._