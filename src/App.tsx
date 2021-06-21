// styling:
import { css, jsx, Theme } from "@emotion/react";
import styled from "@emotion/styled";

import ScheduleResultList from "./components/SceduleResultList";

const AppContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.main};
  overflow: auto;
`;

export interface Position {
  top: number;
  height: number;
}

const App = () => {
  return (
    <AppContainer>
      <ScheduleResultList />
    </AppContainer>
  );
};

export default App;
