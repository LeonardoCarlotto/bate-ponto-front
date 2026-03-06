import React from 'react';

import ListaPacotesScreen from './screens/ListaPacotesScreen';
import CadastroPacoteScreen from './screens/CadastroPacoteScreen';

const routes = [
  {
    path: '/produtos/pacotes/lista',
    element: <ListaPacotesScreen />,
    private: true,
  },
  {
    path: '/produtos/pacotes/cadastro',
    element: <CadastroPacoteScreen />,
    private: true,
  },
  {
    path: '/produtos/pacotes/cadastro/:pacoteId',
    element: <CadastroPacoteScreen />,
    private: true,
  },
];

export default routes;
