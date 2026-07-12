# Graph Report - wwtrail  (2026-07-12)

## Corpus Check
- 573 files · ~278,803 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3144 nodes · 7554 edges · 222 communities (127 shown, 95 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1c82e104`
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
- next
- EventMap.tsx
- competition.schema.ts
- result.schema.ts
- @radix-ui/react-select
- route.ts
- review.schema.ts
- omniwallet.service.ts
- SearchableEntitySelect.tsx
- react-dom
- participant.schema.ts
- react-hook-form
- EventCard.tsx
- slugify
- useSlugValidation.ts
- route.ts
- package.json
- EditionStats.tsx
- @radix-ui/react-switch
- EventManagerService
- tailwind-merge
- tailwindcss-animate
- @tiptap/extension-text-style
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
- @tiptap/extension-text-align
- @types/node
- @types/react-dom
- PATCH
- axios
- yet-another-react-lightbox
- zod
- PATCH
- @aws-sdk/client-s3
- InsiderBadge.tsx
- impersonation.ts
- LayoutWrapper.tsx
- InsiderContext.tsx
- UserStatsCards.tsx
- footer.service.ts
- tailwind.config.ts
- apiClient
- cacheService
- @types/js-cookie
- DirectoryMapClient.tsx
- @types/nodemailer
- @types/nodemailer
- WeatherCard.tsx
- bcryptjs
- ai-autofill.service.ts
- fetcher.ts
- page.tsx
- page.tsx
- PATCH
- PATCH
- PATCH
- page.tsx
- page.tsx
- eventManagers.service.ts
- TranslationsService
- CompetitionService
- EventManagersPanel.tsx
- editionRating.service.ts
- import.service.ts
- SEOService
- CatalogService
- route.ts
- CountrySelect.tsx
- ServiceCategoriesService
- navigation.ts
- SpecialSeriesForm.tsx
- page.tsx
- useMyStats.ts
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
- `MagazineCategoryPage()` --indirect_call--> `PostCategory`  [INFERRED]
  app/[locale]/magazine/[category]/page.tsx → types/post.ts
- `NewEventPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/events/new/page.tsx → contexts/AuthContext.tsx
- `OrganizerLayout()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/layout.tsx → contexts/AuthContext.tsx
- `OrganizerPostsPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/posts/page.tsx → contexts/AuthContext.tsx
- `EditPromotionPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/[locale]/organizer/promotions/[id]/page.tsx → contexts/AuthContext.tsx

## Import Cycles
- None detected.

## Communities (222 total, 95 thin omitted)

### Community 0 - "apiSuccess"
Cohesion: 0.10
Nodes (26): EditionCardProps, EditionsGridProps, EditionStatsCompactProps, EditionStatsProps, EditionFormProps, EditionBackendResponse, editionsService, EditionStatus (+18 more)

### Community 1 - "requireRole"
Cohesion: 0.04
Nodes (33): adminService, GET(), adminService, GET(), adminService, GET(), PUT(), adminService (+25 more)

### Community 2 - "admin.service.ts"
Cohesion: 0.04
Nodes (43): FilterRow(), getOperatorsForType(), OPERATOR_LABELS, ENTITY_OPTIONS, EXAMPLE_JSON, FullImportResult, ImportData, ImportResult (+35 more)

### Community 3 - "button.tsx"
Cohesion: 0.13
Nodes (20): EditEditionPage(), EditEditionPageProps, EditionDetailTabs(), EditionDetailTabsProps, TODO: Get from API, TabKey, PodiumCardProps, PodiumPositionProps (+12 more)

### Community 4 - "requireAuth"
Cohesion: 0.22
Nodes (6): OrganizersService, CreateOrganizerInput, Organizer, OrganizerFilters, OrganizerListItem, UpdateOrganizerInput

### Community 6 - "useAuth"
Cohesion: 0.06
Nodes (42): LoginPage(), RegisterPage(), DashboardPage(), FooterAdminPage(), ALL_LANGUAGES, EditLandingPage(), NewLandingPage(), LandingsAdminPage() (+34 more)

### Community 7 - "homeConfiguration.schema.ts"
Cohesion: 0.05
Nodes (38): POST(), POST(), DELETE(), PUT(), GET(), GET(), POST(), GET() (+30 more)

### Community 8 - "page.tsx"
Cohesion: 0.07
Nodes (48): GroupedSEO, AdminUsersPage(), ROLE_OPTIONS, CategoryType, initialFormData, ParticipationFormData, ParticipationStatus, AddParticipationButton() (+40 more)

### Community 9 - "index.ts"
Cohesion: 0.13
Nodes (11): apiClientV2, Footer, FooterContent, FooterService, GenerateSEOInput, SEOConfig, UpsertConfigInput, BulkTranslationResponse (+3 more)

### Community 10 - "layout.tsx"
Cohesion: 0.15
Nodes (15): Skeleton(), ZancadasBalance(), ZancadasBalanceProps, ACTION_ICONS, ACTION_LABELS, ZancadasHistory(), ZancadasHistoryProps, CompetitionMarker (+7 more)

### Community 11 - "user.service.ts"
Cohesion: 0.05
Nodes (42): GET(), autoFixEncoding(), fixCatalogEncoding(), fixCorruptedFaqs(), GET(), POST(), POST(), toSpacesCdn() (+34 more)

### Community 12 - "edition.ts"
Cohesion: 0.11
Nodes (23): EditCompetitionPageProps, CompetitionCardProps, CompetitionList(), CompetitionListCompact(), CompetitionListCompactProps, CompetitionListProps, ConfirmDialog(), ConfirmDialogProps (+15 more)

### Community 14 - "page.tsx"
Cohesion: 0.06
Nodes (24): EventFiltersProps, EventFilters, EventList(), EventListProps, EventListSimple(), EventListSimpleProps, FeaturedEvents(), LargeCard() (+16 more)

### Community 15 - "import.service.ts"
Cohesion: 0.17
Nodes (12): FullImport, FullImportResult, fullImportSchema, ImportCompetition, importCompetitionSchema, ImportEvent, importEventSchema, ImportOrganizer (+4 more)

### Community 16 - "EventService"
Cohesion: 0.19
Nodes (11): loginSchema, POST(), POST(), POST(), registerSchema, POST(), comparePassword(), generateTokens() (+3 more)

### Community 17 - "post.ts"
Cohesion: 0.19
Nodes (10): AuthContextType, AuthContextValue, AuthService, createResponseInterceptor(), AuthResponse, LoginCredentials, RefreshTokenResponse, RegisterData (+2 more)

### Community 18 - "event.service.ts"
Cohesion: 0.11
Nodes (26): prisma, CreateEventInput, EventFilters, UpdateEventInput, CreatePostInput, PostFilters, UpdatePostInput, GenerateSEOInput (+18 more)

### Community 20 - "CompetitionService"
Cohesion: 0.05
Nodes (43): POST(), GET(), GET(), POST(), GET(), GET(), POST(), GET() (+35 more)

### Community 21 - "rating.ts"
Cohesion: 0.08
Nodes (24): CompetitionCard(), CompetitionCardCompactProps, CompetitionCardProps, COUNTRY_FLAGS, COMPETITION_TYPES, CompetitionFilters(), CompetitionFiltersProps, COUNTRIES (+16 more)

### Community 22 - "page.tsx"
Cohesion: 0.18
Nodes (11): FileUpload(), FileUploadProps, LANGUAGES, PromotionForm(), RichTextEditor(), RichTextEditorProps, apiClientFiles, filesService (+3 more)

### Community 23 - "page.tsx"
Cohesion: 0.07
Nodes (37): InsidersAdminPage(), EditProfilePage(), INSIDER_COLORS, insiderColor(), InsiderData, insiderInitials(), InsidersPage(), ParticipationCard() (+29 more)

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
Cohesion: 0.11
Nodes (23): COLUMNS, LANGUAGES, InsiderConfig, InsiderStats, ACTION_ICONS, ACTION_LABELS, PARTICIPATION_STATUSES, AdminEditUserPage() (+15 more)

### Community 28 - "generateUniqueSlug"
Cohesion: 0.16
Nodes (15): CompetitionDetailPage(), OrganizerDetailPage(), EventMap, ServiceDetailPage(), EventGallery(), EventGalleryProps, ServiceForm(), ServiceFormProps (+7 more)

### Community 29 - "Language"
Cohesion: 0.23
Nodes (11): DELETE(), ALLOWED_TYPES, POST(), ALLOWED_TYPES, POST(), deleteFromSpaces(), getKeyFromUrl(), getSpacesStatus() (+3 more)

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
Cohesion: 0.15
Nodes (11): OrganizerCompetitionsPage(), OrganizerEditionsPage(), EditEventPage(), MyEventsPage(), EditOrganizerPage(), OrganizersListPage(), OrganizerDashboard(), CompetitionForm() (+3 more)

### Community 35 - "index.ts"
Cohesion: 0.19
Nodes (9): fetchTotal(), HeroSection(), HeroSectionProps, Stat, HomeBlockRenderer(), MapBand(), PINS, ITEMS (+1 more)

### Community 36 - "organizers.service.ts"
Cohesion: 0.17
Nodes (16): BlockConfigModal(), HeroConfigForm(), HeroConfigFormProps, LinksBlockProps, MapBlockProps, TextBlockProps, BlockConfig, HomeBlockType (+8 more)

### Community 37 - "events.service.ts"
Cohesion: 0.16
Nodes (9): BlockConfigModalProps, HomeBlockRendererProps, HomeService, CreateHomeBlockDTO, HomeBlock, HomeConfiguration, UpdateFullHomeConfigDTO, UpdateHomeBlockDTO (+1 more)

### Community 38 - "page.tsx"
Cohesion: 0.31
Nodes (4): GET(), PUT(), GET(), SiteConfigService

### Community 39 - "ZancadasBalance.tsx"
Cohesion: 0.10
Nodes (27): EventMap, ExportStats, getCountryName(), ROLE_LABELS, StatsPage(), STATUS_LABELS, TYPE_LABELS, ENTITY_CONFIGS (+19 more)

### Community 40 - "errors.ts"
Cohesion: 0.14
Nodes (10): prisma, EditionWeather, AppError, BadRequestError, ConflictError, ForbiddenError, InternalServerError, NotFoundError (+2 more)

### Community 41 - "EditionPodiumService"
Cohesion: 0.19
Nodes (8): AgendaRow(), CalEdition, CalView, editionHref(), effDistance(), effElevation(), MONTHS_ES, MonthView()

### Community 42 - "serviceCategories.service.ts"
Cohesion: 0.12
Nodes (8): POST(), POST(), DELETE(), GET(), PATCH(), PUT(), POST(), POST()

### Community 43 - "home.ts"
Cohesion: 0.17
Nodes (15): s3Client, convertUrl(), DRY_RUN, fileExistsOnSpaces(), fs, getAllFiles(), main(), MIME_TYPES (+7 more)

### Community 44 - "user-competitions.service.ts"
Cohesion: 0.13
Nodes (12): MyRegistrationsPage(), UserStatsCards(), useUserCompetitions(), useUserStats(), userCompetitionsService, AddResultData, MarkCompetitionData, RankingEntry (+4 more)

### Community 45 - "apiClientV2"
Cohesion: 0.11
Nodes (16): DELETE(), PATCH(), POST(), GET(), POST(), PUT(), POST(), DELETE() (+8 more)

### Community 46 - "email-templates.service.ts"
Cohesion: 0.18
Nodes (11): EmailTemplatesPage(), EmailTemplatesService, CreateEmailTemplateInput, EMAIL_TEMPLATE_TYPES, EmailTemplate, EmailTemplatePreviewResponse, EmailTemplateResponse, EmailTemplatesResponse (+3 more)

### Community 47 - "auth.schema.ts"
Cohesion: 0.26
Nodes (6): OrganizerServicesPage(), COUNTRY_FLAGS, ServiceCard(), ServiceCardProps, Service, ServiceCategory

### Community 48 - "event.schema.ts"
Cohesion: 0.10
Nodes (19): CreateEventInput, createEventSchema, eventIdSchema, EventsByCountryParams, EventsByCountryQuery, eventsByCountrySchema, eventSlugSchema, FeaturedEventsQuery (+11 more)

### Community 49 - "index.ts"
Cohesion: 0.52
Nodes (6): ENCODING_FIXES, fixEncoding(), fixString(), normalizeUnicode(), parseJsonWithEncoding(), stripBOM()

### Community 50 - "ai-autofill.service.ts"
Cohesion: 0.16
Nodes (9): POST(), GET(), POST(), DELETE(), GET(), PUT(), GET(), POST() (+1 more)

### Community 51 - "OrganizerService"
Cohesion: 0.12
Nodes (10): GET(), POST(), POST(), DELETE(), GET(), PUT(), GET(), POST() (+2 more)

### Community 52 - "page.tsx"
Cohesion: 0.29
Nodes (7): DRY, main(), prisma, repairValue(), Rule, RULES, TEXT_KEYS

### Community 53 - "page.tsx"
Cohesion: 0.07
Nodes (31): ViewMode, BulkActionsBar(), BulkActionsBarProps, EventCardProps, EventStatusBadge(), EventStatusBadgeProps, COUNTRY_FLAGS, EventCard() (+23 more)

### Community 54 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 55 - "HomeBlockRenderer.tsx"
Cohesion: 0.29
Nodes (7): DirectoryFilters, DirectoryMapClient(), ItemType, MAP_TILES, MapMode, spreadOverlappingMarkers(), terrainTypesService

### Community 56 - "useAuth.ts"
Cohesion: 0.15
Nodes (13): RatingCardProps, RatingFormProps, RatingSummaryProps, RecentRatingsWidgetProps, StarRatingProps, ratingsService, CreateRatingDTO, EditionRating (+5 more)

### Community 57 - "bulk-edit.service.ts"
Cohesion: 0.15
Nodes (10): BulkEditEntityType, BulkEditFilters, BulkEditOperation, BulkEditPreview, BulkEditResult, BulkEditService, EntityMetadata, FieldMetadata (+2 more)

### Community 58 - "SEOService"
Cohesion: 0.13
Nodes (5): getOpenAIKey(), getOpenAIKey(), SEOService, PUBLIC_SELECT, getOpenAIKey()

### Community 59 - "useAuth"
Cohesion: 0.12
Nodes (11): PageProps, LandingFormProps, CreateLandingInput, GetLandingsParams, GetLandingsResponse, Landing, LandingService, LandingTranslation (+3 more)

### Community 61 - "EventForm.tsx"
Cohesion: 0.19
Nodes (15): CompetitionsBlock(), CompetitionsBlockProps, EditionsBlock(), EditionsBlockProps, EventsBlock(), EventsBlockProps, MapBlock, LinksBlock() (+7 more)

### Community 62 - "editionRating.schema.ts"
Cohesion: 0.12
Nodes (11): GET(), POST(), GET(), GET(), DELETE(), GET(), PUT(), GET() (+3 more)

### Community 65 - "PromotionService"
Cohesion: 0.13
Nodes (10): GET(), POST(), POST(), DELETE(), GET(), PUT(), GET(), POST() (+2 more)

### Community 66 - "CompetitionActions.tsx"
Cohesion: 0.19
Nodes (14): CompetitionActions(), CompetitionActionsProps, LanguageSelector(), Navbar(), DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel (+6 more)

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
Cohesion: 0.20
Nodes (7): CreatePodiumInput, createPodiumSchema, UpdateChronicleInput, updateChronicleSchema, UpdatePodiumInput, updatePodiumSchema, EditionPodiumService

### Community 74 - "v2.ts"
Cohesion: 0.33
Nodes (6): EventMap(), EventMapMarker, EventMapProps, MAP_TILES, MapMode, spreadOverlappingMarkers()

### Community 75 - "competition-admin.schema.ts"
Cohesion: 0.12
Nodes (15): ApproveCompetitionInput, ApproveCompetitionParams, approveCompetitionSchema, GetOrganizerCompetitionsQuery, getOrganizerCompetitionsSchema, GetPendingCompetitionsQuery, getPendingCompetitionsSchema, GetStatsQuery (+7 more)

### Community 76 - "SpecialSeries"
Cohesion: 0.12
Nodes (15): SpecialSeriesListPage(), abbreviate(), colorFor(), HEADER_COLORS, SpecialSeriesCard(), SpecialSeriesCardProps, SpecialSeriesGrid(), SpecialSeriesGridProps (+7 more)

### Community 77 - "ContentBlockConfig"
Cohesion: 0.17
Nodes (8): editionIdParamSchema, participationIdParamSchema, SearchEditionsQuery, searchEditionsSchema, UserEditionInput, userEditionSchema, UserEditionResult, UserEditionService

### Community 78 - "page.tsx"
Cohesion: 0.13
Nodes (24): annotateExisting(), bigrams(), dice(), distSim(), jaccard(), nameSim(), norm(), pct() (+16 more)

### Community 80 - "user-competition.schema.ts"
Cohesion: 0.13
Nodes (14): AddResultInput, addResultSchema, competitionIdParamSchema, GetMyCompetitionsQuery, getMyCompetitionsSchema, GetUserCompetitionsParams, getUserCompetitionsSchema, GlobalRankingParams (+6 more)

### Community 82 - "page.tsx"
Cohesion: 0.39
Nodes (7): base64UrlDecodeToString(), base64UrlToUint8Array(), EdgeTokenPayload, verifyJwtEdge(), config, intlMiddleware, middleware()

### Community 86 - "admin.schema.ts"
Cohesion: 0.14
Nodes (13): DeleteUserInput, deleteUserSchema, getStatsSchema, GetUserByIdInput, getUserByIdSchema, GetUsersInput, getUsersSchema, GetUserStatsInput (+5 more)

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

### Community 92 - "CountrySelect.tsx"
Cohesion: 0.29
Nodes (6): ReorderPhotosInput, reorderPhotosSchema, UpdatePhotoMetadataInput, updatePhotoMetadataSchema, UploadPhotoInput, uploadPhotoSchema

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
Cohesion: 0.06
Nodes (42): POST(), getEntitiesWithoutSEO(), POST(), readAccessTokenPayload(), signAccessToken(), cache, memoryCache, globalForPrisma (+34 more)

### Community 108 - "SearchableEntitySelect.tsx"
Cohesion: 0.14
Nodes (9): NewEventPage(), EventsService, CreateEventData, EventFilters, EventResponse, EventsResponse, EventStatsResponse, RejectEventData (+1 more)

### Community 110 - "participant.schema.ts"
Cohesion: 0.25
Nodes (7): CreateParticipantInput, createParticipantSchema, GetParticipantsQuery, getParticipantsSchema, participantIdSchema, UpdateParticipantInput, updateParticipantSchema

### Community 114 - "useSlugValidation.ts"
Cohesion: 0.38
Nodes (5): SlugInput(), SlugInputProps, SlugValidationResult, useSlugValidation(), UseSlugValidationOptions

### Community 116 - "package.json"
Cohesion: 0.29
Nodes (6): description, engines, node, name, private, version

### Community 117 - "EditionStats.tsx"
Cohesion: 0.25
Nodes (6): apiClientV1, ApiResponse, EventFilters, EventResponseV1, EventsResponseV1, PaginationData

### Community 124 - "FooterService"
Cohesion: 0.40
Nodes (3): FilterState, CompetitionGridSkeleton(), competitionsService

### Community 125 - "export-local.ts"
Cohesion: 0.67
Nodes (3): exportAll(), getCoordinates(), prisma

### Community 127 - "LayoutWrapper.tsx"
Cohesion: 0.15
Nodes (11): archivo, barlow, metadata, IntlProvider(), Props, SHADOW_MAP, SiteStyles, SiteStylesProvider() (+3 more)

### Community 131 - "@types/node"
Cohesion: 0.11
Nodes (19): MagazineCategoryPage(), OrganizerPostsPage(), EditPromotionPage(), PromotionDetailPage(), ArticleCard(), ArticleCardProps, ArticleGrid(), ArticleGridProps (+11 more)

### Community 138 - "EventSelect.tsx"
Cohesion: 0.24
Nodes (5): DELETE(), GET(), PUT(), ServiceService, generateUniqueSlug()

### Community 140 - "clsx"
Cohesion: 0.18
Nodes (11): js-cookie, jsonwebtoken, dependencies, js-cookie, jsonwebtoken, @radix-ui/react-alert-dialog, @radix-ui/react-tabs, @tiptap/react (+3 more)

### Community 143 - "eslint-config-next"
Cohesion: 0.03
Nodes (63): POST(), POST(), GET(), GET(), POST(), GET(), entityAliases, GET() (+55 more)

### Community 152 - "@radix-ui/react-alert-dialog"
Cohesion: 0.20
Nodes (12): POST(), BORDER_RADIUS_OPTIONS, FONT_OPTIONS, SHADOW_OPTIONS, SiteConfig, SiteConfigPage(), ThemePresetService, BUILTIN_PRESETS (+4 more)

### Community 179 - "InsiderBadge.tsx"
Cohesion: 0.13
Nodes (13): EventForm(), EventFormProps, ImageAssignment, ImageImportSelector(), ImageRole, Props, ROLE_COLORS, ROLE_LABELS (+5 more)

### Community 180 - "impersonation.ts"
Cohesion: 0.80
Nodes (3): ImpersonationBar(), getImpersonatedName(), stopImpersonation()

### Community 181 - "LayoutWrapper.tsx"
Cohesion: 0.60
Nodes (4): BACKOFFICE_ROUTES, LayoutWrapper(), LayoutWrapperProps, NO_FOOTER_ROUTES

### Community 182 - "InsiderContext.tsx"
Cohesion: 0.18
Nodes (10): PromotionCategoriesPage(), AdminPromotionsPage(), PromotionCardProps, PromotionFormProps, CreateServiceCategoryInput, ServiceCategory, UpdateServiceCategoryInput, Promotion (+2 more)

### Community 183 - "UserStatsCards.tsx"
Cohesion: 0.19
Nodes (6): PostForm(), PostFormProps, PostsService, CreatePostInput, Post, UpdatePostInput

### Community 185 - "footer.service.ts"
Cohesion: 0.29
Nodes (6): COMMUNITY, EXPLORE, Footer(), FOOTER_EXCLUDED_ROUTES, FooterLink, SOCIAL

### Community 195 - "WeatherCard.tsx"
Cohesion: 0.22
Nodes (9): WeatherCardProps, WeatherDetailProps, WeatherResponse, weatherService, EditionWeather, WEATHER_COLORS, WEATHER_ICONS, WeatherCondition (+1 more)

### Community 197 - "ai-autofill.service.ts"
Cohesion: 0.27
Nodes (12): POST(), autoFillCompetition(), autoFillEvent(), classifyImage(), CompetitionAutoFillResult, EventAutoFillResult, extractImagesFromHtml(), fetchPageContent() (+4 more)

### Community 198 - "fetcher.ts"
Cohesion: 0.26
Nodes (13): classifyImage(), decodeEntities(), extractImages(), fetchContent(), FetchedContent, fetchRendered(), fetchStatic(), htmlToText() (+5 more)

### Community 199 - "page.tsx"
Cohesion: 0.17
Nodes (5): AdminEditButton(), AdminEditButtonFloating(), AdminEditButtonProps, EditionParticipants(), RelatedArticles()

### Community 200 - "page.tsx"
Cohesion: 0.33
Nodes (9): CompetitionDetailPage(), EditionCard(), EditionSelector(), EditionSelectorCompact(), EditionSelectorProps, useCompetition(), useAvailableYears(), useEditionByYear() (+1 more)

### Community 204 - "page.tsx"
Cohesion: 0.20
Nodes (5): EventDetailPage(), getMonthName(), FAQItem, SEOFaqSchema(), SEOFaqSchemaProps

### Community 205 - "page.tsx"
Cohesion: 0.17
Nodes (9): Competition, Edition, EventNode, FetchMode, Graph, MatchInfo, ScanResult, ScraperPage() (+1 more)

### Community 206 - "eventManagers.service.ts"
Cohesion: 0.17
Nodes (7): AddManagerResponse, AvailableOrganizer, AvailableOrganizersResponse, EventManager, EventManagersService, ManagersResponse, RemoveManagerResponse

### Community 209 - "EventManagersPanel.tsx"
Cohesion: 0.24
Nodes (9): EventManagersPanel(), EventManagersPanelProps, SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator (+1 more)

### Community 210 - "editionRating.service.ts"
Cohesion: 0.22
Nodes (9): CreateEditionRatingInput, createEditionRatingSchema, GetRatingsQuery, getRatingsQuerySchema, GetRecentRatingsQuery, getRecentRatingsSchema, ratingSchema, UpdateEditionRatingInput (+1 more)

### Community 211 - "import.service.ts"
Cohesion: 0.18
Nodes (10): ConflictItem, ConflictResolution, EntityType, LANGUAGE_MAPPING, NativeImportFile, NativeImportOptions, NativeImportResult, NativeImportResultItem (+2 more)

### Community 214 - "route.ts"
Cohesion: 0.46
Nodes (6): ALLOWED_CONTENT_TYPES, POST(), assertSafeUrl(), isBlockedIP(), isBlockedIPv4(), isBlockedIPv6()

### Community 215 - "CountrySelect.tsx"
Cohesion: 0.39
Nodes (5): CountrySelect(), CountrySelectProps, COUNTRIES, Country, searchCountries()

### Community 217 - "navigation.ts"
Cohesion: 0.33
Nodes (5): Locale, localeFlags, localeNames, locales, { Link, redirect, usePathname, useRouter }

### Community 219 - "page.tsx"
Cohesion: 0.60
Nodes (4): ORG_COLORS, OrganizersPublicPage(), orgColor(), orgInitials()

## Knowledge Gaps
- **756 isolated node(s):** `CalView`, `CalEdition`, `MONTHS_ES`, `EventMap`, `DashboardLayoutProps` (+751 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **95 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `apiClientV2` connect `index.ts` to `apiSuccess`, `admin.service.ts`, `button.tsx`, `requireAuth`, `@types/node`, `useAuth`, `layout.tsx`, `edition.ts`, `rating.ts`, `page.tsx`, `@radix-ui/react-alert-dialog`, `promotion.ts`, `HomeService`, `events.service.ts`, `email-templates.service.ts`, `InsiderBadge.tsx`, `impersonation.ts`, `InsiderContext.tsx`, `useAuth.ts`, `useAuth`, `WeatherCard.tsx`, `services.service.ts`, `page.tsx`, `SpecialSeries`, `page.tsx`, `eventManagers.service.ts`, `photos.service.ts`, `EventMap.tsx`, `SearchableEntitySelect.tsx`, `EditionStats.tsx`?**
  _High betweenness centrality (0.238) - this node is a cross-community bridge._
- **What connects `CalView`, `CalEdition`, `MONTHS_ES` to the rest of the system?**
  _765 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `apiSuccess` be split into smaller, more focused modules?**
  _Cohesion score 0.09759759759759759 - nodes in this community are weakly interconnected._
- **Should `requireRole` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Should `admin.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.043010752688172046 - nodes in this community are weakly interconnected._
- **Should `button.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1310483870967742 - nodes in this community are weakly interconnected._
- **Should `AdminService` be split into smaller, more focused modules?**
  _Cohesion score 0.038461538461538464 - nodes in this community are weakly interconnected._