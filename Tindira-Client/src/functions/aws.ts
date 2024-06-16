import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
  }
})
const bucketName = 'tindira'

const getContentType = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase()
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'gif':
      return 'image/gif'
    case 'bmp':
      return 'image/bmp'
    case 'tiff':
    case 'tif':
      return 'image/tiff'
    case 'webp':
      return 'image/webp'
    default:
      return 'application/octet-stream'
  }
}

export type Image = {
  fileName: string
  content: string
}

export const uploadImagesToS3 = async (
  images: Image[],
  bucketUrl: string
): Promise<{ urls: string[]; errors: string[] }> => {
  const uploadPromises = images.map(async (image) => {
    const uniqueImageName = `${Date.now()}-${image.fileName}`
    const params = {
      Bucket: bucketName,
      Key: uniqueImageName,
      Body: image.content,
      ContentType: getContentType(image.fileName)
    }

    try {
      await s3Client.send(new PutObjectCommand(params))
      return {
        url: `https://${bucketName}.s3.${s3Client.config.region}.amazonaws.com/${bucketUrl}/${uniqueImageName}`,
        error: null
      }
    } catch (error: any) {
      const err = `Failed to upload ${image.fileName}: ${error}`
      console.error(err)
      return { url: null, error: err }
    }
  })

  const results = await Promise.all(uploadPromises)

  const urls = results
    .filter((result): result is { url: string; error: null } => result.url !== null)
    .map((result) => result.url)
  const errors = results
    .filter((result): result is { url: null; error: string } => result.error !== null)
    .map((result) => result.error)

  return { urls, errors }
}
