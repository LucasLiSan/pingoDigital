function gerarCodigoBarras() {
    const data = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const aleatorio = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `MTRL-${data}-${aleatorio}`;
}
  
export default gerarCodigoBarras;