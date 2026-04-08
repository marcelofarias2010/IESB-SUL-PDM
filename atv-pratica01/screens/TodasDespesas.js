import DespesaSaida from '../components/despesa/DespesaSaida';
import { EXPENSES } from '../constants/despesas';

function TodasDespesas() {
  const despesasSemFuturas = EXPENSES.filter((despesa) => despesa.date <= new Date());

  return <DespesaSaida despesas={despesasSemFuturas} periodo="Todas as despesas" />;
}

export default TodasDespesas;
