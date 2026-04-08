import DespesaSaida from '../components/despesa/DespesaSaida';
import { EXPENSES } from '../constants/despesas';

function DespesasRecentes() {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const seteDiasAtras = new Date();
  seteDiasAtras.setHours(0, 0, 0, 0);
  seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

  const despesasRecentes = EXPENSES.filter(
    (despesa) => despesa.date >= seteDiasAtras && despesa.date <= today
  );

  return <DespesaSaida despesas={despesasRecentes} periodo="Ultimos 7 dias" />;
}

export default DespesasRecentes;
