import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../security/supabaseClient"; // your separate client file

const hebrewMonths = [
  "", // index 0 empty for convenience
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
];

export default function Menu() {
  const [years, setYears] = useState([]);
  const [monthsByYear, setMonthsByYear] = useState({});
  const [activeYearDropdown, setActiveYearDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch distinct years on mount
  useEffect(() => {
    async function fetchYears() {
      let { data, error } = await supabase
        .from("newspapers")
        .select("year", { distinct: true, order: 'asc' });

      if (error) {
        console.error("Error fetching years:", error);
        return;
      }
      // Sort years ascending and store
      const sortedYears = data.map(row => row.year).sort((a,b) => a - b);
      setYears(sortedYears);
    }
    fetchYears();
  }, []);

  // Fetch months for a given year on demand (when dropdown opens)
  const fetchMonths = async (year) => {
    if (monthsByYear[year]) return; // already fetched

    let { data, error } = await supabase
      .from("newspapers")
      .select("month")
      .eq("year", year)
      .order("month", { ascending: true })
      .distinct();

    if (error) {
      console.error(`Error fetching months for year ${year}:`, error);
      return;
    }

    const months = data.map(row => row.month);
    setMonthsByYear(prev => ({ ...prev, [year]: months }));
  };

  const toggleYearDropdown = (year) => {
    if (activeYearDropdown === year) {
      setActiveYearDropdown(null);
    } else {
      setActiveYearDropdown(year);
      fetchMonths(year);
    }
  };

  return (
    <header className="fixed w-full bg-white shadow-sm z-50" dir="rtl">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 space-x-reverse">
          <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-800">
            רשת בני יוסף
          </span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>

        <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`}>
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-white md:flex-row md:space-x-8 md:space-x-reverse md:mt-0 md:border-0">
            {years.length === 0 && <li className="py-2 px-3 text-gray-500">טוען שנים...</li>}

            {years.map(year => (
              <li key={year} className="relative">
                <button
                  onClick={() => toggleYearDropdown(year)}
                  className="flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded hover:bg-gray-100"
                >
                  {year}
                  <svg className="w-2.5 h-2.5 mr-2.5" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                  </svg>
                </button>

                {activeYearDropdown === year && monthsByYear[year] && (
                  <div className="absolute z-10 font-normal bg-teal-50 divide-y divide-teal-100 rounded-lg shadow w-44 mt-2 right-0">
                    <ul className="py-2 text-sm text-teal-800">
                      {monthsByYear[year].map(month => (
                        <li key={month}>
                          <Link
                            to={`/newspapers/${year}/${month}`}
                            className="block px-4 py-2 hover:bg-teal-100 text-right"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {hebrewMonths[month] || month}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
