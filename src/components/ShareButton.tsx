import { Share2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { useShareLink } from '@/hooks/use-share-link'

interface ShareButtonProps {
  variant?: 'icon' | 'menu'
}

export function ShareButton({ variant = 'icon' }: ShareButtonProps) {
  const { t } = useTranslation('common')
  const { share, busy } = useShareLink()

  if (variant === 'menu') {
    return (
      <Button
        type="button"
        variant="ghost"
        className="w-full justify-start gap-2"
        data-testid="share-button-menu"
        disabled={busy}
        onClick={() => void share()}
      >
        <Share2 className="size-4" />
        {t('share.open')}
      </Button>
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
