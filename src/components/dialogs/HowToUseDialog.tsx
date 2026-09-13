import { useTranslation } from 'react-i18next'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

interface HowToUseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface WaysSection {
  heading: string
  body: string
  example?: string
}

export function HowToUseDialog({ open, onOpenChange }: HowToUseDialogProps) {
  const { t } = useTranslation('howto')
  const usingSteps = t('using.steps', { returnObjects: true }) as string[]
  const waysSections = t('ways.sections', { returnObjects: true }) as WaysSection[]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" data-testid="howto-dialog">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-3">
          <section className="space-y-4">
            <h3 className="font-medium">{t('ways.title')}</h3>
            <div className="space-y-4 text-sm">
              {waysSections.map((section) => (
                <div key={section.heading}>
                  <h4 className="mb-1 font-medium">{section.heading}</h4>
                  <p className="text-muted-foreground leading-relaxed">{section.body}</p>
                  {section.example ? (
                    <p className="mt-2 text-muted-foreground leading-relaxed italic">
                      {section.example}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
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
