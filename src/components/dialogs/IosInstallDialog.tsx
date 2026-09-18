import { useTranslation } from 'react-i18next'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface IosInstallDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function IosInstallDialog({ open, onOpenChange }: IosInstallDialogProps) {
  const { t } = useTranslation('common')
  const steps = t('pwa.install.ios.steps', { returnObjects: true }) as string[]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="ios-install-dialog">
        <DialogHeader>
          <DialogTitle>{t('pwa.install.ios.title')}</DialogTitle>
          <DialogDescription>{t('pwa.install.ios.body')}</DialogDescription>
        </DialogHeader>
        <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <DialogFooter>
          <Button
            type="button"
            data-testid="ios-install-dialog-dismiss"
            onClick={() => onOpenChange(false)}
          >
            {t('pwa.install.ios.gotIt')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
