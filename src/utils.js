const dateUnits = ['year', 'month', 'date'];
const timeUnits = ['hour', 'minute', 'second', 'millisecond'];

export function copyDate(target, source) {
  dateUnits.forEach(unit => target[unit](source[unit]()));
  return target;
}

export function copyTime(target, source) {
  timeUnits.forEach(unit => target[unit](source[unit]()));
  return target;
}

export function copyWithZeroTime(target, source) {
  return target.set(source.toObject()).startOf('day');
}

export function isExcluded(exclude, m) {
  if (exclude) {
    if (exclude.some(x => m.isSame(x))) {
      return true;
    }
  }
  return false;
}

export function isInRange(min, max, m) {
  if (min && max) {
    return m.isBetween(min, max, null, '[]');
  }

  if (min) {
    return m.isSameOrAfter(min);
  }

  if (max) {
    return m.isSameOrBefore(max);
  }
  return true;
}

export function fitRange(min, max, value) {
  return Math.min(max, Math.max(min, value));
}