// style
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

const TempFiller = styled.div`
  height: 400px;
  width: 400px;
  background-color: black;
  margin: 1rem;
`;

const HomePage = () => {
  return (
    <div>
      <TempFiller></TempFiller>
      <TempFiller></TempFiller>
      <TempFiller></TempFiller>
      <TempFiller></TempFiller>
    </div>
  );
};

export default HomePage;
