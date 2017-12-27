import cloudinary from 'cloudinary';

const deleteCloudinaryFile = (fileURL) => {
  const resourceId = fileURL.split('/').pop();

  cloudinary.v2.api.delete_resources([resourceId], (error) => {
    if (error) {
      /* eslint-disable no-console */
      console.error(`Unable to delete cloudinary file: ${fileURL}`);
      console.error(error);
      /* eslint-enable no-console */
    }
  });
};

export default deleteCloudinaryFile;
