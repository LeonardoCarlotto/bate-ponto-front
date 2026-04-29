import React from 'react';

import ContasPagarScreen from './screens/ContasPagarScreen';
import CadastroContaPagarScreen from './screens/CadastroContaPagarScreen';

const contasPagarRoutes = [
  {
    path: '/financeiro/contas-pagar',
    element: <ContasPagarScreen />,
    private: true,
  },
  {
    path: '/financeiro/contas-pagar/novo',
    element: <CadastroContaPagarScreen />,
    private: true,
  },
  {
    path: '/financeiro/contas-pagar/editar/:id',
    element: <CadastroContaPagarScreen />,
    private: true,
  },
  {
    path: '/financeiro/contas-pagar/visualizar/:id',
    element: <CadastroContaPagarScreen />,
    private: true,
  },
];

export default contasPagarRoutes;
