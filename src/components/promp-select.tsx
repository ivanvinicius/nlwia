import { useEffect, useState } from 'react'

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './ui/select'
import { api } from '@/lib/axios'

interface Prompts {
  id: string
  title: string
  template: string
}

interface Props {
  onPromptSelected: (template: string) => void
}

export function PromptSelect({ onPromptSelected }: Props) {
  const [prompts, setPrompts] = useState<null | Prompts[]>(null)

  useEffect(() => {
    api.get('/prompts').then((response) => setPrompts(response.data.prompts))
  }, [])

  function handlePromptSelected(promptId: string) {
    const selectedPrompt = prompts?.find((prompt) => prompt.id === promptId)
    if (!selectedPrompt) return
    onPromptSelected(selectedPrompt?.template)
  }

  return (
    <Select onValueChange={handlePromptSelected}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione um prompt..." />
      </SelectTrigger>
      <SelectContent>
        {prompts?.map(({ id, title }) => (
          <SelectItem key={id} value={id}>
            {title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
