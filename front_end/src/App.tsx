import './App.css'

function App() {

  return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="rounded-xl bg-slate-900 p-8 shadow-xl">
          <h1 className="text-4xl font-bold text-blue-400">
            Licit Monitor
          </h1>

          <p className="mt-3 text-slate-300">
            React, TypeScript, Vite e Tailwind CSS funcionando.
          </p>

          <button
              type="button"
              className="mt-6 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-500"
          >
            Visualizar licitações
          </button>
        </div>
      </main>
  )
}

export default App
