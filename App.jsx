import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  PlayCircle, 
  CheckCircle2, 
  ListTodo,
  Plus,
  Tv,
  GripVertical
} from 'lucide-react';

export default function App() {
  // Начальное состояние: пытаемся загрузить из памяти, если пусто - грузим базовый список
  const [shows, setShows] = useState(() => {
    const savedShows = localStorage.getItem('myTvShowsQueue');
    if (savedShows) {
      try {
        return JSON.parse(savedShows);
      } catch (e) {
        console.error('Ошибка чтения сохранений', e);
      }
    }
    
    return [
      { id: 1, title: 'Острые козырьки', status: 'planned' },
      { id: 2, title: 'Лучше звоните солу', status: 'planned' },
      { id: 3, title: 'Сопрано', status: 'planned' },
      { id: 4, title: 'Шерлок', status: 'planned' },
      { id: 5, title: 'Чернобыль', status: 'planned' },
      { id: 6, title: 'Йелоустоун', status: 'planned' },
      { id: 7, title: 'Бумажный дом', status: 'planned' },
      { id: 8, title: 'Очень странные дела', status: 'planned' },
      { id: 9, title: 'Декстер', status: 'planned' },
      { id: 10, title: 'Пацаны', status: 'planned' }
    ];
  });
  
  // Эффект: сохраняем список каждый раз, когда он меняется
  useEffect(() => {
    localStorage.setItem('myTvShowsQueue', JSON.stringify(shows));
  }, [shows]);

  const [newTitle, setNewTitle] = useState('');
  
  // Состояния для Drag-and-Drop
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  // Добавление нового сериала
  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    setShows([
      ...shows, 
      { 
        id: Date.now(), 
        title: newTitle.trim(), 
        status: 'planned' 
      }
    ]);
    setNewTitle('');
  };

  // Удаление сериала
  const handleDelete = (id) => {
    setShows(shows.filter(show => show.id !== id));
  };

  // Изменение статуса (цикличное переключение)
  const cycleStatus = (id) => {
    const statuses = ['planned', 'watching', 'completed'];
    setShows(shows.map(show => {
      if (show.id === id) {
        const nextIndex = (statuses.indexOf(show.status) + 1) % statuses.length;
        return { ...show, status: statuses[nextIndex] };
      }
      return show;
    }));
  };

  // Перемещение вверх по списку
  const moveUp = (index) => {
    if (index === 0) return;
    const newShows = [...shows];
    [newShows[index - 1], newShows[index]] = [newShows[index], newShows[index - 1]];
    setShows(newShows);
  };

  // Перемещение вниз по списку
  const moveDown = (index) => {
    if (index === shows.length - 1) return;
    const newShows = [...shows];
    [newShows[index + 1], newShows[index]] = [newShows[index], newShows[index + 1]];
    setShows(newShows);
  };

  // --- Drag and Drop обработчики ---
  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    setDragOverIdx(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Необходимо для разрешения сброса
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIdx === null) return;

    if (draggedIdx !== dropIndex) {
      const newShows = [...shows];
      const draggedItem = newShows[draggedIdx];
      newShows.splice(draggedIdx, 1);
      newShows.splice(dropIndex, 0, draggedItem);
      setShows(newShows);
    }

    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  // Вспомогательная функция для отображения статуса
  const getStatusConfig = (status) => {
    switch (status) {
      case 'planned':
        return { 
          label: 'В планах', 
          icon: <ListTodo size={16} className="mr-1.5" />,
          classes: 'bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-600/50'
        };
      case 'watching':
        return { 
          label: 'Смотрю', 
          icon: <PlayCircle size={16} className="mr-1.5" />,
          classes: 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30'
        };
      case 'completed':
        return { 
          label: 'Просмотрено', 
          icon: <CheckCircle2 size={16} className="mr-1.5" />,
          classes: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
        };
      default:
        return { label: 'Неизвестно', icon: null, classes: '' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8 selection:bg-indigo-500/30">
      <div className="max-w-3xl mx-auto">
        
        {/* Шапка приложения */}
        <header className="mb-8 text-center md:text-left flex flex-col md:flex-row items-center gap-4">
          <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
            <Tv size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Порядок просмотра</h1>
            <p className="text-slate-400 mt-1 text-sm md:text-base">Составь свою идеальную очередь сериалов</p>
          </div>
        </header>

        {/* Форма добавления */}
        <form onSubmit={handleAdd} className="mb-8 relative">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Например: Очень странные дела..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-5 pr-32 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
          />
          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white px-4 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Добавить</span>
          </button>
        </form>

        {/* Список сериалов */}
        <div className="space-y-3">
          {shows.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/50 rounded-3xl border border-slate-800/50 border-dashed">
              <Tv size={48} className="mx-auto text-slate-700 mb-4" />
              <h3 className="text-lg font-medium text-slate-300">Список пуст</h3>
              <p className="text-slate-500 mt-1">Добавь свой первый сериал, чтобы начать!</p>
            </div>
          ) : (
            shows.map((show, index) => {
              const statusConfig = getStatusConfig(show.status);
              
              return (
                <div 
                  key={show.id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`group flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-slate-900 border rounded-2xl transition-all shadow-sm ${
                    draggedIdx === index ? 'opacity-40 scale-95' : 'opacity-100'
                  } ${
                    dragOverIdx === index && draggedIdx !== index ? 'border-indigo-500 bg-slate-800/80 scale-[1.02] shadow-lg z-10' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Левая часть: Номер и кнопки сортировки */}
                  <div className="flex items-center justify-between sm:justify-start gap-3">
                    <div className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 hidden sm:block" title="Потяните для перемещения">
                      <GripVertical size={20} />
                    </div>
                    <div className="flex sm:flex-col gap-1">
                      <button 
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-500 transition-colors"
                        title="Поднять вверх"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button 
                        onClick={() => moveDown(index)}
                        disabled={index === shows.length - 1}
                        className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-500 transition-colors"
                        title="Опустить вниз"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center bg-slate-800 text-slate-400 rounded-full font-bold text-sm shrink-0">
                      {index + 1}
                    </div>
                  </div>

                  {/* Центральная часть: Название */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-medium truncate ${show.status === 'completed' ? 'text-slate-400 line-through decoration-slate-600' : 'text-slate-100'}`}>
                      {show.title}
                    </h3>
                  </div>

                  {/* Правая часть: Статус и удаление */}
                  <div className="flex items-center gap-2 justify-between sm:justify-end border-t border-slate-800 pt-3 sm:border-0 sm:pt-0">
                    <button
                      onClick={() => cycleStatus(show.id)}
                      className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${statusConfig.classes}`}
                      title="Нажмите, чтобы изменить статус"
                    >
                      {statusConfig.icon}
                      {statusConfig.label}
                    </button>
                    
                    <button
                      onClick={() => handleDelete(show.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors shrink-0"
                      title="Удалить из списка"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
      </div>
    </div>
  );
}
