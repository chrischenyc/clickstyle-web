const OpenHourString = openHour =>
  `${openHour.open ? `${openHour.openAt} - ${openHour.closeAt}` : 'closed'}`;

export default OpenHourString;
