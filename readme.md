next level week ia

## vite.config.ts

Para não optimizar o tamanho das dependências do ffmpeg

  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
  },