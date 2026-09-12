import { useState } from 'react'
import { BookOpen, CircleHelp, Languages, Moon, Music2, Sun, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { HowToUseDialog } from '@/components/dialogs/HowToUseDialog'
import { FifthsTheoryDialog } from '@/components/dialogs/FifthsTheoryDialog'
import { InstallButton } from '@/components/InstallButton'
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
import { Switch } from '@/components/ui/switch'
import { useSettings, type ThemePreference } from '@/context/settings'
import { useInstallPrompt } from '@/hooks/use-install-prompt'
import { SUPPORTED_LANGUAGES, type LanguageCode } from '@/i18n'
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
  } = useSettings()
  const [howtoOpen, setHowtoOpen] = useState(false)
  const [theoryOpen, setTheoryOpen] = useState(false)

  const dark = resolvedTheme === 'dark'
  const { canInstall } = useInstallPrompt()

  const closeSidebar = () => {
    if (isMobile) setOpenMobile(false)
    else setOpen(false)
  }

  return (
    <>
      <Sidebar collapsible="offcanvas" data-testid="app-sidebar">
        <SidebarHeader className="gap-1 px-3 py-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 space-y-1">
              <p className="font-hand text-2xl leading-none">{t('common:app.name')}</p>
              <p className="text-xs text-muted-foreground">{t('common:app.tagline')}</p>
            </div>
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
                  <SidebarMenuButton
                    data-testid="advanced-toggle-menu"
                    isActive={advancedChords}
                    aria-pressed={advancedChords}
                    onClick={() => setAdvancedChords(!advancedChords)}
                  >
                    <Music2 />
                    <span>{t('common:advanced.toggle')}</span>
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
                <SidebarMenuItem>
                  <div className="flex h-8 w-full min-w-0 items-center gap-2 overflow-hidden rounded-md p-2 text-sm">
                    {dark ? <Moon className="size-4 shrink-0" /> : <Sun className="size-4 shrink-0" />}
                    <Label
                      htmlFor="theme-toggle"
                      className="min-w-0 flex-1 truncate font-normal"
                    >
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
                {canInstall ? (
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
            <SidebarGroupContent className="space-y-4 px-2">
              <div className="space-y-1.5">
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

              <div className="space-y-1.5">
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
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <HowToUseDialog open={howtoOpen} onOpenChange={setHowtoOpen} />
      <FifthsTheoryDialog open={theoryOpen} onOpenChange={setTheoryOpen} />
    </>
  )
}
