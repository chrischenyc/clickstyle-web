import cloudinary from 'cloudinary';
import log from 'winston';

const deleteCloudinaryFile = (fileURL) => {
  const resourceId = fileURL.split('/').pop();

  cloudinary.v2.api.delete_resources([resourceId], (error) => {
    if (error) {
      log.error(`Unable to delete cloudinary file: ${fileURL} error: ${error}`);
    }
  });
};

export default deleteCloudinaryFile;
