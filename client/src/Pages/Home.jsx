import React, { useState } from 'react';

const Home = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container min-h-screen">
      <div className="flex min-h-screen">
        {/* Sidebar - SideNavBar Component */}
        <aside className="hidden md:flex flex-col h-screen w-64 border-r-0 rounded-r-3xl bg-slate-50/50 fixed left-0 top-0 z-40 py-8 gap-2">
          <div className="px-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 primary-gradient rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined" data-icon="shield_moon" style={{ fontVariationSettings: "'FILL' 1" }}>shield_moon</span>
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-900 tracking-tighter">Sanctuary</h1>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Personal Workspace</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            <a className="bg-white text-blue-600 shadow-sm rounded-full mx-2 my-1 px-4 py-2 flex items-center gap-3 transition-all duration-300 ease-in-out" href="#">
              <span className="material-symbols-outlined" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="text-sm font-medium">Personal Tasks</span>
            </a>
            <a className="text-slate-500 hover:bg-slate-200/50 rounded-full mx-2 my-1 px-4 py-2 flex items-center gap-3 transition-all duration-300 ease-in-out" href="#">
              <span className="material-symbols-outlined" data-icon="folder_open">folder_open</span>
              <span className="text-sm font-medium">Projects</span>
            </a>
            <a className="text-slate-500 hover:bg-slate-200/50 rounded-full mx-2 my-1 px-4 py-2 flex items-center gap-3 transition-all duration-300 ease-in-out" href="#">
              <span className="material-symbols-outlined" data-icon="analytics">analytics</span>
              <span className="text-sm font-medium">Analytics</span>
            </a>
            <a className="text-slate-500 hover:bg-slate-200/50 rounded-full mx-2 my-1 px-4 py-2 flex items-center gap-3 transition-all duration-300 ease-in-out" href="#">
              <span className="material-symbols-outlined" data-icon="settings">settings</span>
              <span className="text-sm font-medium">Settings</span>
            </a>
          </nav>
          <div className="px-4 mt-auto">
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="w-full primary-gradient text-white rounded-full py-3 px-4 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all font-semibold text-sm"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              New Task
            </button>
          </div>
        </aside>
        
        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 min-h-screen">
          {/* TopNavBar Component */}
          <header className="fixed top-0 w-full md:w-[calc(100%-16rem)] z-30 bg-white/80 backdrop-blur-xl shadow-sm shadow-blue-500/5">
            <div className="flex items-center justify-between px-6 py-4 max-w-screen-2xl mx-auto">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 material-symbols-outlined text-[20px]">search</span>
                  <input className="bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-primary/10 transition-all outline-none" placeholder="Search tasks..." type="text"/>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors text-slate-500 relative">
                  <span className="material-symbols-outlined">notifications</span>
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center gap-3 pl-2">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-on-surface">Alex River</p>
                    <p className="text-[10px] text-on-surface-variant">Focus Mode: ON</p>
                  </div>
                  <img alt="User Profile" className="w-9 h-9 rounded-full object-cover border-2 border-primary/10" data-alt="Portrait of a young man smiling softly" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNg5bd6DulnMsfqumukSXl0ZAOBIwM1Qk2cKVr8msiswZ8fn3VxuNdKtnjUOK31acsBRyzASAJPiQteZokTuDbsClAovt9mQnQsOcaOf4pv_b01Y8ILClU5LFZiM5RELkBua_iIAg6Wp20P-BNHC3Okb_32jugxQgq4malO_GWnxGtb4acPjoPnXgtGmwPnIAXnP8xMyaDHNsMKzZ2jOTAe_JEmSI9MeowXCUpO4nTYip2rp3tCtJlkczuWzY3uA334BxreMxJKNo"/>
                </div>
              </div>
            </div>
            <div className="bg-slate-100/50 h-px w-full absolute bottom-0"></div>
          </header>
          
          {/* Dashboard Content */}
          <div className="pt-24 pb-12 px-8 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <section className="mb-12">
              <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Good morning, Alex.</h2>
              <p className="text-on-surface-variant text-lg font-medium">You have <span className="text-primary font-bold">5 tasks</span> to focus on today.</p>
            </section>
            
            {/* Board Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Column: To Do */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                    <h3 className="font-bold text-slate-600 uppercase tracking-widest text-[11px]">To Do</h3>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-500">3</span>
                  </div>
                  <button className="text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">add_circle</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {/* Task Card 1 */}
                  <div className="bg-surface-container-lowest rounded-lg p-5 shadow-sm hover:shadow-md transition-all group cursor-grab active:cursor-grabbing border border-transparent hover:border-primary/5">
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Health</span>
                      <span className="material-symbols-outlined text-slate-300 group-hover:text-slate-400 transition-colors cursor-pointer">more_horiz</span>
                    </div>
                    <h4 className="font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">Morning Yoga Session</h4>
                    <p className="text-sm text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">Focus on flexibility and breathing techniques for 30 minutes.</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                        <span className="text-[11px] font-semibold">Today, 08:00 AM</span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px]">attachment</span>
                      </div>
                    </div>
                  </div>
                  {/* Task Card 2 */}
                  <div className="bg-surface-container-lowest rounded-lg p-5 shadow-sm hover:shadow-md transition-all group border border-transparent">
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Education</span>
                      <span className="material-symbols-outlined text-slate-300">more_horiz</span>
                    </div>
                    <h4 className="font-bold text-on-surface mb-1">Finish "Atomic Habits"</h4>
                    <p className="text-sm text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">Complete the final three chapters and summarize key takeaways.</p>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      <span className="text-[11px] font-semibold">Tomorrow</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Column: In Progress */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <h3 className="font-bold text-primary uppercase tracking-widest text-[11px]">In Progress</h3>
                    <span className="bg-primary-container px-2 py-0.5 rounded-full text-[10px] font-bold text-primary">2</span>
                  </div>
                  <span className="material-symbols-outlined text-primary text-[20px]">autorenew</span>
                </div>
                <div className="space-y-4">
                  {/* Task Card 3 */}
                  <div className="bg-surface-container-lowest rounded-lg p-5 shadow-sm border border-primary/10 relative overflow-hidden group">
                    <div className="absolute left-0 top-0 h-full w-1 primary-gradient"></div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">Creativity</span>
                      <span className="material-symbols-outlined text-slate-300">more_horiz</span>
                    </div>
                    <h4 className="font-bold text-on-surface mb-2">Portfolio Website Draft</h4>
                    <div className="mb-4">
                      <div className="flex justify-between text-[10px] font-bold text-on-surface-variant mb-1">
                        <span>Progress</span>
                        <span>65%</span>
                      </div>
                      <div className="h-1.5 w-full bg-primary-container rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[65%] rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold">AR</div>
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-primary"><span className="material-symbols-outlined text-[12px]">add</span></div>
                      </div>
                      <div className="flex items-center gap-2 text-primary font-bold">
                        <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
                        <span className="text-[11px]">4</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Column: Done */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <h3 className="font-bold text-emerald-600 uppercase tracking-widest text-[11px]">Done</h3>
                    <span className="bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-500">12</span>
                  </div>
                  <span className="material-symbols-outlined text-emerald-500 text-[20px]">task_alt</span>
                </div>
                <div className="space-y-4 opacity-70 grayscale-[0.3]">
                  {/* Completed Task */}
                  <div className="bg-slate-50 rounded-lg p-5 border border-slate-100 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-3 py-1 bg-slate-200 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-wider">Grocery</span>
                      <span className="material-symbols-outlined text-emerald-500" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <h4 className="font-bold text-slate-400 line-through mb-1">Weekly Meal Prep</h4>
                    <p className="text-xs text-slate-400 mb-4">Batch cooking for the upcoming work week.</p>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      <span className="text-[11px] font-semibold">Completed Sunday</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Create Task Slide-out Drawer */}
      <div className={`fixed inset-0 z-60 bg-on-surface/20 backdrop-blur-sm transition-opacity flex justify-end ${isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className={`w-full max-w-md bg-surface-container-lowest h-full shadow-2xl rounded-l-3xl p-8 transform transition-transform ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-on-surface tracking-tight">Create New Task</h3>
            <button onClick={() => setIsDrawerOpen(false)} className="w-10 h-10 rounded-full hover:bg-surface-container transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <form className="space-y-8">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-2">Task Title</label>
              <input className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="What needs to be done?" type="text"/>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-2">Description</label>
              <textarea className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none" placeholder="Add some details or notes..." rows="4"></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-2">Due Date</label>
                <div className="relative">
                  <input className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none" type="date"/>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-2">Priority</label>
                <select className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>
            <div className="pt-8 space-y-3">
              <button className="w-full primary-gradient text-white rounded-full py-4 font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all" type="button" onClick={() => setIsDrawerOpen(false)}>
                Create Task
              </button>
              <button className="w-full bg-surface-container text-on-surface rounded-full py-4 font-bold hover:bg-surface-container-high transition-colors" type="button" onClick={() => setIsDrawerOpen(false)}>
                Save as Draft
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Mobile Navigation - BottomNavBar Component */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full glass-panel z-50 flex items-center justify-around px-4 py-3 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
        <button className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="text-[10px] font-bold">Board</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">folder</span>
          <span className="text-[10px] font-bold">Projects</span>
        </button>
        <div className="relative -top-6">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="w-14 h-14 primary-gradient rounded-full flex items-center justify-center text-white shadow-xl shadow-primary/30"
          >
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        </div>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">analytics</span>
          <span className="text-[10px] font-bold">Stats</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </nav>
      
      {/* Floating Action Button for Task Creation (Web Only) */}
      <button 
        onClick={() => setIsDrawerOpen(true)}
        className="hidden md:flex fixed right-10 bottom-10 w-16 h-16 primary-gradient rounded-full items-center justify-center text-white shadow-2xl shadow-primary/30 hover:scale-110 active:scale-90 transition-all z-40"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
};

export default Home;
