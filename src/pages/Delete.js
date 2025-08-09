import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Menu from "../components/Menu"

const supabase = createClient(
  'https://mwcdepjwazbsggzotkac.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13Y2RlcGp3YXpic2dnem90a2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NzIyMTcsImV4cCI6MjA2MzM0ODIxN30.ftDUzWaSPn9l3bcpr6y8gPI9PLIaYXozYMMu6XwZDwE' // Replace with env var or secure import
)

export default function DeleteLinksPage() {
  const [filters, setFilters] = useState({ subject: '', type: '', class: '' })
  const [subjects, setSubjects] = useState([])
  const [types, setTypes] = useState([])
  const [classes, setClasses] = useState([])
  const [links, setLinks] = useState([])
  const [status, setStatus] = useState('')

  useEffect(() => {
    const fetchDropdowns = async () => {
      const [subjectsRes, typesRes, classesRes] = await Promise.all([
        supabase.from('subjects').select('subject, name'),
        supabase.from('types').select('type, name'),
        supabase.from('classes').select('class, name'),
      ])
      if (!subjectsRes.error) setSubjects(subjectsRes.data)
      if (!typesRes.error) setTypes(typesRes.data)
      if (!classesRes.error) setClasses(classesRes.data)
    }

    fetchDropdowns()
  }, [])

  const fetchLinks = async () => {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .match({
        subject: filters.subject,
        type: filters.type,
        class: filters.class
      })

    if (!error) {
      setLinks(data)
    } else {
      console.error(error)
    }
  }

  const handleDelete = async (linkId) => {
    const { error } = await supabase.from('links').delete().eq('link_num', linkId)
    if (error) {
      console.error(error)
      setStatus('שגיאה במחיקת הקישור.')
    } else {
      setStatus('הקישור נמחק בהצלחה.')
      setLinks(links.filter(link => link.link_num !== linkId))
    }
  }

  return (
    <div className="bg-white min-h-screen" dir="rtl">
      <Menu />

      <div className="max-w-5xl mx-auto py-24 px-6">
        <h1 className="text-3xl font-bold text-center mb-8">מחיקת קישורים</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <select
            className="border rounded-lg p-2"
            value={filters.class}
            onChange={(e) => setFilters({ ...filters, class: e.target.value })}
          >
            <option value="">בחר כיתה</option>
            {classes.map((c) => (
              <option key={c.class} value={c.class}>{c.name}</option>
            ))}
          </select>

          <select
            className="border rounded-lg p-2"
            value={filters.subject}
            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
          >
            <option value="">בחר מקצוע</option>
            {subjects.map((s) => (
              <option key={s.subject} value={s.subject}>{s.name}</option>
            ))}
          </select>

          <select
            className="border rounded-lg p-2"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">בחר סוג</option>
            {types.map((t) => (
              <option key={t.type} value={t.type}>{t.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={fetchLinks}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition mb-8"
        >
          הצג קישורים
        </button>

        {status && <p className="text-green-600 text-center mb-4">{status}</p>}

        {/* Links List */}
        {links.length > 0 ? (
          <ul className="space-y-4">
            {links.map(link => (
              <li key={link.link_num} className="bg-gray-50 p-4 rounded-lg shadow flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{link.name}</p>
                  <a href={link.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm break-all">
                    {link.link}
                  </a>
                </div>
                <button
                  onClick={() => handleDelete(link.link_num)}
                  className="mt-3 sm:mt-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  מחק
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 mt-6">לא נמצאו קישורים.</p>
        )}
      </div>
    </div>
  )
}
