import { Share2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { useShareLink } from '@/hooks/use-share-link'

interface ShareButtonProps {
  variant?: 'icon' | 'menu'
}

export function ShareButton({ variant = 'icon' }: ShareButtonProps) {
  const { t } = useTranslation('common')
  const { share, busy } = useShareLink()

  if (variant === 'menu') {
    return (
      <SidebarMenuButton
        data-testid="share-button-menu"
        disabled={busy}
        onClick={() => void share()}
      >
        <Share2 />
        <span>{t('share.open')}</span>
      </SidebarMenuButton>
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      data-testid="share-button-toolbar"
      aria-label={t('share.open')}
      disabled={busy}
      onClick={() => void share()}
    >
      <Share2 className="size-4" />
    </Button>
  )
}
