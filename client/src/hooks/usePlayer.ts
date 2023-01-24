import Socket from '@/lib/Socket'
import { useEffect, useState } from 'react'

export const usePlayer = () => {
	const [playerId, setPlayerId] = useState('')
	const [isConnected, setIsConnected] = useState(false)

	useEffect(() => {
		Socket.connect((socket) => {
			const playerId = localStorage.getItem('player_id')
			if (playerId) connectReturningPlayer(playerId)

			socket.on('player/disjoined', () => onDisjoined())
			socket.on('player/joined', () => onConnected())
			socket.on('player/connected', () => onConnected())
		})

		return () => {
			Socket.socket?.disconnect()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	function connectReturningPlayer(playerId: string) {
		setPlayerId(playerId)
		setIsConnected(true)
		Socket.socket?.emit('player/connect', { playerId })
	}

	function join() {
		Socket.socket?.emit('player/join', { playerId })
		localStorage.setItem('player_id', playerId)
	}

	function disjoin() {
		Socket.socket?.emit('player/disjoin', { playerId })
	}

	function onConnected() {
		setIsConnected(true)
	}

	function onDisjoined() {
		localStorage.removeItem('player_id')
		setIsConnected(false)
		setPlayerId('')
	}

	return {
		isConnected,
		playerId,
		setPlayerId,
		join,
		disjoin,
	}
}
