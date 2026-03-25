export function estiloLabel(estilo) {
  const map = {
    dor: { label: 'Dor', color: '#ef4444' },
    educativo: { label: 'Educativo', color: '#3b82f6' },
    venda: { label: 'Venda', color: '#22c55e' },
  }
  return map[estilo] || { label: estilo, color: '#a1a1aa' }
}

export function statusLabel(status) {
  const map = {
    gerado: { label: 'Gerado', color: '#f59e0b', icon: '⏳' },
    aprovado: { label: 'Aprovado', color: '#22c55e', icon: '✔' },
    rejeitado: { label: 'Rejeitado', color: '#ef4444', icon: '✖' },
  }
  return map[status] || { label: status, color: '#a1a1aa', icon: '•' }
}

export function truncate(text, maxLength = 120) {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text
}

export function qualidadeStars(qualidade) {
  return '★'.repeat(qualidade) + '☆'.repeat(5 - qualidade)
}
