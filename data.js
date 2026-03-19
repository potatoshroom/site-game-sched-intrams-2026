// ── SCHEDULE DATA ──
// Edit this file to update match results, times, venues, and opponents.
// result: "win" | "lose"  — omit if not yet played
// tbd: true               — time is a slot (e.g. "2nd Game PM"), not exact

const SCHEDULE_DATA = {
  days: [
    {
      day: 18,
      name: "Wednesday",
      date: "March 18, 2026",
      sections: [
        {
          sport: "basketball",
          icon: "ico-basketball",
          label: "Basketball — Men (5v5)",
          venue: "Leisure Coast Gym",
          matches: [{ time: "2:30 PM", opp: "CISTE", result: "lose", score: { site: 70, opp: 83 } }],
        },
        {
          sport: "volleyball",
          icon: "ico-volleyball",
          label: "Volleyball — Men",
          venue: "Leisure Coast Court 1",
          matches: [
            { time: "2nd Game PM", tbd: true, opp: "CISTE", result: "win" },
          ],
        },
        {
          sport: "volleyball",
          icon: "ico-volleyball",
          label: "Volleyball — Women",
          venue: "Leisure Coast Court 2",
          matches: [
            { time: "2nd Game PM", tbd: true, opp: "CISTE", result: "win" },
          ],
        },
        {
          sport: "beach",
          icon: "ico-beach",
          label: "Beach Volleyball — Men",
          venue: "Sand Area",
          matches: [
            { time: "2nd Game PM", tbd: true, opp: "CISTE", result: "lose" },
            { time: "6th Game PM", tbd: true, opp: "SOHE", result: "lose" },
          ],
        },
      ],
    },
    {
      day: 19,
      name: "Thursday",
      date: "March 19, 2026",
      sections: [
        {
          sport: "basketball",
          icon: "ico-basketball",
          label: "Basketball — Men (5v5)",
          venue: "UDD Quadrangle",
          matches: [
            { time: "11:00 AM", opp: "SOHE", result: "win" },
            { time: "4:00 PM", opp: "SOHS" },
          ],
        },
        {
          sport: "basketball",
          icon: "ico-basketball",
          label: "Basketball — Women (3v3)",
          venue: "LCR Gym Court #1",
          matches: [
            { time: "8:15 AM", opp: "CISTE", result: "lose" },
            { time: "9:15 AM", opp: "SOHE", result: "win" },
            { time: "10:00 AM", opp: "SOHS", result: "win" },
            { time: "10:30 AM", opp: "SBA", result: "lose" },
            { time: "11:00 AM", opp: "SIHM" },
          ],
        },
        {
          sport: "volleyball",
          icon: "ico-volleyball",
          label: "Volleyball — Men",
          venue: "Leisure Coast Court 1",
          matches: [
            { time: "3rd Game AM", tbd: true, opp: "SOHE" },
            { time: "3rd Game PM", tbd: true, opp: "SOHS" },
          ],
        },
        {
          sport: "volleyball",
          icon: "ico-volleyball",
          label: "Volleyball — Women",
          venue: "Leisure Coast Court 2",
          matches: [
            { time: "3rd Game AM", tbd: true, opp: "SOHE" },
            { time: "3rd Game PM", tbd: true, opp: "SOHS" },
          ],
        },
        {
          sport: "beach",
          icon: "ico-beach",
          label: "Beach Volleyball — Women",
          venue: "Sand Area",
          matches: [
            { time: "2nd Game AM", tbd: true, opp: "CISTE", result: "lose" },
            { time: "6th Game AM", tbd: true, opp: "SOHE", result: "win" },
          ],
        },
        {
          sport: "beach",
          icon: "ico-beach",
          label: "Beach Volleyball — Men",
          venue: "Sand Area",
          matches: [
            { time: "3rd Game PM", tbd: true, opp: "SOHS" },
            { time: "5th Game PM", tbd: true, opp: "SBA" },
          ],
        },
        {
          sport: "chess",
          icon: "ico-chess",
          label: "Chess — Men (Individual)",
          venue: "Library · VPA Building",
          matches: [
            { time: "8:30 AM", opp: "CISTE", result: "win" },
            { time: "10:30 AM", opp: "SOHE", result: "win" },
            { time: "1:00 PM", opp: "SOHS", result: "win" },
            { time: "2:00 PM", opp: "SBA", result: "win" },
            { time: "3:00 PM", opp: "SIHM" },
          ],
        },
        {
          sport: "chess",
          icon: "ico-chess",
          label: "Chess — Women (Individual)",
          venue: "Library · VPA Building",
          matches: [
            { time: "8:30 AM", opp: "CISTE", result: "win" },
            { time: "10:30 AM", opp: "SOHE", result: "lose" },
            { time: "1:00 PM", opp: "SOHS", result: "win" },
            { time: "2:00 PM", opp: "SBA", result: "win" },
            { time: "3:00 PM", opp: "SIHM" },
          ],
        },
      ],
    },
    {
      day: 23,
      name: "Monday",
      date: "March 23, 2026",
      sections: [
        {
          sport: "basketball",
          icon: "ico-basketball",
          label: "Basketball — Men (5v5)",
          venue: "UDD Quadrangle",
          matches: [
            { time: "9:30 AM", opp: "SBA" },
            { time: "1:00 PM", opp: "SIHM" },
          ],
        },
        {
          sport: "volleyball",
          icon: "ico-volleyball",
          label: "Volleyball — Men",
          venue: "Leisure Coast Court 1",
          matches: [
            { time: "2nd Game AM", tbd: true, opp: "SBA" },
            { time: "1:00 PM", opp: "SIHM" },
          ],
        },
        {
          sport: "volleyball",
          icon: "ico-volleyball",
          label: "Volleyball — Women",
          venue: "Leisure Coast Court 2",
          matches: [
            { time: "2nd Game AM", tbd: true, opp: "SBA" },
            { time: "1:00 PM", opp: "SIHM" },
          ],
        },
        {
          sport: "beach",
          icon: "ico-beach",
          label: "Beach Volleyball — Women",
          venue: "Sand Area",
          matches: [
            { time: "3rd Game AM", tbd: true, opp: "SOHS" },
            { time: "5th Game AM", tbd: true, opp: "SBA" },
            { time: "3:00 PM", opp: "SIHM" },
          ],
        },
        {
          sport: "beach",
          icon: "ico-beach",
          label: "Beach Volleyball — Men",
          venue: "Sand Area",
          matches: [{ time: "1:00 PM", opp: "SIHM" }],
        },
        {
          sport: "scrabble",
          icon: "ico-scrabble",
          label: "Scrabble — Men (Singles)",
          venue: "Library",
          matches: [
            { time: "8:30 AM", opp: "CISTE" },
            { time: "9:55 AM", opp: "SOHE" },
            { time: "10:55 AM", opp: "SOHS" },
            { time: "11:30 AM", opp: "SBA" },
            { time: "1:00 PM", opp: "SIHM" },
          ],
        },
        {
          sport: "scrabble",
          icon: "ico-scrabble",
          label: "Scrabble — Women (Singles)",
          venue: "Library",
          matches: [
            { time: "8:30 AM", opp: "CISTE" },
            { time: "9:55 AM", opp: "SOHE" },
            { time: "11:55 AM", opp: "SOHS" },
            { time: "1:30 PM", opp: "SBA" },
            { time: "2:00 PM", opp: "SIHM" },
          ],
        },
        {
          sport: "scrabble",
          icon: "ico-scrabble",
          label: "Scrabble — Mixed Doubles",
          venue: "Library",
          matches: [
            { time: "3:30 PM", opp: "CISTE" },
            { time: "3:55 PM", opp: "SOHE" },
            { time: "4:55 PM", opp: "SOHS" },
          ],
        },
      ],
    },
    {
      day: 24,
      name: "Tuesday",
      date: "March 24, 2026",
      sections: [
        {
          sport: "scrabble",
          icon: "ico-scrabble",
          label: "Scrabble — Mixed Doubles",
          venue: "Library",
          matches: [
            { time: "8:00 AM", opp: "SIHM" },
            { time: "8:30 AM", opp: "SBA" },
          ],
        },
        {
          sport: "tabletennis",
          icon: "ico-tabletennis",
          label: "Table Tennis — Men",
          venue: "Nikki's Garden",
          matches: [
            { time: "8:30 AM", opp: "CISTE" },
            { time: "10:30 AM", opp: "SOHE" },
            { time: "1:00 PM", opp: "SOHS" },
            { time: "2:00 PM", opp: "SBA" },
            { time: "3:00 PM", opp: "SIHM" },
          ],
        },
        {
          sport: "tabletennis",
          icon: "ico-tabletennis",
          label: "Table Tennis — Women",
          venue: "Nikki's Garden",
          matches: [
            { time: "8:30 AM", opp: "CISTE" },
            { time: "10:30 AM", opp: "SOHE" },
            { time: "1:00 PM", opp: "SOHS" },
            { time: "2:00 PM", opp: "SBA" },
            { time: "3:00 PM", opp: "SIHM" },
          ],
        },
        {
          sport: "tabletennis",
          icon: "ico-tabletennis",
          label: "Table Tennis — Mixed Doubles",
          venue: "Nikki's Garden",
          matches: [
            { time: "8:30 AM", opp: "CISTE" },
            { time: "10:30 AM", opp: "SOHE" },
            { time: "1:00 PM", opp: "SOHS" },
            { time: "2:00 PM", opp: "SBA" },
            { time: "3:00 PM", opp: "SIHM" },
          ],
        },
      ],
    },
    {
      day: 25,
      name: "Wednesday",
      date: "March 25, 2026",
      sections: [
        {
          sport: "badminton",
          icon: "ico-badminton",
          label: "Badminton — Men",
          venue: "Nikki's Garden / LCR Gym",
          highlight: true,
          matches: [
            { time: "8:30 AM", opp: "CISTE" },
            { time: "10:30 AM", opp: "SOHE" },
            { time: "1:00 PM", opp: "SOHS" },
            { time: "2:00 PM", opp: "SBA" },
            { time: "3:00 PM", opp: "SIHM" },
          ],
        },
        {
          sport: "badminton",
          icon: "ico-badminton",
          label: "Badminton — Women",
          venue: "Nikki's Garden / LCR Gym",
          highlight: true,
          matches: [
            { time: "8:30 AM", opp: "CISTE" },
            { time: "10:30 AM", opp: "SOHE" },
            { time: "1:00 PM", opp: "SOHS" },
            { time: "2:00 PM", opp: "SBA" },
            { time: "3:00 PM", opp: "SIHM" },
          ],
        },
        {
          sport: "badminton",
          icon: "ico-badminton",
          label: "Badminton — Mixed Doubles",
          venue: "Nikki's Garden / LCR Gym",
          highlight: true,
          matches: [
            { time: "8:30 AM", opp: "CISTE" },
            { time: "10:30 AM", opp: "SOHE" },
            { time: "1:00 PM", opp: "SOHS" },
            { time: "2:00 PM", opp: "SBA" },
            { time: "3:00 PM", opp: "SIHM" },
          ],
        },
      ],
    },
  ],
};
