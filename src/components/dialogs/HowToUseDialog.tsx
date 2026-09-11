import { useTranslation } from 'react-i18next'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

interface HowToUseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HowToUseDialog({ open, onOpenChange }: HowToUseDialogProps) {
  const { t } = useTranslation('howto')
  const steps = t('steps', { returnObjects: true }) as string[]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" data-testid="howto-dialog">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('intro')}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-3">
          <ol className="list-decimal space-y-3 pl-5 text-sm">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div className="mt-6 space-y-2 text-sm">
            <h3 className="font-medium">{t('keyboard.title')}</h3>
            <p>{t('keyboard.arrows')}</p>
            <p>{t('keyboard.pages')}</p>
            <p>{t('keyboard.homeEnd')}</p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
