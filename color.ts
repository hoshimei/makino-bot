const colors = ['🟥', '🟧', '🟨', '🟩', '🟫', '🟦', '🟪']

export function randomColor() {
  return colors[Math.floor(Math.random() * colors.length)]
}
