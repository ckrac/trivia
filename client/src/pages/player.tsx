import { usePlayer } from '@/hooks/usePlayer'

export default function Player() {
	const { isConnected, playerId, setPlayerId, join, disjoin } = usePlayer()

	return (
		<>
			<main>
				<h1>{`Player: ${playerId}`}</h1>

				{!isConnected && (
					<>
						<input
							value={playerId}
							onChange={(e) => setPlayerId(e.target.value)}
						/>
						<button disabled={!playerId} onClick={() => playerId && join()}>
							Connect User
						</button>
					</>
				)}

				{isConnected && <button onClick={() => disjoin()}>Reset</button>}
			</main>
		</>
	)
}
