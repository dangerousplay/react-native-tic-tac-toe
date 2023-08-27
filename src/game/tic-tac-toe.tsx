import { useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

function chunked<T>(array: T[], size: Number): T[][] {
  return array.reduce((all, one, i) => {
    const ch = Math.floor(i / size);
    all[ch] = [].concat(all[ch] || [], one);
    return all;
  }, []);
}

enum Player {
  X = 'X',
  O = 'O',
}

type SlotValue = Player | undefined;

type BoardProps = {
  board: SlotValue[];
  onClick: (i: number) => void;
};

const swapPlayer = (player: Player): Player | undefined => {
  switch (player) {
    case Player.O:
      return Player.X;
    case Player.X:
      return Player.O;
    default:
      return undefined;
  }
};

const Board = ({ board, onClick }: BoardProps) => {
  return (
    <View>
      {chunked(board, 3).map((row, r) => (
        <View className="flex-row">
          {row.map((v, i) => (
            <TouchableOpacity
              className="h-20 w-20 items-center justify-center border-2 border-black"
              key={r * 3 + i}
              onPress={(_) => onClick(r * 3 + i)}
            >
              <Text className="text-6xl">{v || ''}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const emptyBoard = () => Array.from({ length: 9 }, (_a, _b) => null);

const WINNING_POSITIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(board: string[]): Player | undefined {
  return WINNING_POSITIONS.map(([a, b,c]) => {
    const first = board[a];
    if (first && first === board[b] && first === board[c]) {
      return first
    }

    return null;
  }).filter((v) => v)[0];
}

export const TicTacToe = () => {
  const [board, setBoard] = useState(
      emptyBoard()
  );
  const [currentPlayer, setCurrentPlayer] = useState(Player.O);

  const [winners, setWinners] = useState({
    X: 0,
    O: 0,
  });

  const winnersRef = useRef(winners);
  winnersRef.current = winners;

  const boardRef = useRef(board);
  boardRef.current = board;

  const playerRef = useRef(currentPlayer);
  playerRef.current = currentPlayer;

  return (
    <View className="items-center pt-10">
      <Text className="mb-10 text-2xl font-bold">
        Player atual: {currentPlayer}
      </Text>
      <Board
        board={board}
        onClick={(i) => {
          const value = boardRef.current[i];

          if (value) return;

          board[i] = playerRef.current;

          const winner = calculateWinner(board);

          if (winner) {
            winnersRef.current[winner] += 1;
            setWinners(winners);
            setBoard(emptyBoard());
          } else {
            setBoard(board);
          }

          setCurrentPlayer(swapPlayer(playerRef.current));
        }}
      />

      <View className="mt-10">
        <Text className="text-2xl font-bold">Placar</Text>
        {Object.keys(winners).map((w) => (
          <Text key={w} className="text-2xl font-bold">
            {w}: {winners[w]}
          </Text>
        ))}
      </View>
    </View>
  );
};
