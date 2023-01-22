import { serve } from 'https://deno.land/std@0.166.0/http/server.ts'
import { Server } from 'https://deno.land/x/socket_io@0.2.0/mod.ts'

const io = new Server({
	cors: {
		origin: ['http://localhost:3000'],
		allowedHeaders: ['my-header'],
		credentials: true,
	},
})

io.on('connection', (socket) => {
	console.log(`socket ${socket.id} connected`)

	socket.emit('hello', 'world')

	socket.on('disconnect', (reason) => {
		console.log(`socket ${socket.id} disconnected due to ${reason}`)
	})

	socket.on('from_client', (args) => {
		console.log('from_client', { args })

		socket.emit('from_server', 'server says hi')
	})
})

await serve(io.handler(), {
	port: 8000,
})
