export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new Error('File is empty'), false);

  const fileExtension = file.mimetype.split('/')[1]; //agarro la extension q tenga -> .jpg, .pdf,.png, etc..

  const validExtensions = ['jpg', 'png', 'jpeg', 'gif'];

  if (!validExtensions.includes(fileExtension)) {
    return callback(null, false);
  }

  callback(null, true);
};
