'use client'
import { useState, useEffect } from 'react'
import { supabase, type Todo } from '@/lib/supabase'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodos()
  }, [])

  async function fetchTodos() {
    const { data } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false })
    setTodos(data ?? [])
    setLoading(false)
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    const { data } = await supabase
      .from('todos')
      .insert({ title: title.trim(), is_complete: false })
      .select()
      .single()
    if (data) setTodos([data, ...todos])
    setTitle('')
  }

  async function toggleTodo(todo: Todo) {
    const { data } = await supabase
      .from('todos')
      .update({ is_complete: !todo.is_complete })
      .eq('id', todo.id)
      .select()
      .single()
    if (data) setTodos(todos.map(t => (t.id === todo.id ? data : t)))
  }

  async function deleteTodo(id: string) {
    await supabase.from('todos').delete().eq('id', id)
    setTodos(todos.filter(t => t.id !== id))
  }

  console.log(todos)

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <input type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder='할일 추가'
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            추가
          </button>
        </form>
        {loading ? (
          <div>불러오는 중.....</div>
        ) : todos.length === 0 ? (
          <div>할 일이 없습니다.</div>
        ) : (
          <ul className="space-y-2">
            {todos.map(todo => (
              <li key={todo.id} className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-sm">
                <input type="checkbox" 
                onChange={()=>toggleTodo(todo)}
                checked={todo.is_complete}/>
                <span
                  className={`flex-1 text-gray-700 ${todo.is_complete ? 'line-through text-gray-400' : ''}`}
                >
                  {todo.title}
                </span>
                <button
                  className="text-red-400 hover:text-red-600 transition-colors text-sm"
                onClick={()=>deleteTodo(todo.id)}
                >삭제</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
