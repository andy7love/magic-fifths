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
  const usingSteps = t('using.steps', { returnObjects: true }) as string[]
  const ways = t('ways.items', { returnObjects: true }) as string[]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" data-testid="howto-dialog">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('intro')}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-3">
          <section className="space-y-3">
            <h3 className="font-medium">{t('ways.title')}</h3>
            <ol className="list-decimal space-y-3 pl-5 text-sm">
              {ways.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>
          <section className="mt-6 space-y-3">
            <h3 className="font-medium">{t('using.title')}</h3>
            <ol className="list-decimal space-y-3 pl-5 text-sm">
              {usingSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
