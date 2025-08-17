// styles.js
import styled, { css, keyframes } from "styled-components";

/* ---------- Tokens ---------- */
const radius = "18px";
const gap = "12px";
const cell = {
  size: 96, // base; escala responde ao viewport
  font: "clamp(2rem, 6vw, 4rem)",
};
const shadow = "0 8px 24px rgba(0,0,0,.12)";

const ring = keyframes`
  from { box-shadow: 0 0 0 0 rgba(0, 164, 255, .4); }
  to   { box-shadow: 0 0 0 12px rgba(0, 164, 255, 0); }
`;

/* ---------- Helpers ---------- */
const subtleBorder = css`
  border: 1px solid hsl(0 0% 90%);
  @media (prefers-color-scheme: dark) {
    border-color: hsl(0 0% 22%);
  }
`;

/* ---------- Layout ---------- */
export const GameWrapper = styled.div`
  --bg: hsl(0 0% 99%);
  --panel: hsl(0 0% 100%);
  --ink: hsl(220 15% 20%);
  --muted: hsl(220 10% 45%);

  @media (prefers-color-scheme: dark) {
    --bg: hsl(220 18% 7%);
    --panel: hsl(220 16% 12%);
    --ink: hsl(0 0% 98%);
    --muted: hsl(220 10% 65%);
  }

  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: radial-gradient(1200px 800px at 10% 10%, rgba(0,0,0,.04), transparent),
              var(--bg);
  color: var(--ink);
`;

export const Card = styled.section`
  width: min(520px, 92vw);
  background: var(--panel);
  ${subtleBorder};
  border-radius: ${radius};
  box-shadow: ${shadow};
  padding: 20px;
  display: grid;
  gap: 18px;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const Title = styled.h1`
  font-size: clamp(1.1rem, 2.6vw, 1.4rem);
  font-weight: 700;
  letter-spacing: .2px;
`;

export const Status = styled.div`
  display: flex;
  flex-direction: column;
`;

export const WinCounter = styled.span`
  font-size: clamp(.9rem, 2.4vw, 1rem);
  color: var(--muted);

  strong { color: var(--ink); }
`

/* ---------- Board / Cell ---------- */
/**
 * Props aceitas por <Cell/>:
 * - $variant: 'x' | 'o' | 'empty'
 * - $winning?: boolean
 * - $disabled?: boolean
 */
export const Board = styled.div`
  --size: ${cell.size}px;

  display: grid;
  grid-template-columns: repeat(3, var(--size));
  grid-auto-rows: var(--size);
  gap: ${gap};
  align-self: center;
  justify-self: center;
  margin-inline: auto;

  @media (max-width: 440px) {
    --size: min(26vw, 108px);
  }
`;

const cellBase = css`
  ${subtleBorder};
  background: linear-gradient(180deg, rgba(255,255,255,.6), rgba(255,255,255,.2));
  @media (prefers-color-scheme: dark) {
    background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
  }
  border-radius: 20px;
  display: grid;
  place-items: center;
  font-weight: 800;
  user-select: none;
  cursor: pointer;
  transition: transform .08s ease, filter .2s ease, border-color .2s ease;
  font-size: ${cell.font};

  &:active { transform: translateY(1px) scale(.995); }
  &:focus-visible {
    outline: none;
    animation: ${ring} .9s ease;
  }
`;

const xStyles = css`
  color: hsl(212 100% 45%);
  text-shadow: 0 2px 12px rgba(0, 100, 220, .25);
`;

const oStyles = css`
  color: hsl(10 85% 52%);
  text-shadow: 0 2px 12px rgba(220, 80, 0, .25);
`;

const emptyHover = css`
  &:hover {
    filter: brightness(1.02);
    border-color: hsl(0 0% 80%);
    @media (prefers-color-scheme: dark) {
      border-color: hsl(0 0% 32%);
    }
  }
`;

const winningGlow = css`
  box-shadow: 0 0 0 3px rgba(0,0,0,0.05), 0 8px 32px rgba(0, 164, 255, .25);
  transform: translateY(-1px);
`;

export const Cell = styled.button`
  ${cellBase};
  ${({ $variant }) => $variant === "x" && xStyles}
  ${({ $variant }) => $variant === "o" && oStyles}
  ${({ $variant }) => $variant === "empty" && emptyHover}

  ${({ $winning }) => $winning && winningGlow}

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      opacity: .6;
      &:active { transform: none; }
      &:hover { filter: none; border-color: inherit; }
    `}
`;

/* Dica opcional: ícones X/O em CSS puro (sem SVG) */
export const Mark = styled.span`
  display: inline-block;
  line-height: 1;
  ${({ $variant }) =>
    $variant === "x" &&
    css`
      position: relative;
      width: 0.9em;
      height: 0.9em;
      &:before,
      &:after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 2px;
        background: currentColor;
        transform-origin: center;
      }
      &:before { transform: rotate(45deg) scaleY(0.16); }
      &:after  { transform: rotate(-45deg) scaleY(0.16); }
    `}
  ${({ $variant }) =>
    $variant === "o" &&
    css`
      width: 0.9em;
      height: 0.9em;
      border: .16em solid currentColor;
      border-radius: 999px;
      box-sizing: border-box;
    `}
`;

/* ---------- Footer / Controls ---------- */
export const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ResetButton = styled.button`
  appearance: none;
  border: 0;
  ${subtleBorder};
  background: var(--panel);
  padding: 10px 14px;
  border-radius: ${radius};
  box-shadow: ${shadow};
  font-weight: 700;
  cursor: pointer;
  transition: transform .08s ease, box-shadow .2s ease, background .2s ease;

  &:hover { box-shadow: 0 10px 28px rgba(0,0,0,.14); }
  &:active { transform: translateY(1px); }

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: .6;
      cursor: not-allowed;
      &:active { transform: none; }
      &:hover { box-shadow: ${shadow}; }
    `}
`;