import React from 'react';
import { Compass, Mail, Globe, Heart, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">ŘIDIČÁK NA ŽIVOT</h3>
                <p className="text-purple-400 text-sm">Bez kompromisů</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Unikátní seberozvojový program pro váš spokojený život. 
              Vzpomeňte si, kdo opravdu jste, a žijte autenticky.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.veranekvindova.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>Navštívit web</span>
              </a>
              <a 
                href="mailto:info@veranekvindova.cz"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Kontakt</span>
              </a>
            </div>
          </div>

          {/* Modules */}
          <div>
            <h4 className="text-lg font-bold mb-4">Moduly</h4>
            <ul className="space-y-3">
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  1. Identita
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  2. Pravidla
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  3. Navigace
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  4. Energie
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  5. Vztahy
                </span>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-bold mb-4">Zdroje</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://www.veranekvindova.cz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <span>Osobní koučink</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Afirmace
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Cvičení
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Deník vděčnosti
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Quote */}
        <div className="mt-12 p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl text-center">
          <p className="text-xl italic text-gray-300 mb-2">
            "Jsem DOST DOBRÁ, taková jaká jsem. Život mě miluje."
          </p>
          <p className="text-purple-400 text-sm">— Afirmace z programu</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} ŘIDIČÁK NA ŽIVOT. Všechna práva vyhrazena.
            </p>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <span>Vytvořeno s</span>
              <Heart className="w-4 h-4 text-pink-500" />
              <span>pro váš spokojený život</span>
            </div>
            <a 
              href="https://www.veranekvindova.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
            >
              www.veranekvindova.cz
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
