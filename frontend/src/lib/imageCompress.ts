/**
 * Compresses an image file client-side before upload using Canvas.
 * Resizes to max 1600px on the longest side and re-encodes as JPEG
 * at the given quality — typically cuts mobile photo size by 70-90%.
 */
export async function compressImage(file: File, maxDimension = 1600, quality = 0.82): Promise<File> {
  // Skip compression for already-small files or non-standard images
  if (file.size < 300 * 1024) return file

  return new Promise((resolve) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.src = e.target?.result as string
    }

    img.onload = () => {
      let { width, height } = img
      if (width > height && width > maxDimension) {
        height = Math.round((height * maxDimension) / width)
        width = maxDimension
      } else if (height > maxDimension) {
        width = Math.round((width * maxDimension) / height)
        height = maxDimension
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) { resolve(file); return }
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return }
          const compressed = new File([blob], file.name.replace(/\.\w+$/, '.jpg'), {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })
          resolve(compressed.size < file.size ? compressed : file)
        },
        'image/jpeg',
        quality
      )
    }

    img.onerror = () => resolve(file)
    reader.onerror = () => resolve(file)
    reader.readAsDataURL(file)
  })
}
