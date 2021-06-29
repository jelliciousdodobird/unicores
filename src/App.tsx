// styling:
import { css, jsx, Theme } from "@emotion/react";
import styled from "@emotion/styled";

// routing
import { BrowserRouter, Switch, Route, Redirect, Link } from "react-router-dom";

// navigation
import TopNavigationBar from "./components/TopNavigationBar";
import SideNavigationBar from "./components/SideNavigationBar";

import ScheduleResultList from "./components/SceduleResultList";

// pages
import HomePage from "./pages/HomePage";

// temporary
import Test from "./pages/Test";

const AppContainer = styled.div`
  overflow: hidden;
  width: 100%;

  background-color: ${({ theme }) => theme.colors.background.main};

  display: flex;
  flex-flow: column nowrap;
`;
const PageContainer = styled.div`
  overflow: hidden;
  height: 100%;

  display: flex;
  flex-flow: row nowrap;
`;

const ContentContainer = styled.div`
  overflow: auto;
  width: 100%;
`;

export interface Position {
  top: number;
  height: number;
}

const App = () => {
  return (
    <AppContainer>
      <BrowserRouter>
        <TopNavigationBar></TopNavigationBar>
        <PageContainer>
          <SideNavigationBar></SideNavigationBar>
          <ContentContainer>
            <Switch>
              <Route path="/home" component={HomePage} />
              <Route path="/schedule" component={ScheduleResultList} />
              <Route path="/test" component={Test} />
            </Switch>
          </ContentContainer>
        </PageContainer>
        {/* <ScheduleResultList /> */}
      </BrowserRouter>
    </AppContainer>
  );
};

export default App;
