export function GameLegend() {
  return (
    <ul className="legend-list">
      <li className="legend-item">
        <span className="legend-dot legend-fixed">12</span>
        <span>Nó sólido: valor oficial da solução</span>
      </li>
      <li className="legend-item">
        <span className="legend-dot legend-hidden">?</span>
        <span>Nó oculto: precisa ser revelado com o valor certo</span>
      </li>
      <li className="legend-item">
        <span className="legend-dot legend-ghost">35</span>
        <span>Nó fantasma: palpite incorreto inserido na BST</span>
      </li>
    </ul>
  );
}
