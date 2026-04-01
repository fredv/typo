// 30-Day Touch Typing Curriculum
// Progressive difficulty from home row to full speed typing

const CURRICULUM = [
  // Week 1: Home Row Foundation
  {
    day: 1,
    title: "Home Row — Left Hand",
    desc: "Learn the resting position: A S D F",
    keys: "asdf",
    exercises: [
      "fff fff fff ddd ddd ddd sss sss sss aaa aaa aaa",
      "fds fds fds asd asd asd daf daf daf sad sad sad",
      "add add dad dad fad fad ads ads fas fas aff aff",
      "a sad dad adds a fad; a sad dad adds a fad fast",
    ]
  },
  {
    day: 2,
    title: "Home Row — Right Hand",
    desc: "Learn the right side: J K L ;",
    keys: "jkl;",
    exercises: [
      "jjj jjj jjj kkk kkk kkk lll lll lll ;;; ;;; ;;;",
      "jkl jkl jkl lkj lkj lkj jlk jlk jlk klj klj klj",
      "all all fall fall; lad lad; ask ask flask flask",
      "a lad asks a lass; a lass falls; all lads flask",
    ]
  },
  {
    day: 3,
    title: "Full Home Row",
    desc: "Combine both hands: A S D F J K L ;",
    keys: "asdfjkl;",
    exercises: [
      "asdf jkl; asdf jkl; fjdk slaj fjdk slaj",
      "fall fall; lass lass; lads lads; flask flask; salad salad;",
      "ask a lad; a lad falls; all lads ask; a sad lass falls;",
      "dad had a flask; a sad lass asks dad; all falls as a lad asks;",
    ]
  },
  {
    day: 4,
    title: "Home Row + G H",
    desc: "Extend to G and H — index finger reach",
    keys: "asdfjkl;gh",
    exercises: [
      "fff ggg fff ggg jjj hhh jjj hhh fgf fgf jhj jhj",
      "had had; gash gash; half half; hall hall; glad glad;",
      "a lad had half a glass; she shall dash ahead;",
      "glad gals dash; lads had a flash; flags hang half staff;",
    ]
  },
  {
    day: 5,
    title: "Home Row Speed Drill",
    desc: "Build speed with home row words",
    keys: "asdfjkl;gh",
    exercises: [
      "dash flash glass flags shall halls salad falls",
      "a glad lad has a glass flask; half a salad shall fall;",
      "flags flash as gals dash; lads shall add half a glass;",
      "she had a flash; dad shall dash; glad flags hang; a lad asks halls;",
    ]
  },
  // Week 2: Top Row
  {
    day: 6,
    title: "Top Row — E R T",
    desc: "Left hand reaches up: E R T",
    keys: "asdfjkl;ghert",
    exercises: [
      "fff rrr fff rrr ddd eee ddd eee fff ttt fff ttt",
      "rest rest; test test; tree tree; rate rate; tear tear;",
      "the red dress; set the date; great trees start here;",
      "a great test starts there; she read the letter after the rest;",
    ]
  },
  {
    day: 7,
    title: "Top Row — Y U I O",
    desc: "Right hand reaches up: Y U I O",
    keys: "asdfjkl;ghertyuio",
    exercises: [
      "jjj uuu jjj uuu kkk iii kkk iii lll ooo lll ooo jjj yyy jjj yyy",
      "your your; just just; this this; four four; tour tour;",
      "this is your right thought; first you should try the radio;",
      "you just like the idea; your first rule is to do your daily drills;",
    ]
  },
  {
    day: 8,
    title: "Top Row — Q W P",
    desc: "Pinky reaches: Q W P",
    keys: "asdfjkl;ghertyuioqwp",
    exercises: [
      "aaa qqq aaa qqq sss www sss www ;;; ppp ;;; ppp",
      "quit quit; power power; quiet quiet; write write;",
      "we will put the work together quite well with proper effort;",
      "quiet people write quite powerful letters with paper;",
    ]
  },
  {
    day: 9,
    title: "Full Top + Home Row",
    desc: "All top row keys with home row",
    keys: "qwertyuiopasdfghjkl;",
    exercises: [
      "the quick red dog leaps over the slow tired frog;",
      "we should write for the world to see our thoughts;",
      "right after work she takes a quiet walk through the park;",
      "people always realize their true power will require hard effort;",
    ]
  },
  {
    day: 10,
    title: "Top Row Speed Drill",
    desc: "Build speed with real words",
    keys: "qwertyuiopasdfghjkl;",
    exercises: [
      "together with their people would right after the day;",
      "where should the quiet worker put the other three reports;",
      "if you would like to type faster just keep your eye right here;",
      "quite right we will just do the work together with all our power;",
    ]
  },
  // Week 3: Bottom Row & Punctuation
  {
    day: 11,
    title: "Bottom Row — Z X C V B",
    desc: "Left hand reaches down: Z X C V B",
    keys: "qwertyuiopasdfghjkl;zxcvb",
    exercises: [
      "aaa zzz aaa zzz sss xxx sss xxx ddd ccc ddd ccc fff vvv fff vvv fff bbb fff bbb",
      "back back; exact exact; voice voice; zebra zebra;",
      "could back cover above exact boxes every voice;",
      "brave voices back the exact cover above the black box;",
    ]
  },
  {
    day: 12,
    title: "Bottom Row — N M , . /",
    desc: "Right hand reaches down: N M , . /",
    keys: "qwertyuiopasdfghjkl;zxcvbnm,./",
    exercises: [
      "jjj nnn jjj nnn jjj mmm jjj mmm kkk ,,, kkk ,,, lll ... lll ... ;;; /// ;;; ///",
      "name name; mind mind; come come; long long; more more;",
      "many come, from long times, and find more meaning.",
      "some morning, many men named mark come from the north.",
    ]
  },
  {
    day: 13,
    title: "Full Alphabet Practice",
    desc: "All letter keys combined",
    keys: "qwertyuiopasdfghjkl;zxcvbnm,./",
    exercises: [
      "the quick brown fox jumps over the lazy dog.",
      "pack my box with five dozen liquor jugs.",
      "how vexingly quick daft zebras jump.",
      "the five boxing wizards jump quickly at dawn.",
    ]
  },
  {
    day: 14,
    title: "Common Words Sprint",
    desc: "Practice the most common English words",
    keys: "qwertyuiopasdfghjkl;zxcvbnm,./",
    exercises: [
      "the be to of and a in that have i it for not on with he as you do at",
      "this but his by from they we say her she or an will my one all would there",
      "their what so up out if about who get which go me when make can like time no just",
      "him know take people into year your good some could them see other than then now look only come",
    ]
  },
  // Week 4: Capitals, Numbers & Symbols
  {
    day: 15,
    title: "Capital Letters",
    desc: "Practice using Shift for capitals",
    keys: "all+shift",
    exercises: [
      "Adam Beth Carl Dana Eric Fran Greg Hope Ivan Jane",
      "The Quick Brown Fox Jumps Over The Lazy Dog.",
      "Dear Sir, Thank You For Your Kind Letter. Best, John.",
      "New York, San Francisco, Los Angeles, and Chicago are large cities.",
    ]
  },
  {
    day: 16,
    title: "Numbers — Left Hand",
    desc: "Top row numbers: 1 2 3 4 5",
    keys: "numbers",
    exercises: [
      "111 222 333 444 555 123 234 345 451 321 543 215",
      "12 cats, 34 dogs, 55 birds, 21 fish, 43 horses.",
      "Room 215, Floor 3, Building 4, at 12 Main Street.",
      "She sold 234 items on March 15 for 542 dollars.",
    ]
  },
  {
    day: 17,
    title: "Numbers — Right Hand",
    desc: "Top row numbers: 6 7 8 9 0",
    keys: "numbers",
    exercises: [
      "666 777 888 999 000 678 789 890 907 876 609 780",
      "67 people, 89 seats, 90 windows, 78 doors, 60 walls.",
      "Call 867 0909 or 780 6789 for more information.",
      "Order 890 units by June 7, 2026. Total cost is 6790.",
    ]
  },
  {
    day: 18,
    title: "All Numbers Mixed",
    desc: "Full number row practice",
    keys: "numbers",
    exercises: [
      "1234567890 0987654321 1029384756 5647382910",
      "There are 365 days, 52 weeks, and 12 months in a year.",
      "The code is 48210. The backup pin is 93756.",
      "In 2026, we expect 15780 visitors across 34 events with 269 speakers.",
    ]
  },
  {
    day: 19,
    title: "Basic Punctuation",
    desc: "Period, comma, question mark, exclamation",
    keys: "punctuation",
    exercises: [
      "Hello, how are you? I am fine. Really? Yes! Great, thanks.",
      "Wait, what? She said, no! But why? I asked. Just because.",
      "Dear friend, how have you been? I hope well. Write back soon!",
      "Is it true? Yes, it is. Are you sure? Absolutely! Without a doubt.",
    ]
  },
  {
    day: 20,
    title: "Advanced Punctuation",
    desc: "Colons, semicolons, quotes, parentheses",
    keys: "punctuation+",
    exercises: [
      "He said: \"Hello.\" She replied: \"Hi there!\" They waved.",
      "Items needed: bread, milk, eggs (dozen), and butter.",
      "Note: the meeting is at 3:00; please arrive early.",
      "\"To be or not to be,\" he quoted; \"that is the question.\"",
    ]
  },
  // Week 5: Real-World Practice & Speed Building
  {
    day: 21,
    title: "Email Writing",
    desc: "Practice typing common email patterns",
    keys: "all",
    exercises: [
      "Dear Team, Please find the report attached. Best regards, Alex.",
      "Hi Sarah, Can we meet at 2:30 PM tomorrow? Thanks, Mike.",
      "Subject: Project Update. The deadline has been moved to Friday.",
      "Thank you for your quick response. I will review the document and reply by end of day.",
    ]
  },
  {
    day: 22,
    title: "Programming Basics",
    desc: "Common code patterns and syntax",
    keys: "code",
    exercises: [
      "let x = 10; const name = \"hello\"; var count = 0;",
      "if (x > 5) { return true; } else { return false; }",
      "for (let i = 0; i < 10; i++) { console.log(i); }",
      "function add(a, b) { return a + b; } add(3, 4);",
    ]
  },
  {
    day: 23,
    title: "Mixed Content Speed",
    desc: "Paragraphs with mixed content",
    keys: "all",
    exercises: [
      "The year 2026 marks a turning point. Over 150 companies adopted new practices, resulting in 35% growth.",
      "\"Success,\" she noted, \"requires 3 things: focus, effort, and patience.\" Everyone agreed.",
      "Meeting notes (March 15): Revenue hit $2.4M; expenses at $1.8M. Net profit: $600K!",
      "To: all@company.com. Subject: Q1 Results. Dear team, our Q1 numbers exceeded targets by 22%.",
    ]
  },
  {
    day: 24,
    title: "Speed Building I",
    desc: "High-frequency word combinations",
    keys: "all",
    exercises: [
      "I have been working on this project for the last three weeks and it is going very well.",
      "We need to make sure that all of the documents are ready before the meeting starts.",
      "The most important thing to remember is that practice makes progress, not perfection.",
      "Every day brings a new opportunity to improve. Keep typing and you will see results soon.",
    ]
  },
  {
    day: 25,
    title: "Rap Lyrics",
    desc: "Type along to rap-style lines and build rhythm",
    keys: "all",
    exercises: [
      "Started from the bottom, now we climbing every day. Hard work pays off when you find your own way.",
      "The city lights are shining, the crowd is getting loud. I write my story down and I say it proud.",
      "Dream big, stay humble, let the rhythm take the lead. Plant the seeds of patience, watch them grow from every deed.",
      "No shortcuts to the top, every step is earned. Lessons in the struggle, bridges built not burned.",
      "Microphone check, one two, the beat drops heavy. Pen and paper ready, mind is sharp and steady.",
      "They told me I could never make it, I just proved them wrong. Every verse a chapter, every chapter makes me strong.",
    ]
  },
  {
    day: 26,
    title: "Accuracy Challenge",
    desc: "Focus on zero-error typing",
    keys: "all",
    exercises: [
      "Slow and steady wins the race. Focus on hitting every single key correctly.",
      "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.",
      "Accuracy first, speed second. When you stop making errors, speed follows naturally.",
      "Each finger has a home. Return to home after every reach. Trust the muscle memory you have built.",
    ]
  },
  {
    day: 27,
    title: "Real-World Text I",
    desc: "News and article style writing",
    keys: "all",
    exercises: [
      "Scientists announced a breakthrough in renewable energy that could reduce costs by up to 40% over the next decade.",
      "The city council approved a $2.5 million budget for infrastructure improvements, including 12 new bike lanes.",
      "\"This discovery changes everything,\" said Dr. Chen. \"We have been working toward this for over 15 years.\"",
      "Global temperatures rose 1.2 degrees Celsius last year, prompting calls for immediate action from world leaders.",
    ]
  },
  {
    day: 28,
    title: "Real-World Text II",
    desc: "Technical and business writing",
    keys: "all",
    exercises: [
      "The API endpoint accepts GET and POST requests. Use JSON format with Content-Type: application/json.",
      "Revenue grew 18% year-over-year to $4.7 billion. Operating margin improved to 23.5% from 21.1%.",
      "Install dependencies with: npm install. Run tests with: npm test. Build for production: npm run build.",
      "The server processes approximately 10,000 requests per second with an average latency of 45 milliseconds.",
    ]
  },
  {
    day: 29,
    title: "Speed Test Prep",
    desc: "Full-length timed passages",
    keys: "all",
    exercises: [
      "Touch typing is a skill that pays dividends for the rest of your life. Every email, every message, every document you write benefits from the speed and accuracy you have developed.",
      "The key to mastery is deliberate practice. Do not just type randomly. Focus on your weakest areas, slow down when you make mistakes, and gradually build speed as accuracy improves.",
      "After 29 days of dedicated practice, you should notice a dramatic improvement in both speed and confidence. Your fingers know where to go without conscious thought.",
      "Congratulations on making it this far. Tomorrow is your final assessment. Rest your hands, stay relaxed, and trust the muscle memory you have built over the past month.",
    ]
  },
  {
    day: 30,
    title: "Final Assessment",
    desc: "Test your skills with challenging passages",
    keys: "all",
    exercises: [
      "The ability to type quickly and accurately is one of the most practical skills anyone can learn. In a world where nearly every profession involves a keyboard, touch typing saves hours each week.",
      "\"Practice does not make perfect. Perfect practice makes perfect.\" This quote reminds us that quality matters more than quantity. Focus on correct finger placement and smooth rhythm.",
      "By completing this 30-day program, you have built a foundation that will serve you for years. Your typing speed has likely doubled or tripled, and your error rate has dropped significantly.",
      "Final challenge: The 5 boxing wizards jump quickly! 123 + 456 = 579. Email: test@example.com. Path: /home/user/docs. Price: $29.99 (20% off). Call: (555) 867-5309.",
    ]
  },
];
