const scaledImageURL = (url, size) => {
  const lastComponent = url.split('/').pop();
  let newLastComponent = lastComponent;

  switch (size) {
    case 'tiny':
      newLastComponent = `c_limit,w_160/${lastComponent}`;
      break;

    case 'small':
      newLastComponent = `c_limit,w_320/${lastComponent}`;
      break;

    case 'medium':
      newLastComponent = `c_limit,w_640/${lastComponent}`;
      break;

    case 'large':
      newLastComponent = `c_limit,w_1280/${lastComponent}`;
      break;

    default:
      break;
  }

  return url.replace(lastComponent, newLastComponent);
};

export default scaledImageURL;
