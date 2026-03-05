import multer from "multer";

const upload = multer({ dest: "uploads/" });

export const uploadImage = upload.array("image", 10);
