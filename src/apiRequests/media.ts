import http from "@/lib/http";
import { UploadImageResType } from "@/schemaValidations/media.schema";

export const mediaApiRequest = {
    upload: (FormData: FormData) => http.post<UploadImageResType>('/media/upload', FormData)
}