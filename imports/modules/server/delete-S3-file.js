import { Meteor } from 'meteor/meteor';
import AWS from 'aws-sdk';

const deleteS3File = (fileURL, callback) => {
  const S3Key = fileURL.replace(Meteor.settings.private.CDN, '');
  const s3 = new AWS.S3();
  const params = {
    Bucket: Meteor.settings.S3Bucket,
    Key: S3Key,
  };

  s3.deleteObject(params, callback);
};

export default deleteS3File;
