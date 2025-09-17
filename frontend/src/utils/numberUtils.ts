/**
 * Formata um número para exibição, retornando '0' se o valor for NaN.
 * @param value - O valor numérico a ser formatado
 * @param addPlus - Se verdadeiro, adiciona um sinal de '+' ao final
 * @returns O valor formatado como string
 */
export const formatNumber = (value: number, addPlus: boolean = false): string => {
  if (isNaN(value)) return '0';
  return addPlus ? `${value}+` : `${value}`;
};
