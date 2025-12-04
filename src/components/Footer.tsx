export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/images/genesis-logo.svg" alt="Genesis" className="w-6 h-6" />
              <span className="text-base font-bold text-white">Genesis</span>
            </div>
            <p className="text-sm text-slate-400">AI-first smart contract builder with multi-agent orchestration.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#features" className="hover:text-slate-200 transition">Features</a></li>
              <li><a href="/playground" className="hover:text-slate-200 transition">Playground</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="/docs" className="hover:text-slate-200 transition">Documentation</a></li>
              <li><a href="/github" className="hover:text-slate-200 transition">GitHub</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-slate-200 transition">Privacy</a></li>
              <li><a href="#" className="hover:text-slate-200 transition">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">© 2024 Genesis. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-slate-200 transition text-sm">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-slate-200 transition text-sm">Discord</a>
              <a href="#" className="text-slate-400 hover:text-slate-200 transition text-sm">GitHub</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
