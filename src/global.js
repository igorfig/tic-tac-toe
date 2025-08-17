import { createGlobalStyle } from 'styled-components';



export const GlobalStyles = createGlobalStyle`
  margin: 0;
  padding: 0;
  box-sizing: border-box;

  html {
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        @media (max-width: 1080px) {
            font-size: 93.75%;
        }

        @media(max-width: 720px) {
            font-size: 87,5%;
        }
    }

    * html ul li { float: left; }
    * html ul li a { height: 1%; }

    body {
        -webkit-font-smoothing: antialiased;
        display: flex;
        align-content: center;
        justify-content: center;
    }

    body, input, textarea, button {
        font-weight: 400;
        font-family: 'Roboto', sans-serif;
    }

    h1, h2, h3, h4, h5, h6, strong {
        font-weight: 600;
    }

    button {
        cursor: pointer;
    }
`