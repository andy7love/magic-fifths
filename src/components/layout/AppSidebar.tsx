import { useState } from 'react'
import { AudioLines, BookOpen, CircleHelp, Languages, Moon, Music2, Sun, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { HowToUseDialog } from '@/components/dialogs/HowToUseDialog'
import { FifthsTheoryDialog } from '@/components/dialogs/FifthsTheoryDialog'
import { InstallButton } from '@/components/InstallButton'
import {
  DegreeIcon,
  EnharmonicMark,
  GradeNameIcon,
  LetterNotationIcon,
  NoteCountIcon,
  enharmonicSuggestClass,
} from '@/components/layout/ChromeIcons'
import { ShareButton } from '@/components/ShareButton'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { useSettings, type ThemePreference } from '@/context/settings'
import { useEnharmonicSeek } from '@/hooks/use-enharmonic-seek'
import { useInstallPrompt } from '@/hooks/use-install-prompt'
import { cn } from '@/lib/utils'
import { SUPPORTED_LANGUAGES, type LanguageCode } from '@/i18n'
import { APP_VERSION, ARPEGGIO_MS } from '@/lib/config'
import { SCALES } from '@/lib/music/scales'

export function AppSidebar() {
  const { t } = useTranslation(['common', 'music'])
  const { setOpen, setOpenMobile, isMobile } = useSidebar()
  const {
    setTheme,
    language,
    setLanguage,
    scaleId,
    setScaleId,
    resolvedTheme,
    advancedChords,
    setAdvancedChords,
    showTriads,
    setShowTriads,
    showTetrads,
    setShowTetrads,
    showGrades,
    setShowGrades,
    showGradeNames,
    setShowGradeNames,
    notation,
    setNotation,
    playbackStyle,
    setPlaybackStyle,
    arpeggioMs,
    setArpeggioMs,
  } = useSettings()
  const { canSeekEnharmonic, suggestEnharmonic, seek } = useEnharmonicSeek()
  const [howtoOpen, setHowtoOpen] = useState(false)
  const [theoryOpen, setTheoryOpen] = useState(false)

  const dark = resolvedTheme === 'dark'
  const { canInstall, canOpen, needsIosInstallHelp } = useInstallPrompt()

  const closeSidebar = () => {
    if (isMobile) setOpenMobile(false)
    else setOpen(false)
  }

  return (
    <>
      <Sidebar collapsible="offcanvas" data-testid="app-sidebar">
        <SidebarHeader className="px-3 py-3">
          <div className="flex items-center justify-between gap-2">
            <p className="font-hand text-2xl leading-none">{t('common:app.name')}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 shrink-0"
              data-testid="sidebar-close"
              aria-label={t('common:sidebar.closeMenu')}
              onClick={closeSidebar}
            >
              <X className="size-4" />
            </Button>
          </div>
        </SidebarHeader>

        <SidebarContent className="overflow-x-hidden overflow-y-auto">
          {/* Same actions as the collapsed toolbar rail, in the same order, so
              opening the drawer teaches which icon is which. */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <div className="flex h-8 w-full min-w-0 items-center gap-2 overflow-hidden rounded-md p-2 text-sm">
                    <NoteCountIcon count={3} />
                    <Label
                      htmlFor="triads-toggle-menu"
                      className="min-w-0 flex-1 truncate font-normal"
                    >
                      {t('common:display.triads')}
                    </Label>
                    <Switch
                      id="triads-toggle-menu"
                      data-testid="triads-toggle-menu"
                      checked={showTriads}
                      onCheckedChange={setShowTriads}
                    />
                  </div>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <div className="flex h-8 w-full min-w-0 items-center gap-2 overflow-hidden rounded-md p-2 text-sm">
                    <NoteCountIcon count={4} />
                    <Label
                      htmlFor="tetrads-toggle-menu"
                      className="min-w-0 flex-1 truncate font-normal"
                    >
                      {t('common:display.tetrads')}
                    </Label>
                    <Switch
                      id="tetrads-toggle-menu"
                      data-testid="tetrads-toggle-menu"
                      checked={showTetrads}
                      onCheckedChange={setShowTetrads}
                    />
                  </div>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <div className="flex h-8 w-full min-w-0 items-center gap-2 overflow-hidden rounded-md p-2 text-sm">
                    <DegreeIcon />
                    <Label
                      htmlFor="grades-toggle-menu"
                      className="min-w-0 flex-1 truncate font-normal"
                    >
                      {t('common:display.grades')}
                    </Label>
                    <Switch
                      id="grades-toggle-menu"
                      data-testid="grades-toggle-menu"
                      checked={showGrades}
                      onCheckedChange={setShowGrades}
                    />
                  </div>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <div
                    className={cn(
                      'flex h-8 w-full min-w-0 items-center gap-2 overflow-hidden rounded-md p-2 text-sm',
                      !showGrades && 'opacity-50',
                    )}
                  >
                    <GradeNameIcon />
                    <Label
                      htmlFor="grade-names-toggle"
                      className="min-w-0 flex-1 truncate font-normal"
                    >
                      {t('common:display.gradeNames')}
                    </Label>
                    <Switch
                      id="grade-names-toggle"
                      data-testid="grade-names-toggle"
                      checked={showGradeNames}
                      disabled={!showGrades}
                      className={!showGrades ? 'disabled:opacity-100' : undefined}
                      onCheckedChange={setShowGradeNames}
                    />
                  </div>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <div className="flex h-8 w-full min-w-0 items-center gap-2 overflow-hidden rounded-md p-2 text-sm">
                    <LetterNotationIcon />
                    <Label
                      htmlFor="notation-toggle"
                      className="min-w-0 flex-1 truncate font-normal"
                    >
                      {t('common:notation.letter')}
                    </Label>
                    <Switch
                      id="notation-toggle"
                      data-testid="notation-toggle"
                      checked={notation === 'letter'}
                      onCheckedChange={(checked) => setNotation(checked ? 'letter' : 'solfege')}
                    />
                  </div>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <div className="flex h-8 w-full min-w-0 items-center gap-2 overflow-hidden rounded-md p-2 text-sm">
                    <Music2 className="size-4 shrink-0" />
                    <Label
                      htmlFor="advanced-toggle-menu"
                      className="min-w-0 flex-1 truncate font-normal"
                    >
                      {t('common:advanced.toggle')}
                    </Label>
                    <Switch
                      id="advanced-toggle-menu"
                      data-testid="advanced-toggle-menu"
                      checked={advancedChords}
                      onCheckedChange={setAdvancedChords}
                    />
                  </div>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={cn(suggestEnharmonic && enharmonicSuggestClass)}
                    data-testid="enharmonic-seek-menu"
                    data-suggest={suggestEnharmonic ? 'true' : 'false'}
                    disabled={!canSeekEnharmonic}
                    aria-disabled={!canSeekEnharmonic}
                    aria-label={
                      suggestEnharmonic
                        ? `${t('common:enharmonic.menu')}. ${t('common:enharmonic.suggest')}`
                        : undefined
                    }
                    onClick={() => {
                      if (seek()) closeSidebar()
                    }}
                  >
                    <EnharmonicMark suggest={suggestEnharmonic} />
                    <span>{t('common:enharmonic.menu')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <ShareButton variant="menu" />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    data-testid="howto-open"
                    onClick={() => setHowtoOpen(true)}
                  >
                    <CircleHelp />
                    <span>{t('common:howto.open')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    data-testid="theory-open"
                    onClick={() => setTheoryOpen(true)}
                  >
                    <BookOpen />
                    <span>{t('common:theory.open')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {canInstall || canOpen || needsIosInstallHelp ? (
                  <SidebarMenuItem>
                    <InstallButton variant="menu" />
                  </SidebarMenuItem>
                ) : null}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>{t('common:sidebar.settings')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <div className="flex h-8 w-full min-w-0 items-center gap-2 overflow-hidden rounded-md p-2 text-sm">
                    {dark ? (
                      <Moon className="size-4 shrink-0" />
                    ) : (
                      <Sun className="size-4 shrink-0" />
                    )}
                    <Label htmlFor="theme-toggle" className="min-w-0 flex-1 truncate font-normal">
                      {t('common:theme.label')}
                    </Label>
                    <Switch
                      id="theme-toggle"
                      data-testid="theme-toggle"
                      checked={dark}
                      onCheckedChange={(checked) => {
                        const next: ThemePreference = checked ? 'dark' : 'light'
                        setTheme(next)
                      }}
                    />
                  </div>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <div className="flex h-8 w-full min-w-0 items-center gap-2 overflow-hidden rounded-md p-2 text-sm">
                    <AudioLines className="size-4 shrink-0" />
                    <Label
                      htmlFor="playback-arpeggio"
                      className="min-w-0 flex-1 truncate font-normal"
                    >
                      {t('common:playback.arpeggiate')}
                    </Label>
                    <Switch
                      id="playback-arpeggio"
                      data-testid="playback-arpeggio"
                      checked={playbackStyle === 'arpeggio'}
                      onCheckedChange={(checked) =>
                        setPlaybackStyle(checked ? 'arpeggio' : 'chord')
                      }
                    />
                  </div>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <div className="flex w-full min-w-0 flex-col gap-2 overflow-hidden rounded-md p-2 text-sm">
                    <Label id="arpeggio-speed-label" htmlFor="arpeggio-speed">
                      {t('common:playback.speed')}
                    </Label>
                    <Slider
                      id="arpeggio-speed"
                      data-testid="arpeggio-speed"
                      aria-label={t('common:playback.speed')}
                      aria-labelledby="arpeggio-speed-label"
                      min={ARPEGGIO_MS.min}
                      max={ARPEGGIO_MS.max}
                      step={ARPEGGIO_MS.step}
                      value={[ARPEGGIO_MS.min + ARPEGGIO_MS.max - arpeggioMs]}
                      onValueChange={(value) => {
                        const next = value[0]
                        if (next !== undefined) {
                          setArpeggioMs(Math.round(ARPEGGIO_MS.min + ARPEGGIO_MS.max - next))
                        }
                      }}
                    />
                  </div>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <div className="flex w-full min-w-0 flex-col gap-2 overflow-hidden rounded-md p-2 text-sm">
                    <Label htmlFor="scale-select">{t('common:scale.label')}</Label>
                    <Select
                      value={scaleId}
                      onValueChange={(value) => {
                        if (value) setScaleId(value)
                      }}
                    >
                      <SelectTrigger id="scale-select" data-testid="scale-select" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SCALES.map((scale) => (
                          <SelectItem
                            key={scale.id}
                            value={scale.id}
                            disabled={!scale.available}
                          >
                            {t(`music:scales.${scale.id}` as 'music:scales.major')}
                            {!scale.available ? ` (${t('common:scale.comingSoon')})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <div className="flex w-full min-w-0 flex-col gap-2 overflow-hidden rounded-md p-2 text-sm">
                    <Label htmlFor="language-select">{t('common:language.label')}</Label>
                    <Select
                      value={language}
                      onValueChange={(value) => {
                        if (value) setLanguage(value as LanguageCode)
                      }}
                    >
                      <SelectTrigger
                        id="language-select"
                        data-testid="language-select"
                        className="w-full"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPORTED_LANGUAGES.map((option) => (
                          <SelectItem key={option.code} value={option.code}>
                            <span className="inline-flex items-center gap-2">
                              <Languages className="size-3.5" />
                              {option.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="px-3 py-3">
          <p
            className="text-xs text-muted-foreground"
            data-testid="app-version"
          >
            {t('common:app.version', { version: APP_VERSION })}
          </p>
        </SidebarFooter>
      </Sidebar>

      <HowToUseDialog open={howtoOpen} onOpenChange={setHowtoOpen} />
      <FifthsTheoryDialog open={theoryOpen} onOpenChange={setTheoryOpen} />
    </>
  )
}
