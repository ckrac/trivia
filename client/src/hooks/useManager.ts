import Socket from '@/lib/Socket'
import { useEffect, useState } from 'react'

type Player = {
	playerId: string
	isConnected?: boolean
}

export const useManager = () => {
	const [players, setPlayers] = useState<Player[]>([])

	useEffect(() => {
		Socket.connect((socket) => {
			console.log('x')
			console.log('x')
			console.log('connected >>>>>>>>>', socket.id)
			console.log('Socket.socket?.id', Socket.socket?.id)
			console.log('x')
			console.log('x')
			console.log('x')

			socket.emit('manager/connect')
			socket.on('manager/connected', ({ players }) => {
				console.log('x')
				console.log('x')
				console.log('manager/connected >>>>>>>>>>', players)
				setPlayers(players)
				console.log('x')
				console.log('x')
			})

			socket.on('player/joined', (payload) => {
				setPlayers((players) => [
					...players,
					...(players.some(({ playerId }) => playerId === payload.playerId)
						? []
						: [{ ...payload, isConnected: true }]),
				])
			})

			socket.on('player/connected', ({ playerId }) => {
				setPlayers((players) =>
					players.map((player) => {
						if (player.playerId === playerId) {
							player.isConnected = true
						}
						return player
					})
				)
			})

			socket.on('player/disconnected', ({ playerId }) => {
				setPlayers((players) =>
					players.map((player) => {
						if (player.playerId === playerId) {
							player.isConnected = false
						}
						return player
					})
				)
			})
		})
	}, [])

	return {
		players,
	}
}
