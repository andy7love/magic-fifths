import { useState } from 'react'
import { BookOpen, CircleHelp, Languages, Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { HowToUseDialog } from '@/components/dialogs/HowToUseDialog'
import { FifthsTheoryDialog } from '@/components/dialogs/FifthsTheoryDialog'
import { ShareButton } from '@/components/ShareButton'
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
} from '@/components/ui/sidebar'
import { Switch } from '@/components/ui/switch'
import { useSettings, type ThemePreference } from '@/context/settings'
import { SUPPORTED_LANGUAGES, type LanguageCode } from '@/i18n'
import { SCALES } from '@/lib/music/scales'

export function AppSidebar() {
  const { t } = useTranslation(['common', 'music'])
  const { theme, setTheme, language, setLanguage, scaleId, setScaleId, resolvedTheme } =
    useSettings()
  const [howtoOpen, setHowtoOpen] = useState(false)
  const [theoryOpen, setTheoryOpen] = useState(false)

  const dark = resolvedTheme === 'dark'

  return (
    <>
      <Sidebar collapsible="offcanvas" data-testid="app-sidebar">
        <SidebarHeader className="gap-1 px-3 py-4">
          <p className="font-hand text-2xl leading-none">{t('common:app.name')}</p>
          <p className="text-xs text-muted-foreground">{t('common:app.tagline')}</p>
        </SidebarHeader>

        <SidebarContent>
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

              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="theme-toggle" className="inline-flex items-center gap-2">
                  {dark ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
                  {t('common:theme.label')}
                </Label>
                <Switch
                  id="theme-toggle"
                  data-testid="theme-toggle"
                  checked={dark}
                  onCheckedChange={(checked) => {
                    const next: ThemePreference = checked ? 'dark' : 'light'
                    // Preserve 'system' only when the user hasn't chosen yet; a
                    // deliberate toggle always pins light/dark.
                    setTheme(theme === 'system' ? next : next)
                  }}
                />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>{t('common:sidebar.learn')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
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
                  <ShareButton variant="menu" />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <HowToUseDialog open={howtoOpen} onOpenChange={setHowtoOpen} />
      <FifthsTheoryDialog open={theoryOpen} onOpenChange={setTheoryOpen} />
    </>
  )
}
