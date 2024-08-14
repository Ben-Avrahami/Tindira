import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
  }
})
const bucketName = 'tindira'
const imageUrlPrefix = `https://${bucketName}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com`

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

export const uploadImagesToS3 = async (
  images: File[],
  path: string
): Promise<{ urls: string[]; errors: string[] }> => {
  const uploadPromises = images.map(async (image) => {
    const imageKey = `${path}/${Date.now()}-${image.name.replace(/\s+/g, '-')}`
    const params = {
      Bucket: bucketName,
      Key: imageKey,
      Body: image,
      ContentType: getContentType(image.name)
    }

    try {
      await s3Client.send(new PutObjectCommand(params))
      const imageUrl = `${imageUrlPrefix}/${imageKey}`
      return {
        url: imageUrl,
        error: null
      }
    } catch (error: any) {
      const err = `Failed to upload ${image.name}: ${error}`
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

export const deleteImagesFromS3 = async (urls: string[]): Promise<string[]> => {
  const deletePromises = urls.map(async (url) => {
    const key = url.replace(`${imageUrlPrefix}/`, '')
    const params = {
      Bucket: bucketName,
      Key: key
    }

    try {
      await s3Client.send(new DeleteObjectCommand(params))
      return null
    } catch (error: any) {
      const err = `Failed to delete ${key}: ${error}`
      console.error(err)
      return err
    }
  })

  const errors = await Promise.all(deletePromises)
  return errors.filter((error): error is string => error !== null)
}
