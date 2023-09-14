import { Github } from 'lucide-react'
import { Button } from './ui/button'
import { Separator } from './ui/separator'

export function Header() {
  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <h1 className="text-xl font-bold">nlwia</h1>

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          Desenvolvido com 🧡 no NLW da Rocketseat
        </span>

        <Separator orientation="vertical" className="h-6" />

        <Button variant={'outline'}>
          Github
          <Github className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
