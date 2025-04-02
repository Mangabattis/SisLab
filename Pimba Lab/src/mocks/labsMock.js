// src/mocks/labsMock.js
export const labsMock = [
    {
      id: 1,
      name: 'Laboratório 101',
      location: 'Bloco A, Térreo',
      capacity: 30,
      computerCount: 30,
      description: 'Laboratório para aulas de programação',
      isAvailable: true,
      installedSoftware: [
        { id: 1, name: 'Visual Studio Code', version: '1.78.2' },
        { id: 3, name: 'MATLAB', version: 'R2023a' },
        { id: 4, name: 'Python', version: '3.11.3' }
      ]
    },
    {
      id: 2,
      name: 'Laboratório 102',
      location: 'Bloco A, 1º Andar',
      capacity: 25,
      computerCount: 25,
      description: 'Laboratório para aulas de modelagem e simulação',
      isAvailable: true,
      installedSoftware: [
        { id: 3, name: 'MATLAB', version: 'R2023a' },
        { id: 4, name: 'Python', version: '3.11.3' },
        { id: 5, name: 'Unity', version: '2022.3' }
      ]
    },
    {
      id: 3,
      name: 'Laboratório 103',
      location: 'Bloco A, 1º Andar',
      capacity: 20,
      computerCount: 20,
      description: 'Laboratório para aulas de design e computação gráfica',
      isAvailable: true,
      installedSoftware: [
        { id: 2, name: 'Adobe Photoshop', version: '24.0' },
        { id: 5, name: 'Unity', version: '2022.3' }
      ]
    },
    {
      id: 4,
      name: 'Laboratório 205',
      location: 'Bloco B, 2º Andar',
      capacity: 40,
      computerCount: 40,
      description: 'Laboratório para aulas de redes e sistemas distribuídos',
      isAvailable: false,
      installedSoftware: [
        { id: 1, name: 'Visual Studio Code', version: '1.78.2' },
        { id: 4, name: 'Python', version: '3.11.3' },
        { id: 6, name: 'IntelliJ IDEA', version: '2023.1' }
      ]
    }
  ];