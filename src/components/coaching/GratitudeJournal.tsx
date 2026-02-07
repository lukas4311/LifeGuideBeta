import React, { useState, useEffect } from 'react';
import { Heart, Plus, Trash2, Calendar, Sparkles, Loader2, Cloud, CloudOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface GratitudeEntry {
  id: string;
  text: string;
  created_at: string;
  category: 'relationship' | 'self' | 'life' | 'other';
}

interface GratitudeJournalProps {
  user: User | null;
}

const GratitudeJournal: React.FC<GratitudeJournalProps> = ({ user }) => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GratitudeEntry['category']>('other');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const categories = [
    { key: 'relationship' as const, label: 'Vztahy', color: '#F4A89F' },
    { key: 'self' as const, label: 'Já', color: '#7B68BE' },
    { key: 'life' as const, label: 'Život', color: '#7DD4D4' },
    { key: 'other' as const, label: 'Jiné', color: '#F4D47C' },
  ];

  // Load entries from database or localStorage
  useEffect(() => {
    const loadEntries = async () => {
      if (user) {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('journal_entries')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          
          setEntries(data?.map(e => ({
            id: e.id,
            text: e.text,
            created_at: e.created_at,
            category: e.category as GratitudeEntry['category'],
          })) || []);
        } catch (err) {
          console.error('Error loading journal entries:', err);
        } finally {
          setLoading(false);
        }
      } else {
        // Load from localStorage for non-authenticated users
        const saved = localStorage.getItem('gratitudeEntries');
        if (saved) {
          setEntries(JSON.parse(saved));
        } else {
          setEntries([
            { id: '1', text: 'Jsem vděčný/á za svou rodinu', created_at: new Date().toISOString(), category: 'relationship' },
            { id: '2', text: 'Jsem vděčný/á za své zdraví', created_at: new Date().toISOString(), category: 'self' },
            { id: '3', text: 'Jsem vděčný/á za krásný den', created_at: new Date().toISOString(), category: 'life' },
          ]);
        }
      }
    };

    loadEntries();
  }, [user]);

  // Save to localStorage for non-authenticated users
  useEffect(() => {
    if (!user && entries.length > 0) {
      localStorage.setItem('gratitudeEntries', JSON.stringify(entries));
    }
  }, [entries, user]);

  const handleAddEntry = async () => {
    if (!newEntry.trim()) return;
    
    setSaving(true);
    
    const entry: GratitudeEntry = {
      id: Date.now().toString(),
      text: newEntry,
      created_at: new Date().toISOString(),
      category: selectedCategory,
    };

    if (user) {
      try {
        const { data, error } = await supabase
          .from('journal_entries')
          .insert({
            user_id: user.id,
            text: newEntry,
            category: selectedCategory,
          })
          .select()
          .single();

        if (error) throw error;
        
        entry.id = data.id;
        entry.created_at = data.created_at;
      } catch (err) {
        console.error('Error saving journal entry:', err);
        setSaving(false);
        return;
      }
    }
    
    setEntries([entry, ...entries]);
    setNewEntry('');
    setShowForm(false);
    setSaving(false);
  };

  const handleDeleteEntry = async (id: string) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('journal_entries')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (err) {
        console.error('Error deleting journal entry:', err);
        return;
      }
    }
    
    setEntries(entries.filter(e => e.id !== id));
  };

  const getCategoryColor = (category: GratitudeEntry['category']) => {
    return categories.find(c => c.key === category)?.color || '#F4D47C';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('cs-CZ', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
          <Heart className="w-8 h-8 text-pink-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Deník vděčnosti
        </h3>
        <p className="text-gray-600">
          Každý den zapiš 3 věci, za které jsi vděčný/á
        </p>
        
        {/* Sync Status */}
        <div className="mt-3 flex items-center justify-center gap-2 text-sm">
          {user ? (
            <span className="flex items-center gap-1 text-green-600">
              <Cloud className="w-4 h-4" />
              Synchronizováno s účtem
            </span>
          ) : (
            <span className="flex items-center gap-1 text-gray-500">
              <CloudOff className="w-4 h-4" />
              Uloženo lokálně
            </span>
          )}
        </div>
      </div>

      {/* Add New Entry Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full mb-6 p-4 border-2 border-dashed border-pink-300 rounded-xl text-pink-500 font-medium hover:bg-pink-50 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Přidat nový záznam
        </button>
      )}

      {/* Add Entry Form */}
      {showForm && (
        <div className="mb-6 p-6 bg-pink-50 rounded-2xl animate-fadeIn">
          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="Za co jsi dnes vděčný/á?"
            className="w-full h-24 p-4 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none resize-none mb-4"
          />
          
          {/* Category Selection */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.key 
                    ? 'text-white shadow-md' 
                    : 'bg-white text-gray-600 hover:shadow-sm'
                }`}
                style={{ 
                  backgroundColor: selectedCategory === cat.key ? cat.color : undefined 
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleAddEntry}
              disabled={!newEntry.trim() || saving}
              className="flex-1 py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Ukládám...
                </>
              ) : (
                'Uložit'
              )}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setNewEntry('');
              }}
              className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Zrušit
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-pink-500 mx-auto mb-4" />
          <p className="text-gray-500">Načítám záznamy...</p>
        </div>
      )}

      {/* Entries List */}
      {!loading && (
        <div className="space-y-4">
          {entries.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Zatím nemáš žádné záznamy</p>
              <p className="text-sm">Začni psát svůj deník vděčnosti</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div 
                key={entry.id}
                className="group p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border-l-4"
                style={{ borderLeftColor: getCategoryColor(entry.category) }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium mb-2">{entry.text}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(entry.created_at)}
                      </span>
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: getCategoryColor(entry.category) }}
                      >
                        {categories.find(c => c.key === entry.category)?.label}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Stats */}
      {!loading && entries.length > 0 && (
        <div className="mt-8 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Celkem záznamů</span>
            <span className="font-bold text-pink-600">{entries.length}</span>
          </div>
        </div>
      )}

      {/* Inspirational Quote */}
      <div className="mt-8 text-center p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl">
        <p className="text-lg text-gray-700 italic">
          "V životě budeš úměrně šťasten tomu, jak budeš nápomocen světu."
        </p>
      </div>
    </div>
  );
};

export default GratitudeJournal;
