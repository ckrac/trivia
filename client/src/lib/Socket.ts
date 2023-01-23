import io, { Socket as SocketIO } from 'socket.io-client'

const hostname = 'localhost'
const wsPort = '8000'
const endpoint = `ws://${hostname}:${wsPort}`

type PlayerIdPayload = { playerId: string }
type ConnectedPlayersPayload = { players: PlayerIdPayload[] }

interface ServerToClientEvents {
	'manager/connected': (payload: ConnectedPlayersPayload) => void
	'player/connected': (payload: PlayerIdPayload) => void
	'player/joined': (payload: PlayerIdPayload) => void
	'player/disconnected': (payload: PlayerIdPayload) => void
}

interface ClientToServerEvents {
	'manager/connect': () => void
	'player/connect': (payload: PlayerIdPayload) => void
	'player/join': (payload: PlayerIdPayload) => void
}

type TypedSocketIO = SocketIO<ServerToClientEvents, ClientToServerEvents>

class _Socket {
	public socket?: TypedSocketIO

	public connect(onConnected: (socket: TypedSocketIO) => void) {
		if (this.socket?.connected) return

		this.socket = io(endpoint)

		this.socket.on('connect', () => {
			if (this.socket?.connected) onConnected(this.socket)
		})
	}
}

const Socket = new _Socket()

export default Socket
