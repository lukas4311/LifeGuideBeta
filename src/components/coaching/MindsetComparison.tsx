import React, { useState } from 'react';
import { TrendingDown, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

interface MindsetItem {
  poor: string;
  rich: string;
}

const mindsetItems: MindsetItem[] = [
  { poor: 'Nemůžu si to dovolit', rich: 'Jak si to mohu dovolit?' },
  { poor: 'To není možné', rich: 'Jak to mohu udělat?' },
  { poor: 'Proč se mi to děje?', rich: 'Co se z toho mohu naučit?' },
  { poor: 'Já na to nemám', rich: 'Mohu se to naučit' },
  { poor: 'Život je těžký', rich: 'Život mě miluje' },
  { poor: 'Musím', rich: 'Mohu / Chci' },
  { poor: 'Nemůžu', rich: 'Nemusím' },
  { poor: 'Jsem oběť', rich: 'Jsem autor svého života' },
];

const MindsetComparison: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [transformedThoughts, setTransformedThoughts] = useState<Record<number, boolean>>({});

  const handleTransform = (index: number) => {
    setTransformedThoughts(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          Poor Mindset vs. Rich Mindset
        </h3>
        <p className="text-gray-600 text-lg">
          Transformuj své myšlenky a změň svůj život
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Poor Mindset Column */}
        <div className="bg-red-50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-xl font-bold text-red-700">Poor Mindset</h4>
          </div>
          <div className="space-y-3">
            {mindsetItems.map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectedItem(index)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  selectedItem === index 
                    ? 'bg-red-200 shadow-md' 
                    : 'bg-red-100 hover:bg-red-200'
                } ${transformedThoughts[index] ? 'opacity-50 line-through' : ''}`}
              >
                <p className="text-red-800">{item.poor}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rich Mindset Column */}
        <div className="bg-green-50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-xl font-bold text-green-700">Rich Mindset</h4>
          </div>
          <div className="space-y-3">
            {mindsetItems.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedItem(index);
                  handleTransform(index);
                }}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  selectedItem === index 
                    ? 'bg-green-200 shadow-md' 
                    : 'bg-green-100 hover:bg-green-200'
                } ${transformedThoughts[index] ? 'ring-2 ring-green-500' : ''}`}
              >
                <p className="text-green-800">{item.rich}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transformation Tool */}
      <div className="bg-gradient-to-r from-purple-100 to-teal-100 rounded-2xl p-8">
        <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Tvůj transformační nástroj
        </h4>
        
        {selectedItem !== null ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="bg-red-100 px-6 py-4 rounded-xl text-red-700 font-medium text-center">
              {mindsetItems[selectedItem].poor}
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="w-8 h-8 text-purple-500 rotate-90 sm:rotate-0" />
            </div>
            <div className="bg-green-100 px-6 py-4 rounded-xl text-green-700 font-medium text-center flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-500" />
              {mindsetItems[selectedItem].rich}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Klikni na myšlenku pro zobrazení transformace
          </p>
        )}

        {/* Progress */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Transformováno: {Object.keys(transformedThoughts).length} / {mindsetItems.length}
          </p>
          <div className="h-2 bg-gray-200 rounded-full max-w-xs mx-auto overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-green-500 transition-all duration-500"
              style={{ width: `${(Object.keys(transformedThoughts).length / mindsetItems.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* ABRAKADABRA Section */}
      <div className="mt-12 text-center">
        <div className="inline-block px-6 py-3 bg-purple-100 rounded-full mb-4">
          <p className="text-purple-700 font-bold text-lg">ABRAKADABRA</p>
        </div>
        <p className="text-xl text-gray-700 font-medium">
          Tvořím, jak mluvím. Včetně zvuku.
        </p>
        <p className="text-gray-500 mt-2">
          Slova mají moc. Vybírej je moudře.
        </p>
      </div>
    </div>
  );
};

export default MindsetComparison;
