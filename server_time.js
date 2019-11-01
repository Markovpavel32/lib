import {ajax_get} from './ajax'
import moment from 'moment'

async function get_server_time () {
  let now = Date.now()
  let saved_server_time = window.$.jStorage.get('vue_server_time', NaN)
  console.log(saved_server_time)
  let updated_at = window.$.jStorage.get('vue_server_time_at')
  let server_time
  if (saved_server_time && updated_at && (updated_at - now) < 60 * 60 * 1000) {
      server_time = saved_server_time + now - updated_at
  } else {
    let result = await ajax_get('/server_time/')
    let data = await result.data
    server_time = data.server_time.as_date().getTime() - new Date().getTimezoneOffset() * 60 * 1000
    if (Math.abs(server_time - now) < 40 * 1000) server_time = now
    window.$.jStorage.set('vue_server_time', server_time, {TTL: 1000 * 60 * 60})
    window.$.jStorage.set('vue_server_time_at', now, {TTL: 1000 * 60 * 60})
    console.log(server_time)
  }

  return server_time
}

async function sync_server_moment () {
  let at = Date.now()
  let server_time = await get_server_time()
  // let tz
  // if (moment(at).date() < moment(server_time).date()) {
  //   tz = moment(server_time).hour() + 12 - (moment(at).hour() - moment(at).utcOffset() / 60)
  // } else if (moment(at).date() > moment(server_time).date()) {
  //   tz = moment(server_time).hour() - 12 - (moment(at).hour() - moment(at).utcOffset() / 60)
  // } else {
  //   tz = moment(server_time).hour() - (moment(at).hour() - moment(at).utcOffset() / 60)
  // }
  moment.now = function () {
    // if (
    //   moment(at).utcOffset(tz).hour() === moment(server_time).hour() ||
    //   moment(at).utcOffset(tz - 12).hour() === moment(server_time).hour() ||
    //   moment(at).utcOffset(tz + 12).hour() === moment(server_time).hour()
    // ) {
    //   return server_time + (moment(at).utcOffset() / 60 - 3) * 60 * 60 * 1000
    // }
    // return +moment(server_time + Date.now() - at).utcOffset(tz, true).format('x')
    return server_time + Date.now() - at
  }
  return server_time
}

export {
  get_server_time,
  sync_server_moment
}
