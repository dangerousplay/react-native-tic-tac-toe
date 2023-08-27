import { Stack } from 'expo-router';

import { TicTacToe } from '@/game/tic-tac-toe';

const Home = () => (
  <>
    <Stack.Screen
      options={{
        title: 'My home',
      }}
    />
    <TicTacToe />
  </>
);

export default Home;
