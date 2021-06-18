import React from "react";

import styled from "@emotion/styled";

const AppContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.main};
`;

function App() {
  return (
    <AppContainer className="App">
      <header className="App-header">Hello</header>
    </AppContainer>
  );
}

export default App;
