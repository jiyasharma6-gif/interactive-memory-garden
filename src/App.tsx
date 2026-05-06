/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ThemeProvider } from './components/ThemeContext';
import { PointsProvider } from './components/PointsContext';
import { AuthProvider } from './components/AuthContext';
import { Background, Atmosphere } from './components/Background';
import { Garden } from './components/Garden';
import { AmbientPlayer } from './components/AmbientPlayer';

export default function App() {
  return (
    <AuthProvider>
      <PointsProvider>
        <ThemeProvider>
          <div className="relative min-h-screen font-sans selection:bg-white/20 selection:text-white">
            <Background />
            <Atmosphere />
            <Garden />
            <AmbientPlayer />
          </div>
        </ThemeProvider>
      </PointsProvider>
    </AuthProvider>
  );
}
