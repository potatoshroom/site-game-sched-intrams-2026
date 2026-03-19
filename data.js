// ── SCHEDULE DATA ──
// Edit this file to update match results, times, venues, and opponents.
// result: "win" | "lose"        — omit if not yet played
// tbd: true                     — time is a slot (e.g. "2nd Game PM"), not exact
// score: { site: X, opp: Y }   — fill in both to show score on overlay; leave null to hide

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
          matches: [
            {
              time: "2:30 PM",
              opp: "CISTE",
              result: "lose",
              score: { site: 80, opp: 93 },
            },
          ],
        },
        {
          sport: "volleyball",
          icon: "ico-volleyball",
          label: "Volleyball — Men",
          venue: "Leisure Coast Court 1",
          matches: [
            {
              time: "2nd Game PM",
              tbd: true,
              opp: "CISTE",
              result: "win",
              score: { site: 2, opp: 1 },
            },
          ],
        },
        {
          sport: "volleyball",
          icon: "ico-volleyball",
          label: "Volleyball — Women",
          venue: "Leisure Coast Court 2",
          matches: [
            {
              time: "2nd Game PM",
              tbd: true,
              opp: "CISTE",
              result: "win",
              score: { site: 2, opp: 0 },
            },
          ],
        },
        {
          sport: "beach",
          icon: "ico-beach",
          label: "Beach Volleyball — Men",
          venue: "Sand Area",
          matches: [
            {
              time: "2nd Game PM",
              tbd: true,
              opp: "CISTE",
              result: "lose",
              score: { site: null, opp: null },
            },
            {
              time: "6th Game PM",
              tbd: true,
              opp: "SOHE",
              result: "lose",
              score: { site: null, opp: null },
            },
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
            {
              time: "11:00 AM",
              opp: "SOHE",
              result: "win",
              score: { site: 74, opp: 56 },
            },
            { time: "4:00 PM", opp: "SOHS", score: { site: null, opp: null } },
          ],
        },
        {
          sport: "basketball",
          icon: "ico-basketball",
          label: "Basketball — Women (3v3)",
          venue: "LCR Gym Court #1",
          matches: [
            {
              time: "8:15 AM",
              opp: "CISTE",
              result: "lose",
              score: { site: null, opp: null },
            },
            {
              time: "9:15 AM",
              opp: "SOHE",
              result: "win",
              score: { site: null, opp: null },
            },
            {
              time: "10:00 AM",
              opp: "SOHS",
              result: "win",
              score: { site: null, opp: null },
            },
            {
              time: "10:30 AM",
              opp: "SBA",
              result: "lose",
              score: { site: null, opp: null },
            },
            { time: "11:00 AM", opp: "SIHM", score: { site: null, opp: null } },
          ],
        },
        {
          sport: "volleyball",
          icon: "ico-volleyball",
          label: "Volleyball — Men",
          venue: "Leisure Coast Court 1",
          matches: [
            {
              time: "3rd Game AM",
              tbd: true,
              opp: "SOHE",
              score: { site: null, opp: null },
            },
            {
              time: "3rd Game PM",
              tbd: true,
              opp: "SOHS",
              score: { site: null, opp: null },
            },
          ],
        },
        {
          sport: "volleyball",
          icon: "ico-volleyball",
          label: "Volleyball — Women",
          venue: "Leisure Coast Court 2",
          matches: [
            {
              time: "3rd Game AM",
              tbd: true,
              opp: "SOHE",
              score: { site: null, opp: null },
            },
            {
              time: "3rd Game PM",
              tbd: true,
              opp: "SOHS",
              score: { site: null, opp: null },
            },
          ],
        },
        {
          sport: "beach",
          icon: "ico-beach",
          label: "Beach Volleyball — Women",
          venue: "Sand Area",
          matches: [
            {
              time: "2nd Game AM",
              tbd: true,
              opp: "CISTE",
              result: "lose",
              score: { site: null, opp: null },
            },
            {
              time: "6th Game AM",
              tbd: true,
              opp: "SOHE",
              result: "win",
              score: { site: null, opp: null },
            },
          ],
        },
        {
          sport: "beach",
          icon: "ico-beach",
          label: "Beach Volleyball — Men",
          venue: "Sand Area",
          matches: [
            {
              time: "3rd Game PM",
              tbd: true,
              opp: "SOHS",
              score: { site: null, opp: null },
            },
            {
              time: "5th Game PM",
              tbd: true,
              opp: "SBA",
              score: { site: null, opp: null },
            },
          ],
        },
        {
          sport: "chess",
          icon: "ico-chess",
          label: "Chess — Men (Individual)",
          venue: "Library · VPA Building",
          matches: [
            {
              time: "8:30 AM",
              opp: "CISTE",
              result: "win",
              score: { site: null, opp: null },
            },
            {
              time: "10:30 AM",
              opp: "SOHE",
              result: "win",
              score: { site: null, opp: null },
            },
            {
              time: "1:00 PM",
              opp: "SOHS",
              result: "win",
              score: { site: null, opp: null },
            },
            {
              time: "2:00 PM",
              opp: "SBA",
              result: "win",
              score: { site: null, opp: null },
            },
            {
              time: "3:00 PM",
              opp: "SIHM",
              result: "win",
              score: { site: null, opp: null },
            },
            {
              time: "4:30 PM",
              opp: "SOHS",
              stage: "semis",
              result: "win",
              score: { site: null, opp: null },
            },
            {
              time: "After Semis",
              tbd: true,
              opp: "SOHE",
              stage: "finals",
              result: "win",
              score: { site: null, opp: null },
            },
          ],
        },
        {
          sport: "chess",
          icon: "ico-chess",
          label: "Chess — Women (Individual)",
          venue: "Library · VPA Building",
          matches: [
            {
              time: "8:30 AM",
              opp: "CISTE",
              result: "win",
              score: { site: null, opp: null },
            },
            {
              time: "10:30 AM",
              opp: "SOHE",
              result: "lose",
              score: { site: null, opp: null },
            },
            {
              time: "1:00 PM",
              opp: "SOHS",
              result: "lose",
              score: { site: null, opp: null },
            },
            {
              time: "2:00 PM",
              opp: "SBA",
              result: "win",
              score: { site: null, opp: null },
            },
            {
              time: "3:00 PM",
              opp: "SIHM",
              result: "win",
              score: { site: null, opp: null },
            },
            {
              time: "4:30 PM",
              opp: "SOHS",
              stage: "semis",
              result: "lose",
              score: { site: null, opp: null },
            },
            {
              time: "After Semis",
              tbd: true,
              opp: "SOHE",
              stage: "3rd",
              result: "win",
              score: { site: null, opp: null },
            },
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
            { time: "9:30 AM", opp: "SBA", score: { site: null, opp: null } },
            { time: "1:00 PM", opp: "SIHM", score: { site: null, opp: null } },
          ],
        },
        {
          sport: "volleyball",
          icon: "ico-volleyball",
          label: "Volleyball — Men",
          venue: "Leisure Coast Court 1",
          matches: [
            {
              time: "2nd Game AM",
              tbd: true,
              opp: "SBA",
              score: { site: null, opp: null },
            },
            { time: "1:00 PM", opp: "SIHM", score: { site: null, opp: null } },
          ],
        },
        {
          sport: "volleyball",
          icon: "ico-volleyball",
          label: "Volleyball — Women",
          venue: "Leisure Coast Court 2",
          matches: [
            {
              time: "2nd Game AM",
              tbd: true,
              opp: "SBA",
              score: { site: null, opp: null },
            },
            { time: "1:00 PM", opp: "SIHM", score: { site: null, opp: null } },
          ],
        },
        {
          sport: "beach",
          icon: "ico-beach",
          label: "Beach Volleyball — Women",
          venue: "Sand Area",
          matches: [
            {
              time: "3rd Game AM",
              tbd: true,
              opp: "SOHS",
              score: { site: null, opp: null },
            },
            {
              time: "5th Game AM",
              tbd: true,
              opp: "SBA",
              score: { site: null, opp: null },
            },
            { time: "3:00 PM", opp: "SIHM", score: { site: null, opp: null } },
          ],
        },
        {
          sport: "beach",
          icon: "ico-beach",
          label: "Beach Volleyball — Men",
          venue: "Sand Area",
          matches: [
            { time: "1:00 PM", opp: "SIHM", score: { site: null, opp: null } },
          ],
        },
        {
          sport: "scrabble",
          icon: "ico-scrabble",
          label: "Scrabble — Men (Singles)",
          venue: "Library",
          matches: [
            { time: "8:30 AM", opp: "CISTE", score: { site: null, opp: null } },
            { time: "9:55 AM", opp: "SOHE", score: { site: null, opp: null } },
            { time: "10:55 AM", opp: "SOHS", score: { site: null, opp: null } },
            { time: "11:30 AM", opp: "SBA", score: { site: null, opp: null } },
            { time: "1:00 PM", opp: "SIHM", score: { site: null, opp: null } },
          ],
        },
        {
          sport: "scrabble",
          icon: "ico-scrabble",
          label: "Scrabble — Women (Singles)",
          venue: "Library",
          matches: [
            { time: "8:30 AM", opp: "CISTE", score: { site: null, opp: null } },
            { time: "9:55 AM", opp: "SOHE", score: { site: null, opp: null } },
            { time: "11:55 AM", opp: "SOHS", score: { site: null, opp: null } },
            { time: "1:30 PM", opp: "SBA", score: { site: null, opp: null } },
            { time: "2:00 PM", opp: "SIHM", score: { site: null, opp: null } },
          ],
        },
        {
          sport: "scrabble",
          icon: "ico-scrabble",
          label: "Scrabble — Mixed Doubles",
          venue: "Library",
          matches: [
            { time: "3:30 PM", opp: "CISTE", score: { site: null, opp: null } },
            { time: "3:55 PM", opp: "SOHE", score: { site: null, opp: null } },
            { time: "4:55 PM", opp: "SOHS", score: { site: null, opp: null } },
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
            { time: "8:00 AM", opp: "SIHM", score: { site: null, opp: null } },
            { time: "8:30 AM", opp: "SBA", score: { site: null, opp: null } },
          ],
        },
        {
          sport: "tabletennis",
          icon: "ico-tabletennis",
          label: "Table Tennis — Men",
          venue: "Nikki's Garden",
          matches: [
            { time: "8:30 AM", opp: "CISTE", score: { site: null, opp: null } },
            { time: "10:30 AM", opp: "SOHE", score: { site: null, opp: null } },
            { time: "1:00 PM", opp: "SOHS", score: { site: null, opp: null } },
            { time: "2:00 PM", opp: "SBA", score: { site: null, opp: null } },
            { time: "3:00 PM", opp: "SIHM", score: { site: null, opp: null } },
          ],
        },
        {
          sport: "tabletennis",
          icon: "ico-tabletennis",
          label: "Table Tennis — Women",
          venue: "Nikki's Garden",
          matches: [
            { time: "8:30 AM", opp: "CISTE", score: { site: null, opp: null } },
            { time: "10:30 AM", opp: "SOHE", score: { site: null, opp: null } },
            { time: "1:00 PM", opp: "SOHS", score: { site: null, opp: null } },
            { time: "2:00 PM", opp: "SBA", score: { site: null, opp: null } },
            { time: "3:00 PM", opp: "SIHM", score: { site: null, opp: null } },
          ],
        },
        {
          sport: "tabletennis",
          icon: "ico-tabletennis",
          label: "Table Tennis — Mixed Doubles",
          venue: "Nikki's Garden",
          matches: [
            { time: "8:30 AM", opp: "CISTE", score: { site: null, opp: null } },
            { time: "10:30 AM", opp: "SOHE", score: { site: null, opp: null } },
            { time: "1:00 PM", opp: "SOHS", score: { site: null, opp: null } },
            { time: "2:00 PM", opp: "SBA", score: { site: null, opp: null } },
            { time: "3:00 PM", opp: "SIHM", score: { site: null, opp: null } },
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
            { time: "8:30 AM", opp: "CISTE", score: { site: null, opp: null } },
            { time: "10:30 AM", opp: "SOHE", score: { site: null, opp: null } },
            { time: "1:00 PM", opp: "SOHS", score: { site: null, opp: null } },
            { time: "2:00 PM", opp: "SBA", score: { site: null, opp: null } },
            { time: "3:00 PM", opp: "SIHM", score: { site: null, opp: null } },
          ],
        },
        {
          sport: "badminton",
          icon: "ico-badminton",
          label: "Badminton — Women",
          venue: "Nikki's Garden / LCR Gym",
          highlight: true,
          matches: [
            { time: "8:30 AM", opp: "CISTE", score: { site: null, opp: null } },
            { time: "10:30 AM", opp: "SOHE", score: { site: null, opp: null } },
            { time: "1:00 PM", opp: "SOHS", score: { site: null, opp: null } },
            { time: "2:00 PM", opp: "SBA", score: { site: null, opp: null } },
            { time: "3:00 PM", opp: "SIHM", score: { site: null, opp: null } },
          ],
        },
        {
          sport: "badminton",
          icon: "ico-badminton",
          label: "Badminton — Mixed Doubles",
          venue: "Nikki's Garden / LCR Gym",
          highlight: true,
          matches: [
            { time: "8:30 AM", opp: "CISTE", score: { site: null, opp: null } },
            { time: "10:30 AM", opp: "SOHE", score: { site: null, opp: null } },
            { time: "1:00 PM", opp: "SOHS", score: { site: null, opp: null } },
            { time: "2:00 PM", opp: "SBA", score: { site: null, opp: null } },
            { time: "3:00 PM", opp: "SIHM", score: { site: null, opp: null } },
          ],
        },
      ],
    },
  ],
};

// ── TALLY META ──
// semis / finals: "win" | "lose" | null (null = not yet played / N/A)
// result: "Champion" | "Runner-up" | "3rd Place" | any string | null
// semis / finals results are derived automatically from matches with stage: "semis"/"finals" in SCHEDULE_DATA.
// Only set result here: "Champion" | "Runner-up" | "3rd Place" | null
const TALLY_META = {
  "Basketball — Men (5v5)": { result: null },
  "Basketball — Women (3v3)": { result: null },
  "Volleyball — Men": { result: null },
  "Volleyball — Women": { result: null },
  "Beach Volleyball — Men": { result: null },
  "Beach Volleyball — Women": { result: null },
  "Chess — Men (Individual)": { result: "Champion" },
  "Chess — Women (Individual)": { result: "3rd Place" },
  "Scrabble — Men (Singles)": { result: null },
  "Scrabble — Women (Singles)": { result: null },
  "Scrabble — Mixed Doubles": { result: null },
  "Table Tennis — Men": { result: null },
  "Table Tennis — Women": { result: null },
  "Table Tennis — Mixed Doubles": { result: null },
  "Badminton — Men": { result: null },
  "Badminton — Women": { result: null },
  "Badminton — Mixed Doubles": { result: null },
};
