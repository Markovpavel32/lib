import ReconnectingWebSocket from 'reconnecting-websocket'

class SocketFabric {
  constructor (path) {
    this.path = path
  }

  get_socket () {
    let protocol = ((window.location.protocol === 'https:') ? 'wss://' : 'ws://')
    let host = window.location.host || 'localhost'
    return new ReconnectingWebSocket(`${protocol}${host}/${this.path}`, [], {maxReconnectAttempts: 1, maxRetries: 1})
  }
}

export {SocketFabric}
