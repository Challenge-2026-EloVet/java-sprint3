export function getApiError(error, fallback = 'Erro inesperado ao processar a requisição.') {
  const data = error?.response?.data;

  if (Array.isArray(data)) {
    return data
      .map((item) => item.message || item.defaultMessage || item.mensagem || 'Erro de validação')
      .join(' | ');
  }

  if (data && typeof data === 'object') {
    if (Array.isArray(data.errors)) {
      return data.errors
        .map((item) => item.message || item.defaultMessage || item.mensagem || 'Erro de validação')
        .join(' | ');
    }

    if (data.field && data.message) {
      return `${data.field}: ${data.message}`;
    }

    if (data.message) return data.message;
    if (data.mensagem) return data.mensagem;
  }

  return fallback;
}

