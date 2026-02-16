import api from "./api"

export async function uploadImage(file: File) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("fileName", file.name)

  const privateKey = import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY

  const res = await fetch(
    "https://upload.imagekit.io/api/v1/files/upload",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(privateKey + ":")}`,
      },
      body: formData,
    }
  )

  const data = await res.json()

  const resData={
    url:data.url,
    fileId:data.fileId
  }

  await api.post('/uploads', resData)

  return resData
}


export async function deleteImageDB(url: string) {
    const res = await api.delete('/uploads', {
        data: {
            url: url
        }
    })

    return res.data.data.fileId
}



export async function deleteImage(fileId: string) {
  const privateKey = import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY

  const res = await fetch(
    `https://api.imagekit.io/v1/files/${fileId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${btoa(privateKey + ":")}`,
      },
    }
  )

  return await res.json()
}
