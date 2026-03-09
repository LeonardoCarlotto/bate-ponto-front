import React from 'react';

import ListaPacotesScreen from './screens/ListaPacotesScreen';
import CadastroPacoteScreen from './screens/CadastroPacoteScreen';
import VisualizarPacoteScreen from './screens/VisualizarPacoteScreen';

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
  {
    path: '/produtos/pacotes/visualizar/:pacoteId',
    element: <VisualizarPacoteScreen />,
    private: true,
  },
];

export default routes;
