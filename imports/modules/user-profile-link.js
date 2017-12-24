const userProfileLink = user =>
  `/users/show/${user.owner}/${user.name.first.toLowerCase()}${user.name.last.toLowerCase()}`;

export default userProfileLink;
