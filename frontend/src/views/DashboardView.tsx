import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApuestasChart } from '../components/ApuestasChart';
import { CarrerasChart } from '../components/CarrerasChart';

export const DashboardView = () => {
  const { user, logoutUser, updateBalance } = useAuth();
  const [showModal, setShowModal] = useState(false);

  // --- Estados del Formulario SnailPay ---
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [amount, setAmount] = useState('');
  
  // --- Estados de Simulación de Errores ---
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);
  const [simulateSystemError, setSimulateSystemError] = useState(false);

  if (!user) return null;

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setModalSuccess(null);

    if (!cardNumber.trim() || !expDate.trim() || !cvv.trim() || !cardName.trim() || !amount) {
      setModalError('Por favor, completa todos los campos de la tarjeta.');
      return;
    }

    const parsedAmount = parseFloat(amount);

    // --- PARCHE DE DESPLIEGUE SEGURO ---
    // Si la app está en Vercel (no es localhost), simulamos la respuesta de la API aquí mismo
    if (window.location.hostname !== 'localhost') {
      
      // 1. Simular Error del Sistema (500) si activó el switch
      if (simulateSystemError) {
        setModalError('Error de SnailPay (500): Internal Server Error: SnailPay platform is temporarily down.');
        return;
      }

      // 2. Simular Cobro Exitoso (Tarjeta correcta del PDF)
      if (cardNumber === '1234123412341234' && expDate === '12/26' && cvv === '543') {
        if (parsedAmount <= 0) {
          setModalError('El monto de la recarga debe ser mayor a cero.');
          return;
        }

        // Guardamos datos ficticios en LocalStorage tal cual lo pide el requerimiento 2.4
        localStorage.setItem('last_payment_card', cardNumber);
        localStorage.setItem('last_payment_cvv', cvv);
        
        updateBalance(parsedAmount);
        setModalSuccess(`¡Depósito Aprobado! Código de autorización: AUTH-${Math.floor(1000 + Math.random() * 9000)}`);
        
        setTimeout(() => {
          setShowModal(false);
          setModalSuccess(null);
          setAmount('');
        }, 2000);
        return;
      }

      // 3. Simular Tarjeta Rechazada (402) para cualquier otro dato
      let detail = 'Tarjeta rechazada por fondos insuficientes o parámetros incorrectos.';
      if (cardNumber.startsWith('4')) {
        detail = 'Tarjeta bloqueada o sospecha de fraude.';
      } else if (cvv === '000') {
        detail = 'Código de seguridad (CVV) inválido.';
      }
      setModalError(`Transacción Rechazada: ${detail}`);
      return;
    }


    // --- FLUJO LOCAL NORMAL (Cuando ejecutas con npm run dev en tu compu) ---
    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (simulateSystemError) {
        headers['x-simulate-system-error'] = 'true';
      }

      const response = await fetch('http://localhost:4000/api/snailpay/process', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          cardNumber,
          expirationDate: expDate,
          cvv,
          fullName: cardName,
          amount: parsedAmount,
          userId: user.id,
          userEmail: user.email
        })
      });

      const data = await response.json();

      if (response.status === 200 && data.status === 'approved') {
        localStorage.setItem('last_payment_card', data.cardNumber);
        localStorage.setItem('last_payment_cvv', data.cvv);
        
        updateBalance(parsedAmount);
        setModalSuccess(`¡Depósito Aprobado! Código de autorización: ${data.authorization_code}`);
        
        setTimeout(() => {
          setShowModal(false);
          setModalSuccess(null);
          setAmount('');
        }, 2000);
      } else if (response.status === 402 || data.status === 'rejected') {
        setModalError(`Transacción Rechazada: ${data.status_detail}`);
      } else {
        setModalError(`Error de SnailPay (500): ${data.status_detail || 'Problema interno del sistema.'}`);
      }
    } catch (err) {
      setModalError('Error de conexión. Asegúrate de tener el servidor Backend corriendo en el puerto 4000.');
    }
  };


  return (
    <div className="container-fluid min-vh-100 py-4 bg-light">
      
      {/* Navbar / Header del Dashboard */}
      <header className="navbar navbar-expand-lg navbar-white bg-white shadow-sm rounded-3 p-3 mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h4 mb-0 text-darkfw-bold">Panel</h1>
          <p className="text-muted small mb-0">Bienvenido, <span className="fw-bold text-secondary">{user.fullName}</span></p>
        </div>
        
        <div className="d-flex align-items-center gap-3">
          <div className="bg-light px-3 py-2 rounded border text-end">
            <span className="text-muted d-block small fw-bold" style={{ fontSize: '10px' }}>SALDO DISPONIBLE</span>
            <strong className="text-success h5 mb-0">${user.balance.toFixed(2)}</strong>
          </div>
          <button onClick={() => setShowModal(true)} className="btn btn-success fw-bold px-3 py-2 shadow-sm">+ Cargar Saldo</button>
          <button onClick={logoutUser} className="btn btn-outline-danger px-3 py-2">Cerrar Sesión</button>
        </div>
      </header>

      {/* Grid de Gráficas de Recharts */}
      <main className="row g-4">
        <div className="col-12 col-md-12">
          <div className="card shadow-sm border-0 p-4 bg-white h-100">
            <h3 className="h6 fw-bold text-secondary mb-3">Historial de Apuestas (Donut)</h3>
            <ApuestasChart />
          </div>
        </div>

        <div className="col-12 col-md-12">
          <div className="card shadow-sm border-0 p-4 bg-white h-100">
            <h3 className="h6 fw-bold text-secondary mb-3">Victorias por Caracol (6 Carreras Hoy)</h3>
            <CarrerasChart />
          </div>
        </div>
      </main>

      {/* --- MODAL DE COBRO DE SNAILPAY (USANDO CLASES NATIVAS) --- */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow-lg">
              
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold text-dark">Pasarela Simulada SnailPay</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
              </div>

              <div className="modal-body pt-3">
                {modalError && <div className="alert alert-danger py-2 small mb-3">{modalError}</div>}
                {modalSuccess && <div className="alert alert-success py-2 small mb-3">{modalSuccess}</div>}

                <form onSubmit={handlePaymentSubmit}>
                  
                  {/* Switch para simular caída del sistema */}
                  <div className="alert alert-warning py-2 mb-3">
                    <div className="form-check form-switch m-0">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="errorSwitch" 
                        checked={simulateSystemError} 
                        onChange={e => setSimulateSystemError(e.target.checked)}
                      />
                      <label className="form-check-label small fw-bold text-danger" style={{ cursor: 'pointer' }} htmlFor="errorSwitch">
                        Simular Caída del Sistema (Error 500)
                      </label>
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-bold text-muted mb-1">Nombre del Titular</label>
                    <input type="text" className="form-control form-control-sm" placeholder="Ej. Ivan Juarez" value={cardName} onChange={e => setCardName(e.target.value)} />
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-bold text-muted mb-1">Número de Tarjeta</label>
                    <input type="text" className="form-control form-control-sm" placeholder="Usa 1234123412341234" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                  </div>

                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <label className="form-label small fw-bold text-muted mb-1">Vencimiento</label>
                      <input type="text" className="form-control form-control-sm" placeholder="12/26" value={expDate} onChange={e => setExpDate(e.target.value)} />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold text-muted mb-1">CVV</label>
                      <input type="text" className="form-control form-control-sm" placeholder="543" value={cvv} onChange={e => setCvv(e.target.value)} />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted mb-1">Monto a Recargar ($)</label>
                    <input type="number" className="form-control form-control-sm" min="1" placeholder="Monto mayor a 0" value={amount} onChange={e => setAmount(e.target.value)} />
                  </div>

                  <button type="submit" className="btn btn-primary w-100 fw-bold py-2 shadow-sm">Confirmar Recarga</button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};