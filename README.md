# Quantum Wavefunction Visualizer ✨

An interactive web application built with Next.js (App Router), TypeScript, and Chart.js to visualize the stationary state wavefunctions (Ψ) and probability densities (|Ψ|²) for the classic "particle in a 1D infinite potential well" quantum mechanics problem.

## Live Demo

Experience the Quantum Wavefunction Visualizer in action at [qwv.tayr.dev](https://qwv.tayr.dev)

## Overview

This application provides a visual tool to understand fundamental quantum concepts like:

*   **Quantization:** How only discrete states (defined by quantum number `n`) are allowed.
*   **Wavefunctions:** The mathematical description of a quantum state.
*   **Probability Density:** The likelihood of finding the particle at a given position.
*   **Nodes:** Points where the probability of finding the particle is zero.
*   **Boundary Conditions:** How the wavefunction behaves at the edges of the potential well.
*   **Effect of Confinement:** How changing the size of the "box" (`L`) affects the state.
*   **Normalization:** Ensuring the total probability of finding the particle is 1.

## Features

*   📈 Visualize both the wavefunction Ψ(x) and the probability density |Ψ(x)|².
*   🎚️ Interactively adjust the principal **Quantum Number (n)** using a slider.
*   📏 Interactively adjust the **Box Length (L)** using a number input.
*   ✅ Toggle **Normalization** (applying the √2/L factor) with a checkbox.
*   🎨 Uses Chart.js for clear and responsive plotting.
*    moderno Built with modern web technologies:
    *   Next.js 14+ (App Router)
    *   React 18+
    *   TypeScript
    *   Tailwind CSS for styling

## Technology Stack

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI Library:** [React](https://reactjs.org/)
*   **Charting:** [Chart.js](https://www.chartjs.org/) with [react-chartjs-2](https://react-chartjs-2.js.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (LTS version recommended, e.g., v18 or v20+)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/luketaylor07/quantum-wavefunction-visualizer.git
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Development Server

```bash
npm run dev
# or
yarn dev