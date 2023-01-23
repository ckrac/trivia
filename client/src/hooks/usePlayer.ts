import Socket from '@/lib/Socket'
import { useEffect, useState } from 'react'

function uuid() {
	return (
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15)
	)
}

export const usePlayer = () => {
	const [playerId, setPlayerId] = useState('')

	useEffect(() => {
		Socket.connect((socket) => {
			const playerId = localStorage.getItem('player_id')
			if (playerId) {
				setPlayerId(playerId)
				socket.emit('player/connect', { playerId })
			}
		})
	}, [])

	function join() {
		const playerId = localStorage.getItem('player_id') || uuid()
		Socket.socket?.emit('player/join', { playerId })
		localStorage.setItem('player_id', playerId)
	}

	return {
		playerId,
		setPlayerId,
		join,
	}
}
