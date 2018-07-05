const userProfileLink = (user) => {
  let link = `/users/show/${user.owner}`;

  if (user.name.first) {
    link += `/${user.name.first.toLowerCase()}`;

    if (user.name.last) {
      link += user.name.last.toLowerCase();
    }
  }

  return link;
};

export default userProfileLink;
