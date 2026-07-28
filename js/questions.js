/**
 * BrainSpark Question Engine & Data Bank
 * Provides curated internal questions with detailed educational insights,
 * plus OpenTriviaDB API integration for live online questions.
 */

export const CATEGORIES = [
    { id: 'all', name: 'All Topics', icon: '✨', color: '#6366f1' },
    { id: 'science', name: 'Science & Nature', icon: '🔬', color: '#10b981' },
    { id: 'history', name: 'World History', icon: '🏛️', color: '#f59e0b' },
    { id: 'tech', name: 'Technology & Tech', icon: '💻', color: '#06b6d4' },
    { id: 'geography', name: 'Geography & Earth', icon: '🌍', color: '#3b82f6' },
    { id: 'arts', name: 'Arts & Culture', icon: '🎨', color: '#ec4899' },
    { id: 'general', name: 'General Knowledge', icon: '🧠', color: '#8b5cf6' }
];

export const INITIAL_QUESTIONS = [
    // --- SCIENCE & NATURE ---
    {
        id: 'sci_1',
        category: 'science',
        difficulty: 'easy',
        question: 'What element makes up approximately 78% of Earth\'s atmosphere?',
        options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon'],
        correctIndex: 1,
        explanation: 'Nitrogen gas (N₂) makes up roughly 78.08% of Earth\'s dry atmosphere. Oxygen accounts for about 20.95%, while Argon makes up 0.93%!'
    },
    {
        id: 'sci_2',
        category: 'science',
        difficulty: 'medium',
        question: 'Which subatomic particle carries a negative electric charge?',
        options: ['Proton', 'Neutron', 'Electron', 'Quark'],
        correctIndex: 2,
        explanation: 'Electrons carry a negative charge (-1e) and orbit the nucleus of an atom, which contains positively charged protons and neutral neutrons.'
    },
    {
        id: 'sci_3',
        category: 'science',
        difficulty: 'hard',
        question: 'What is the speed of light in a vacuum (rounded)?',
        options: ['150,000 km/s', '299,792 km/s', '343,000 km/s', '1,080,000 km/s'],
        correctIndex: 1,
        explanation: 'The exact speed of light in a vacuum is 299,792,458 meters per second (approx. 300,000 km/s or 186,282 miles per second).'
    },
    {
        id: 'sci_4',
        category: 'science',
        difficulty: 'easy',
        question: 'What organ in the human body consumes the most energy relative to its weight?',
        options: ['Liver', 'Heart', 'Brain', 'Kidneys'],
        correctIndex: 2,
        explanation: 'The human brain accounts for only ~2% of total body weight, but consumes over 20% of the body\'s glucose and oxygen energy reserves!'
    },
    {
        id: 'sci_5',
        category: 'science',
        difficulty: 'medium',
        question: 'Which plant pigment absorbs red and blue light to power photosynthesis?',
        options: ['Carotenoid', 'Chlorophyll', 'Anthocyanin', 'Xanthophyll'],
        correctIndex: 1,
        explanation: 'Chlorophyll absorbs red and blue wavelengths of light while reflecting green light, which gives plants their green color.'
    },

    // --- HISTORY ---
    {
        id: 'hist_1',
        category: 'history',
        difficulty: 'easy',
        question: 'In which year did the Apollo 11 moon landing take place?',
        options: ['1965', '1969', '1972', '1961'],
        correctIndex: 1,
        explanation: 'On July 20, 1969, astronaut Neil Armstrong became the first human to step onto the lunar surface during NASA\'s Apollo 11 mission.'
    },
    {
        id: 'hist_2',
        category: 'history',
        difficulty: 'medium',
        question: 'Who was the ancient Egyptian queen known for her alliance with Julius Caesar and Mark Antony?',
        options: ['Nefertiti', 'Hatshepsut', 'Cleopatra VII', 'Merneith'],
        correctIndex: 2,
        explanation: 'Cleopatra VII Philopator was the last active ruler of the Ptolemaic Kingdom of Egypt, famous for her political astuteness and Roman alliances.'
    },
    {
        id: 'hist_3',
        category: 'history',
        difficulty: 'hard',
        question: 'Which battle in 1815 marked the final defeat of Napoleon Bonaparte?',
        options: ['Battle of Austerlitz', 'Battle of Waterloo', 'Battle of Leipzig', 'Battle of Trafalgar'],
        correctIndex: 1,
        explanation: 'The Battle of Waterloo in present-day Belgium saw Napoleon defeated by Seventh Coalition forces under the Duke of Wellington and Field Marshal von Blücher.'
    },
    {
        id: 'hist_4',
        category: 'history',
        difficulty: 'easy',
        question: 'What ancient civilization constructed the city of Machu Picchu high in the Andes?',
        options: ['Aztecs', 'Mayans', 'Incas', 'Olmecs'],
        correctIndex: 2,
        explanation: 'Machu Picchu was built in the 15th century by the Inca Empire under Emperor Pachacuti in modern-day Peru.'
    },

    // --- TECH & COMPUTER SCIENCE ---
    {
        id: 'tech_1',
        category: 'tech',
        difficulty: 'easy',
        question: 'What does "HTML" stand for in web development?',
        options: ['HyperText Markup Language', 'High-Tech Modern Language', 'Hyperlink Text Manager Logic', 'Home Tool Markup Language'],
        correctIndex: 0,
        explanation: 'HTML stands for HyperText Markup Language. It provides the standard structure and semantics for documents designed to be displayed in web browsers.'
    },
    {
        id: 'tech_2',
        category: 'tech',
        difficulty: 'medium',
        question: 'Who is widely credited as the world\'s first computer programmer?',
        options: ['Alan Turing', 'Ada Lovelace', 'Grace Hopper', 'Charles Babbage'],
        correctIndex: 1,
        explanation: 'Ada Lovelace wrote an algorithm in 1843 intended to be processed by Charles Babbage\'s mechanical Analytical Engine, making her the first programmer.'
    },
    {
        id: 'tech_3',
        category: 'tech',
        difficulty: 'medium',
        question: 'Which protocol secures web traffic by encrypting communication using SSL/TLS?',
        options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
        correctIndex: 2,
        explanation: 'HTTPS (Hypertext Transfer Protocol Secure) encrypts data sent between your browser and the website server to prevent eavesdropping and tampering.'
    },
    {
        id: 'tech_4',
        category: 'tech',
        difficulty: 'hard',
        question: 'What algorithm complexity class describes problems that can be solved in polynomial time by a deterministic Turing machine?',
        options: ['NP', 'P', 'NP-Complete', 'EXPTIME'],
        correctIndex: 1,
        explanation: 'The class "P" contains decision problems that can be solved efficiently (in polynomial time with respect to input size) by a standard computer algorithm.'
    },

    // --- GEOGRAPHY ---
    {
        id: 'geo_1',
        category: 'geography',
        difficulty: 'easy',
        question: 'What is the largest ocean on Earth by surface area?',
        options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'],
        correctIndex: 2,
        explanation: 'The Pacific Ocean covers over 165 million square kilometers, occupying more area than all of Earth\'s landmasses combined!'
    },
    {
        id: 'geo_2',
        category: 'geography',
        difficulty: 'medium',
        question: 'Which country has the longest coastline in the world?',
        options: ['Australia', 'Canada', 'Russia', 'Indonesia'],
        correctIndex: 1,
        explanation: 'Canada boasts the world\'s longest coastline, stretching over 202,080 kilometers (125,567 miles) across three oceans.'
    },
    {
        id: 'geo_3',
        category: 'geography',
        difficulty: 'medium',
        question: 'What is the capital city of Australia?',
        options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
        correctIndex: 2,
        explanation: 'Canberra was selected as the capital of Australia in 1908 as a compromise between rival major cities Sydney and Melbourne.'
    },

    // --- ARTS & CULTURE ---
    {
        id: 'art_1',
        category: 'arts',
        difficulty: 'easy',
        question: 'Who painted the iconic masterpiece "The Starry Night"?',
        options: ['Pablo Picasso', 'Vincent van Gogh', 'Claude Monet', 'Leonardo da Vinci'],
        correctIndex: 1,
        explanation: 'Vincent van Gogh painted "The Starry Night" in June 1889 while staying at the Saint-Paul-de-Mausole asylum in Saint-Rémy-de-Provence, France.'
    },
    {
        id: 'art_2',
        category: 'arts',
        difficulty: 'medium',
        question: 'Which musical period followed the Renaissance and preceded the Classical period?',
        options: ['Baroque', 'Romantic', 'Medieval', 'Modernist'],
        correctIndex: 0,
        explanation: 'The Baroque era (roughly 1600–1750) produced composers like J.S. Bach and Antonio Vivaldi, known for intricate polyphony and dramatic ornamentation.'
    },

    // --- GENERAL KNOWLEDGE ---
    {
        id: 'gen_1',
        category: 'general',
        difficulty: 'easy',
        question: 'How many standard keys are on a full-sized piano?',
        options: ['66', '76', '88', '100'],
        correctIndex: 2,
        explanation: 'A standard modern piano has 88 keys: 52 white keys (naturals) and 36 black keys (accidental sharps and flats).'
    },
    {
        id: 'gen_2',
        category: 'general',
        difficulty: 'medium',
        question: 'What is the official unit of electrical resistance in the International System of Units (SI)?',
        options: ['Volt', 'Ampere', 'Watt', 'Ohm'],
        correctIndex: 3,
        explanation: 'The Ohm (symbol: Ω) measures electrical resistance, named after German physicist Georg Simon Ohm.'
    }
];

