import { serve } from 'https://deno.land/std@0.166.0/http/server.ts'
import { Server } from 'https://deno.land/x/socket_io@0.2.0/mod.ts'
import { Application } from 'https://deno.land/x/oak@v11.1.0/mod.ts'

const app = new Application()
app.use((ctx) => {
	const { pathname } = ctx.request.url

	if (pathname === '/ping') ctx.response.body = 'pong'
})

type PlayerIdPayload = { playerId: string }
type ConnectedPlayersPayload = { players: PlayerIdPayload[] }

interface ServerToClientEvents {
	'manager/connected': (payload: ConnectedPlayersPayload) => void
	'manager/restarted': () => void
	'player/connected': (payload: PlayerIdPayload) => void
	'player/joined': (payload: PlayerIdPayload) => void
	'player/disjoined': (payload: PlayerIdPayload) => void
	'player/disconnected': (payload: PlayerIdPayload) => void
}

interface ClientToServerEvents {
	'manager/connect': () => void
	'manager/restart': () => void
	'player/connect': (payload: PlayerIdPayload) => void
	'player/join': (payload: PlayerIdPayload) => void
	'player/disjoin': (payload: PlayerIdPayload) => void
}

const io = new Server<ClientToServerEvents, ServerToClientEvents>({
	cors: {
		allowedHeaders: ['Access-Control-Allow-Origin'],
		origin: ['http://localhost:3000', 'https://trivia-ckrac.vercel.app'],
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
	socket.on('manager/connect', () => {
		managerSocketId = socket.id
		console.log('manager/connect', managerSocketId)
		socket.emit('manager/connected', { players })
	})

	socket.on('manager/restart', () => {
		players = []
		io.emit('manager/restarted')
	})

	socket.on('disconnect', () => {
		const player = players.find((player) => player.socketId === socket.id)
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
		players = [
			...players,
			...(players.some(({ playerId }) => playerId === payload.playerId)
				? []
				: [{ ...payload, socketId: socket.id, isConnected: true }]),
		]

		io.to([socket.id, managerSocketId]).emit('player/joined', {
			...payload,
		})
	})

	socket.on('player/disjoin', (payload) => {
		players = players.filter((player) => player.playerId !== payload.playerId)

		io.to([socket.id, managerSocketId]).emit('player/disjoined', payload)
	})

	socket.on('player/connect', (payload) => {
		players = players.map((player) => {
			if (player.playerId === payload.playerId) {
				player.isConnected = true
				player.socketId = socket.id
			}
			return player
		})

		io.to([socket.id, managerSocketId]).emit('player/connected', payload)
	})
})

const handler = io.handler(async (req) => {
	return (await app.handle(req)) || new Response(null, { status: 404 })
})

await serve(handler, {
	port: 8000,
})
