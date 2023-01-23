import { serve } from 'https://deno.land/std@0.166.0/http/server.ts'
import { Server } from 'https://deno.land/x/socket_io@0.2.0/mod.ts'

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

const io = new Server<ClientToServerEvents, ServerToClientEvents>({
	cors: {
		origin: ['http://localhost:3000'],
		allowedHeaders: ['my-header'],
		credentials: true,
	},
})

type Player = {
	socketId: string
	playerId: string
	isConnected: boolean
}

let players: Player[] = []

let managerSocketId: string

io.on('connection', (socket) => {
	console.log(`socket ${socket.id} connected`)

	socket.on('manager/connect', () => {
		console.log('x')
		console.log('x')
		console.log('x')
		console.log('manager/connect')
		console.log('socket.id', socket.id)
		console.log('players', players)
		console.log('x')
		console.log('x')
		console.log('x')
		console.log('x')

		managerSocketId = socket.id
		socket.emit('manager/connected', { players })
	})

	socket.on('disconnect', () => {
		console.log('x')
		console.log('x')
		console.log('x')
		console.log('disconnect')

		const player = players.find((player) => player.socketId === socket.id)

		console.log('player', player)
		console.log('x')
		console.log('x')
		console.log('x')
		if (!player) return

		players = players.map((player) => {
			if (player.socketId === socket.id) {
				player.isConnected = false
			}
			return player
		})

		io.to(managerSocketId).emit('player/disconnected', {
			playerId: player.playerId,
		})
	})

	socket.on('player/join', (payload) => {
		console.log('x')
		console.log('x')
		console.log('x')
		console.log('player/join')
		console.log('payload', payload)
		console.log('players', players)
		console.log('socket.id', socket.id)
		console.log('managerSocketId', managerSocketId)

		players = [
			...players,
			...(players.some(({ playerId }) => playerId === payload.playerId)
				? []
				: [{ ...payload, socketId: socket.id, isConnected: true }]),
		]

		console.log('newPlayers', players)
		console.log('x')
		console.log('x')
		console.log('x')
		console.log('x')

		if (managerSocketId) {
			io.to(managerSocketId).emit('player/joined', {
				...payload,
			})
		}
	})

	socket.on('player/connect', (payload) => {
		console.log('x')
		console.log('x')
		console.log('x')
		console.log('player/join')
		console.log('payload', payload)
		console.log('players', players)
		console.log('socket.id', socket.id)
		console.log('managerSocketId', managerSocketId)
		console.log('x')
		console.log('x')
		console.log('x')
		console.log('x')

		players = players.map((player) => {
			if (player.playerId === payload.playerId) {
				player.isConnected = true
				player.socketId = socket.id
			}
			return player
		})

		if (managerSocketId) {
			io.to(managerSocketId).emit('player/connected', payload)
		}
	})
})

await serve(io.handler(), {
	port: 8000,
})
