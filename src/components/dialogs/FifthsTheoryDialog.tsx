import { useTranslation } from 'react-i18next'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

interface FifthsTheoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface TheorySection {
  heading: string
  body: string
}

export function FifthsTheoryDialog({ open, onOpenChange }: FifthsTheoryDialogProps) {
  const { t } = useTranslation('theory')
  const sections = t('sections', { returnObjects: true }) as TheorySection[]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" data-testid="theory-dialog">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-3">
          <div className="space-y-5 text-sm">
            {sections.map((section) => (
              <section key={section.heading}>
                <h3 className="mb-1 font-medium">{section.heading}</h3>
                <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
