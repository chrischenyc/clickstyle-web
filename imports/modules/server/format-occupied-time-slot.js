import moment from 'moment';
import { dateTimeString } from '../format-date';

export default function formatOccupiedTimeSlot(timeslot) {
  const fromTimeString = dateTimeString(moment(timeslot.from.toString(), 'YYMMDDHHmm'));
  const toTimeString = dateTimeString(moment(timeslot.to.toString(), 'YYMMDDHHmm'));
  let state = timeslot.state;
  if (state !== 'booked') {
    state = 'closed';
  }

  return `${fromTimeString} - ${toTimeString} ${state}`;
}
