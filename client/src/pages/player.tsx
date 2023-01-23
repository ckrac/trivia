import { usePlayer } from '@/hooks/usePlayer'

export default function Player() {
	const { playerId, setPlayerId, join } = usePlayer()

	return (
		<>
			<main>
				<h1>{`Player: ${playerId}`}</h1>
				<button onClick={() => join()}>Connect User</button>
			</main>
		</>
	)
}
