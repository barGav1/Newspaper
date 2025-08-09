import { useState } from 'react'
import { supabase } from '../security/supabaseClient'
import { UPLOAD_PASSCODE } from '../security/config'
import Menu from "../components/Menu";
import "../styles/Home.css"; 

export default function UploadNewspaperPage() {
  const [file, setFile] = useState(null)
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [status, setStatus] = useState('')
  const [uploading, setUploading] = useState(false)
  const [enteredPasscode, setEnteredPasscode] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  const years = Array.from({ length: 21 }, (_, i) => 2020 + i)
  const months = [
    { value: 1, label: "ינואר" }, { value: 2, label: "פברואר" },
    { value: 3, label: "מרץ" }, { value: 4, label: "אפריל" },
    { value: 5, label: "מאי" }, { value: 6, label: "יוני" },
    { value: 7, label: "יולי" }, { value: 8, label: "אוגוסט" },
    { value: 9, label: "ספטמבר" }, { value: 10, label: "אוקטובר" },
    { value: 11, label: "נובמבר" }, { value: 12, label: "דצמבר" }
  ]

  const handleFileChange = (e) => setFile(e.target.files[0])

  const handleLogin = () => {
    if (enteredPasscode === UPLOAD_PASSCODE) {
      setAuthenticated(true)
      setStatus('')
    } else {
      setStatus('סיסמה שגויה')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !year || !month) {
      setStatus("אנא מלא את כל השדות ובחר קובץ.")
      return
    }

    setUploading(true)
    setStatus("מעלה קובץ...")

    const filePath = `${year}/${month}/${Date.now()}_${file.name}`

    const { error: uploadError } = await supabase.storage
      .from("newspapers")
      .upload(filePath, file)

    if (uploadError) {
      console.error(uploadError)
      setStatus("שגיאה בהעלאת הקובץ.")
      setUploading(false)
      return
    }

    const { data: publicUrlData } = supabase
      .storage
      .from("newspapers")
      .getPublicUrl(filePath)

    const fileUrl = publicUrlData.publicUrl

    const { error: dbError } = await supabase
      .from("newspapers")
      .insert([{ year: parseInt(year), month: parseInt(month), file_url: fileUrl }])

    setUploading(false)

    if (dbError) {
      console.error(dbError)
      setStatus("שגיאה בשמירת הנתונים במסד.")
    } else {
      setStatus("העיתון הועלה בהצלחה!")
      setFile(null)
      setYear('')
      setMonth('')
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <Menu />
      <div className="relative isolate px-6 pt-24 lg:px-8" dir="rtl">

        {/* Passcode screen */}
        {!authenticated ? (
          <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-center">הזן סיסמה</h2>
            <input
              type="password"
              value={enteredPasscode}
              onChange={(e) => setEnteredPasscode(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
              placeholder="סיסמה"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              כניסה
            </button>
            {status && <p className="text-center text-sm text-red-600 mt-4">{status}</p>}
          </div>
        ) : (
          // Upload form
          <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 border border-gray-200">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">העלאת עיתון</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">שנה</label>
                  <select value={year} onChange={(e) => setYear(e.target.value)} required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right">
                    <option value="">בחר שנה</option>
                    {years.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                {/* Month */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">חודש</label>
                  <select value={month} onChange={(e) => setMonth(e.target.value)} required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right">
                    <option value="">בחר חודש</option>
                    {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>
                {/* File */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">קובץ PDF</label>
                  <input type="file" accept="application/pdf" onChange={handleFileChange} required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
              </div>
              <button type="submit" disabled={uploading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg">
                {uploading ? "מעלה..." : "שלח"}
              </button>
              {status && <p className="text-center text-sm text-green-600 mt-4">{status}</p>}
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
