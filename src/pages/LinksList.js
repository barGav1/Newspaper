// src/pages/LinksList.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createClient } from '@supabase/supabase-js'
import Menu from "../components/Menu";
import "../styles/Home.css"; 


const supabase = createClient(
  'https://mwcdepjwazbsggzotkac.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13Y2RlcGp3YXpic2dnem90a2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NzIyMTcsImV4cCI6MjA2MzM0ODIxN30.ftDUzWaSPn9l3bcpr6y8gPI9PLIaYXozYMMu6XwZDwE'
)

function LinksList() {
  const { classId, subjectId, infoId } = useParams();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLinks() {
      setLoading(true);
      const { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("class", parseInt(classId))
        .eq("subject", parseInt(subjectId))
        .eq("type", parseInt(infoId));

      if (error) {
        console.error("Error fetching links:", error.message);
      } else {
        console.log("Links from Supabase:", data);
        setLinks(data);
      }

      setLoading(false);
    }

    fetchLinks();
  }, [classId, subjectId, infoId]);

  return (
    <div className="bg-white min-h-screen">
      <Menu />

      {/* Hero section with proper spacing */}
      <div className="relative isolate px-6 pt-24 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-300 to-blue-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          ></div>
        </div>

        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="p-8 max-w-3xl mx-auto" dir="rtl">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">קישורים</h1>
            {loading ? (
              <p className="text-gray-500">טוען קישורים...</p>
            ) : links.length === 0 ? (
              <p className="text-gray-500">לא נמצאו קישורים מתאימים.</p>
            ) : (
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.link_num} className="p-4 border rounded-lg shadow-sm bg-white">
                    <a
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-lg"
                    >
                      {link.name || link.link}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blue-300 to-blue-500 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default LinksList;
