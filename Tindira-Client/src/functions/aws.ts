import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({ region: 'us-east-2' })
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
      return { url: null, error: `Failed to upload ${image.fileName}: ${error.message}` }
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
