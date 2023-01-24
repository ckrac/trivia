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
			socket.emit('manager/connect')
			socket.on('manager/connected', ({ players }) => {
				setPlayers(players)
			})

			socket.on('manager/restarted', () => {
				setPlayers([])
			})

			socket.on('player/joined', (payload) => {
				setPlayers((players) => [
					...players,
					...(players.some(({ playerId }) => playerId === payload.playerId)
						? []
						: [{ ...payload, isConnected: true }]),
				])
			})

			socket.on('player/disjoined', (payload) => {
				setPlayers((players) =>
					players.filter((player) => player.playerId !== payload.playerId)
				)
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

		return () => {
			Socket.socket?.disconnect()
		}
	}, [])

	function restartGame() {
		Socket.socket?.emit('manager/restart')
	}

	return {
		players,
		restartGame,
	}
}
