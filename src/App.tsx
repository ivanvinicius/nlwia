import { FileVideo, Upload, Wand2 } from 'lucide-react'

import { Header } from './components/Header'
import { Textarea } from './components/ui/textarea'
import { Separator } from './components/ui/separator'
import { Label } from './components/ui/label'
import { Button } from './components/ui/button'
import { Slider } from './components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select'

export function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 gap-6 p-6">
        <aside className="w-80 space-y-6">
          <form className="space-y-6">
            <label
              className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground hover:bg-primary/5"
              htmlFor="video"
            >
              <FileVideo className="h-4 w-4" />
              Selecione um vídeo
            </label>
            <input
              className="sr-only"
              type="file"
              id="video"
              accept="video/mp4"
            />

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="transcription_prompt">
                Prompt de transcrição
              </Label>
              <Textarea
                id="transcription_prompt"
                className="h-20 resize-none leading-relaxed"
                placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula"
              />
            </div>

            <Button type="submit" className="w-full">
              Carregar vídeo
              <Upload className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <Separator />

          <form className="space-y-6">
            <div className="space-y-4">
              <Label>Prompt</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um prompt..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Título para Youtube</SelectItem>
                  <SelectItem value="description">
                    Descrição de vídeo para Youtube
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Modelo</Label>
              <Select defaultValue="gpt3.5" disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs italic text-muted-foreground">
                Você poderá personalizar esta opção em breve
              </span>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Temperatura</Label>
              <Slider min={0} max={1} step={0.1} />
              <span className="block text-xs italic leading-relaxed text-muted-foreground">
                Valorem mais altos tedem a deixar o resultado mais criativo e
                com possíveis erros
              </span>
            </div>

            <Separator />

            <Button className="w-full " type="submit">
              Executar
              <Wand2 className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </aside>

        <div className="flex flex-1 flex-col gap-4">
          <div className="grid flex-1 grid-rows-2 gap-4">
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Inclua o prompt para a IA..."
            />
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Resultado gerado pela IA..."
              readOnly
            />
          </div>

          <p className="text-sm text-muted-foreground ">
            Lembre-se: Você pode utilizar a variável
            <code className="text-green-500"> {`{ transcription }`} </code>
            no seu prompt para adicionar o conteúdo da transcrição do vídeo
            selecionado.
          </p>
        </div>
      </main>
    </div>
  )
}