/**
 * Fetch questions online from OpenTriviaDB API when online mode is active
 */
export async function fetchOnlineQuestions(category = 'all', difficulty = 'all', amount = 10) {
    try {
        let url = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;
        
        // Category mapping for OpenTDB
        const categoryMap = {
            science: 17, // Science & Nature
            history: 23, // History
            tech: 18,    // Computers & Tech
            geography: 22, // Geography
            arts: 25,    // Art
            general: 9   // General Knowledge
        };

        if (categoryMap[category]) {
            url += `&category=${categoryMap[category]}`;
        }
        if (difficulty !== 'all') {
            url += `&difficulty=${difficulty}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (data.response_code === 0 && data.results && data.results.length > 0) {
            return data.results.map((item, idx) => {
                const incorrect = item.incorrect_answers.map(decodeHTML);
                const correct = decodeHTML(item.correct_answer);
                
                // Shuffle correct answer into options
                const options = [...incorrect];
                const correctIndex = Math.floor(Math.random() * (options.length + 1));
                options.splice(correctIndex, 0, correct);

                return {
                    id: `online_${Date.now()}_${idx}`,
                    category: category,
                    difficulty: item.difficulty || 'medium',
                    question: decodeHTML(item.question),
                    options: options,
                    correctIndex: correctIndex,
                    explanation: `Correct Answer: "${correct}". Category: ${decodeHTML(item.category)}.`
                };
            });
        }
    } catch (err) {
        console.warn('OpenTriviaDB API fetch error, falling back to local database:', err);
    }
    return null;
}

// Helper to decode HTML entities returned by APIs
function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}
