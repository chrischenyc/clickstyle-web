function paddingLeft(string, paddingValue) {
  return String(paddingValue + string).slice(-paddingValue.length);
}

const OpenHourString = openHour =>
  `${
    openHour.open
      ? `${openHour.openAtHour}:${paddingLeft(openHour.openAtMinute, '00')} - ${
        openHour.closeAtHour
      }:${paddingLeft(openHour.closeAtMinute, '00')}`
      : 'closed'
  }`;

export default OpenHourString;
