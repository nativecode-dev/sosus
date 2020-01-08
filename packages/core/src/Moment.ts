import moment from 'moment'

export function Moment(
  value: string | number | void | moment.Moment | Date | (string | number)[] | moment.MomentInputObject,
  format?: string | moment.MomentBuiltinFormat | (string | moment.MomentBuiltinFormat)[],
  strict: boolean = false,
): moment.Moment {
  return moment(value, format, strict)
}
