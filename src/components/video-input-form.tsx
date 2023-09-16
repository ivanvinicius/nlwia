import { ChangeEvent, useState, useMemo, FormEvent, useRef } from 'react'
import { FileVideo, Upload } from 'lucide-react'

import { Separator } from './ui/separator'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { loadFFmpeg } from '@/lib/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import { api } from '@/lib/axios'

interface Props {
  onVideoUploaded: (id: string) => void
}

type Status =
  | 'waiting'
  | 'converting'
  | 'uploading'
  | 'transcribing'
  | 'success'

const statusMessage = {
  converting: 'Convertendo...',
  uploading: 'Fazendo upload...',
  transcribing: 'Transcrevendo...',
  success: 'Sucesso!',
}

export function VideoInputForm({ onVideoUploaded }: Props) {
  const [status, setStatus] = useState<Status>('waiting')
  const [videoFile, setVideoFile] = useState<null | File>(null)
  const promptInputRef = useRef<null | HTMLTextAreaElement>(null)
  const disableActions = status !== 'waiting' && status !== 'success'

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget
    if (!files) return
    setVideoFile(files[0])
  }

  async function convertVideoToAudio(video: File) {
    const ffmpeg = await loadFFmpeg()

    await ffmpeg.writeFile('input.mp4', await fetchFile(video))

    ffmpeg.on('progress', ({ progress }) => {
      console.log(`Convertion progress: ${Math.round(progress * 100)}`)
    })

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame',
      'output.mp3',
    ])

    const data = await ffmpeg.readFile('output.mp3')
    const audioFileBlob = new Blob([data], { type: 'audio/mp3' })
    const audioFile = new File([audioFileBlob], 'output.mp3', {
      type: 'audio/mpeg',
    })

    return audioFile
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const prompt = promptInputRef.current?.value

    if (!videoFile) return

    setStatus('converting')
    const audioFile = await convertVideoToAudio(videoFile)

    const data = new FormData()
    data.append('file', audioFile)

    setStatus('uploading')
    const response = await api.post('/videos', data)
    const videoId = response.data.video.id

    setStatus('transcribing')
    await api.post(`/videos/${videoId}/transcription`, { prompt })

    setStatus('success')
    onVideoUploaded(videoId)
  }

  const previewURL = useMemo(() => {
    if (!videoFile) return null

    return URL.createObjectURL(videoFile)
  }, [videoFile])

  return (
    <form className="space-y-6" onSubmit={handleUploadVideo}>
      <label
        className="relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-md border border-dashed text-sm text-muted-foreground hover:bg-primary/5"
        htmlFor="video"
      >
        {previewURL ? (
          <video
            className="pointer-events-none absolute inset-0"
            src={previewURL}
            controls={false}
          />
        ) : (
          <>
            <FileVideo className="h-4 w-4" />
            Selecione um vídeo
          </>
        )}
      </label>
      <input
        className="sr-only"
        type="file"
        id="video"
        accept="video/mp4"
        onChange={handleFileSelected}
      />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
        <Textarea
          className="h-20 resize-none leading-relaxed"
          ref={promptInputRef}
          id="transcription_prompt"
          disabled={disableActions}
          placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula"
        />
      </div>

      <Button
        data-success={status === 'success'}
        className="w-full data-[success=true]:bg-green-500"
        type="submit"
        disabled={disableActions}
      >
        {status === 'waiting' ? (
          <>
            Carregar vídeo
            <Upload className="ml-2 h-4 w-4" />
          </>
        ) : (
          statusMessage[status]
        )}
      </Button>
    </form>
  )
}
