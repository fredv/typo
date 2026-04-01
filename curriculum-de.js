// 30-Tage Tipptrainer — Deutsche QWERTZ-Version
// Progressive Schwierigkeit von der Grundreihe bis zum schnellen Tippen

const CURRICULUM_DE = [
  // Woche 1: Grundreihe
  {
    day: 1,
    title: "Grundreihe — Linke Hand",
    desc: "Lerne die Grundstellung: A S D F",
    keys: "asdf",
    exercises: [
      "fff fff fff ddd ddd ddd sss sss sss aaa aaa aaa",
      "fds fds fds asd asd asd daf daf daf sad sad sad",
      "das das das fad fad fad saf saf saf aff aff aff",
      "das fass das fass das dass das fad das dass das sad",
    ]
  },
  {
    day: 2,
    title: "Grundreihe — Rechte Hand",
    desc: "Lerne die rechte Seite: J K L Ö",
    keys: "jklö",
    exercises: [
      "jjj jjj jjj kkk kkk kkk lll lll lll ööö ööö ööö",
      "jkl jkl jkl lkj lkj lkj jlk jlk jlk klj klj klj",
      "all all fall fall las las öl öl kalk kalkolk olk",
      "lös lös das öl das öl all das fälltalk alk kalk",
    ]
  },
  {
    day: 3,
    title: "Volle Grundreihe",
    desc: "Beide Hände kombiniert: A S D F J K L Ö",
    keys: "asdfjklö",
    exercises: [
      "asdf jklö asdf jklö fjdk slaj fjdk slaj",
      "fall fall das das lass lass öffd öffd salad salad",
      "das fass fällt; das öl als das all lass das; das all",
      "als das all falls als das öl das; als lass das fall",
    ]
  },
  {
    day: 4,
    title: "Grundreihe + G H",
    desc: "Erweiterung auf G und H — Zeigefinger",
    keys: "asdfjklögh",
    exercises: [
      "fff ggg fff ggg jjj hhh jjj hhh fgf fgf jhj jhj",
      "das glas das glas halb halb hall hall glad glad",
      "das glas fällt halb halb; als das glas hallt;",
      "das glas hält das halbe; als das hall hallt;",
    ]
  },
  {
    day: 5,
    title: "Grundreihe Schnelligkeit",
    desc: "Geschwindigkeit mit Grundreihe aufbauen",
    keys: "asdfjklögh",
    exercises: [
      "das glas das hall das fall das half das öl das all",
      "als das glas halb fällt; als das hall hallt das all;",
      "das glas hält das öl; als das fall hallt das halb;",
      "half das glas als hall; das all fällt als das öl half;",
    ]
  },
  // Woche 2: Obere Reihe
  {
    day: 6,
    title: "Obere Reihe — E R T",
    desc: "Linke Hand greift nach oben: E R T",
    keys: "asdfjklöghert",
    exercises: [
      "fff rrr fff rrr ddd eee ddd eee fff ttt fff ttt",
      "der der; das das; fett fett; rest rest; rate rate;",
      "der rote test; das feste feld; der dreh der elf;",
      "der erste rest steht dort; er redet lese lest rege;",
    ]
  },
  {
    day: 7,
    title: "Obere Reihe — Z U I O",
    desc: "Rechte Hand greift nach oben: Z U I O (Z statt Y!)",
    keys: "asdfjklöghertzuio",
    exercises: [
      "jjj uuu jjj uuu kkk iii kkk iii lll ooo lll ooo jjj zzz jjj zzz",
      "und und; dies dies; sollt sollt; tour tour; kurz kurz;",
      "dies ist dein recht; zuerst solltest du drills tun;",
      "du solltest die idee gut finden; zuerst die rolle diskutiert;",
    ]
  },
  {
    day: 8,
    title: "Obere Reihe — Q W P Ü",
    desc: "Kleine Finger: Q W P Ü",
    keys: "asdfjklöghertzuioqwpü",
    exercises: [
      "aaa qqq aaa qqq sss www sss www ööö ppp ööö ppp ;;; üüü ;;; üüü",
      "wort wort; tipp tipp; quer quer; würde würde;",
      "wir werden die tipps gut zusammen üben mit guter kraft;",
      "würde der tipp quer etwas üppig tun der tippt gut;",
    ]
  },
  {
    day: 9,
    title: "Volle obere Reihe + Grundreihe",
    desc: "Alle oberen Tasten mit Grundreihe",
    keys: "qwertzuiopüasdfghjklö",
    exercises: [
      "der kluge rote hof liegt dort drühe über der klippe;",
      "wir sollte die worte für die welt aufsetze;",
      "gleich wollte er still gehe quer durch dieses feld;",
      "die leute stets ihre stärke erst spürt der rest;",
    ]
  },
  {
    day: 10,
    title: "Obere Reihe Schnelligkeit",
    desc: "Geschwindigkeit mit Wörtern aufbauen",
    keys: "qwertzuiopüasdfghjklö",
    exercises: [
      "die leute dort würde gleich dort stehe;",
      "wo sollte der stille dort die drittes plätze herstelle;",
      "weiter sollt du übe der stets direkt dort tippe;",
      "er würde die tipps gut gesetzt für die gute rede;",
    ]
  },
  // Woche 3: Untere Reihe und Satzzeichen
  {
    day: 11,
    title: "Untere Reihe — Y X C V B",
    desc: "Linke Hand greift nach unten: Y X C V B (Y statt Z!)",
    keys: "qwertzuiopüasdfghjklöyxcvb",
    exercises: [
      "aaa yyy aaa yyy sss xxx sss xxx ddd ccc ddd ccc fff vvv fff vvv fff bbb fff bbb",
      "brav brav; exakt exakt; vox vox; yacht yacht;",
      "vorbei vorbei; boxe boxe; exakt exakt; clever clever;",
      "brave boxer boxe exakt vorbei der clevere yacht;",
    ]
  },
  {
    day: 12,
    title: "Untere Reihe — N M , . -",
    desc: "Rechte Hand greift nach unten: N M , . -",
    keys: "qwertzuiopüasdfghjklöyxcvbnm,.-",
    exercises: [
      "jjj nnn jjj nnn jjj mmm jjj mmm kkk ,,, kkk ,,, lll ... lll ... ööö --- ööö ---",
      "name name; mund mund; kommen kommen; mehr mehr;",
      "viele kommen, von langer zeit, und finden mehr sinn.",
      "manchen morgen kommen viele von dem norden her.",
    ]
  },
  {
    day: 13,
    title: "Volles Alphabet",
    desc: "Alle Buchstaben kombiniert",
    keys: "qwertzuiopüasdfghjklöyxcvbnm,.-ä",
    exercises: [
      "franz jagt im komplett verwahrlosten taxi quer durch bayern.",
      "bei jedem kauf brachte der zyniker vor würde quälen.",
      "zwei boxkämpfer jagen eva quer durch sylt.",
      "falsches üben von xylophonmusik quält jeden größeren zwerg.",
    ]
  },
  {
    day: 14,
    title: "Häufige Wörter Sprint",
    desc: "Die häufigsten deutschen Wörter üben",
    keys: "all",
    exercises: [
      "der die das und in den von zu ist ein nicht mit es auf für an er als auch",
      "sie so aus bei nach dem wie hat noch werden wir ich wird durch über kann",
      "aber nur um sein schon haben nur diese dann unter sehr selbst wenn alle",
      "wird hatte gegen vom seine ihre meine einem seinen seiner einer diesem wieder",
    ]
  },
  // Woche 4: Großbuchstaben, Zahlen und Symbole
  {
    day: 15,
    title: "Großbuchstaben",
    desc: "Shift-Taste für Großbuchstaben üben",
    keys: "all+shift",
    exercises: [
      "Anna Bernd Clara Daniel Emma Franz Georg Hanna Igor Jana",
      "Der Schnelle Braune Fuchs Springt Über Den Faulen Hund.",
      "Sehr Geehrter Herr Müller, Vielen Dank Für Ihren Brief.",
      "Berlin, München, Hamburg, Frankfurt und Köln sind große Städte.",
    ]
  },
  {
    day: 16,
    title: "Zahlen — Linke Hand",
    desc: "Obere Zahlenreihe: 1 2 3 4 5",
    keys: "numbers",
    exercises: [
      "111 222 333 444 555 123 234 345 451 321 543 215",
      "12 Katzen, 34 Hunde, 55 Vögel, 21 Fische, 43 Pferde.",
      "Raum 215, Etage 3, Gebäude 4, in der Hauptstraße 12.",
      "Sie verkaufte 234 Artikel am 15. März für 542 Euro.",
    ]
  },
  {
    day: 17,
    title: "Zahlen — Rechte Hand",
    desc: "Obere Zahlenreihe: 6 7 8 9 0",
    keys: "numbers",
    exercises: [
      "666 777 888 999 000 678 789 890 907 876 609 780",
      "67 Personen, 89 Sitze, 90 Fenster, 78 Türen, 60 Wände.",
      "Ruf 867 0909 oder 780 6789 für mehr Informationen an.",
      "Bestelle 890 Stück bis 7. Juni 2026. Gesamtkosten: 6790.",
    ]
  },
  {
    day: 18,
    title: "Alle Zahlen Gemischt",
    desc: "Volle Zahlenreihe üben",
    keys: "numbers",
    exercises: [
      "1234567890 0987654321 1029384756 5647382910",
      "Es gibt 365 Tage, 52 Wochen und 12 Monate im Jahr.",
      "Der Code ist 48210. Die Ersatz-PIN ist 93756.",
      "Im Jahr 2026 erwarten wir 15780 Besucher bei 34 Veranstaltungen mit 269 Rednern.",
    ]
  },
  {
    day: 19,
    title: "Grundlegende Satzzeichen",
    desc: "Punkt, Komma, Fragezeichen, Ausrufezeichen",
    keys: "punctuation",
    exercises: [
      "Hallo, wie geht es dir? Mir geht es gut. Wirklich? Ja! Danke.",
      "Warte, was? Sie sagte, nein! Aber warum? Einfach so.",
      "Lieber Freund, wie geht es dir? Ich hoffe gut. Schreib bald!",
      "Stimmt das? Ja, das stimmt. Bist du sicher? Absolut! Ohne Zweifel.",
    ]
  },
  {
    day: 20,
    title: "Erweiterte Satzzeichen",
    desc: "Doppelpunkt, Semikolon, Anführungszeichen, Klammern",
    keys: "punctuation+",
    exercises: [
      "Er sagte: \"Hallo.\" Sie antwortete: \"Hi!\" Sie winkten.",
      "Einkaufsliste: Brot, Milch, Eier (ein Dutzend) und Butter.",
      "Hinweis: Das Treffen ist um 15:00 Uhr; bitte komm pünktlich.",
      "\"Sein oder Nichtsein,\" zitierte er; \"das ist die Frage.\"",
    ]
  },
  // Woche 5: Praxistexte und Geschwindigkeit
  {
    day: 21,
    title: "E-Mails Schreiben",
    desc: "Übliche E-Mail-Muster üben",
    keys: "all",
    exercises: [
      "Liebes Team, anbei finden Sie den Bericht. Mit freundlichen Grüßen, Alex.",
      "Hallo Sarah, können wir uns morgen um 14:30 Uhr treffen? Danke, Mike.",
      "Betreff: Projekt-Update. Die Frist wurde auf Freitag verschoben.",
      "Vielen Dank für Ihre schnelle Antwort. Ich werde das Dokument prüfen und bis Feierabend antworten.",
    ]
  },
  {
    day: 22,
    title: "Programmierung Grundlagen",
    desc: "Übliche Code-Muster und Syntax",
    keys: "code",
    exercises: [
      "let x = 10; const name = \"hallo\"; var anzahl = 0;",
      "if (x > 5) { return true; } else { return false; }",
      "for (let i = 0; i < 10; i++) { console.log(i); }",
      "function addiere(a, b) { return a + b; } addiere(3, 4);",
    ]
  },
  {
    day: 23,
    title: "Gemischte Inhalte",
    desc: "Absätze mit gemischtem Inhalt",
    keys: "all",
    exercises: [
      "Das Jahr 2026 markiert einen Wendepunkt. Über 150 Firmen haben neue Verfahren eingeführt, mit 35% Wachstum.",
      "\"Erfolg\", bemerkte sie, \"erfordert 3 Dinge: Fokus, Einsatz und Geduld.\" Alle stimmten zu.",
      "Protokoll (15. März): Umsatz bei 2,4 Mio.; Ausgaben bei 1,8 Mio. Gewinn: 600.000!",
      "An: alle@firma.de. Betreff: Q1-Ergebnisse. Liebes Team, unsere Q1-Zahlen übertrafen die Ziele um 22%.",
    ]
  },
  {
    day: 24,
    title: "Geschwindigkeit I",
    desc: "Häufige Wortkombinationen",
    keys: "all",
    exercises: [
      "Ich habe in den letzten drei Wochen an diesem Projekt gearbeitet und es läuft sehr gut.",
      "Wir müssen sicherstellen, dass alle Dokumente vor dem Treffen fertig sind.",
      "Das Wichtigste ist, dass Übung Fortschritt bringt, nicht Perfektion.",
      "Jeder Tag bringt eine neue Chance sich zu verbessern. Tippe weiter und du wirst bald Ergebnisse sehen.",
    ]
  },
  {
    day: 25,
    title: "Rap-Texte",
    desc: "Tippe im Rhythmus zu Rap-Zeilen",
    keys: "all",
    exercises: [
      "Die Stadt schläft nie, die Lichter brennen hell. Ich schreibe meine Zeilen, jede Nacht aufs Neue schnell.",
      "Kein Weg zurück, nur vorwärts Schritt für Schritt. Jeder Vers ein Herzschlag, jeder Takt ein neuer Hit.",
      "Vom Hinterhof zur großen Bühne, Träume werden wahr. Was gestern noch unmöglich schien, ist heute wunderbar.",
      "Die Straßen erzählen Geschichten, die keiner sonst versteht. Der Beat trägt meine Worte, bis die Sonne untergeht.",
      "Kopf hoch, Blick nach vorn, lass die Zweifler reden. Jede Zeile ist ein Schritt auf meinen eigenen Wegen.",
      "Mikrofon in der Hand, der Rhythmus gibt den Takt. Jedes Wort hat Gewicht, jede Silbe hat Impact.",
    ]
  },
  {
    day: 26,
    title: "Genauigkeits-Herausforderung",
    desc: "Fokus auf fehlerfreies Tippen",
    keys: "all",
    exercises: [
      "Langsam und stetig gewinnt das Rennen. Konzentriere dich darauf jede Taste richtig zu treffen.",
      "Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwei Boxkämpfer jagen Eva durch Sylt.",
      "Erst Genauigkeit, dann Geschwindigkeit. Wenn du keine Fehler mehr machst, kommt die Schnelligkeit von selbst.",
      "Jeder Finger hat eine Heimat. Kehre nach jedem Griff zurück. Vertraue dem Muskelgedächtnis das du aufgebaut hast.",
    ]
  },
  {
    day: 27,
    title: "Alltagstexte I",
    desc: "Nachrichten und Artikelstil",
    keys: "all",
    exercises: [
      "Wissenschaftler verkündeten einen Durchbruch bei erneuerbaren Energien, der die Kosten um 40% senken könnte.",
      "Der Stadtrat genehmigte ein Budget von 2,5 Millionen Euro für Verbesserungen der Infrastruktur.",
      "\"Diese Entdeckung ändert alles\", sagte Dr. Chen. \"Wir arbeiten seit über 15 Jahren daran.\"",
      "Die globalen Temperaturen stiegen letztes Jahr um 1,2 Grad Celsius, was Forderungen nach sofortigem Handeln auslöste.",
    ]
  },
  {
    day: 28,
    title: "Alltagstexte II",
    desc: "Technische und geschäftliche Texte",
    keys: "all",
    exercises: [
      "Der API-Endpunkt akzeptiert GET- und POST-Anfragen. Verwende JSON mit Content-Type: application/json.",
      "Der Umsatz wuchs um 18% auf 4,7 Milliarden Euro. Die Marge verbesserte sich von 21,1% auf 23,5%.",
      "Abhängigkeiten installieren: npm install. Tests starten: npm test. Für Produktion: npm run build.",
      "Der Server verarbeitet etwa 10.000 Anfragen pro Sekunde mit einer Latenz von 45 Millisekunden.",
    ]
  },
  {
    day: 29,
    title: "Vorbereitung Geschwindigkeitstest",
    desc: "Längere zeitgesteuerte Passagen",
    keys: "all",
    exercises: [
      "Zehnfingerschreiben ist eine Fähigkeit, die sich ein Leben lang auszahlt. Jede E-Mail, jede Nachricht profitiert von der Geschwindigkeit und Genauigkeit, die du entwickelt hast.",
      "Der Schlüssel zur Meisterschaft ist bewusstes Üben. Tippe nicht einfach drauflos. Konzentriere dich auf deine Schwächen und baue langsam Geschwindigkeit auf.",
      "Nach 29 Tagen intensiven Übens solltest du eine deutliche Verbesserung bei Geschwindigkeit und Sicherheit bemerken. Deine Finger wissen wohin ohne bewusst nachzudenken.",
      "Herzlichen Glückwunsch, dass du so weit gekommen bist. Morgen ist deine Abschlussprüfung. Entspanne die Hände und vertraue dem Muskelgedächtnis.",
    ]
  },
  {
    day: 30,
    title: "Abschlussprüfung",
    desc: "Teste deine Fähigkeiten mit anspruchsvollen Texten",
    keys: "all",
    exercises: [
      "Die Fähigkeit schnell und genau zu tippen ist eine der praktischsten Kompetenzen. In einer Welt in der fast jeder Beruf eine Tastatur braucht, spart Zehnfingerschreiben Stunden pro Woche.",
      "\"Übung macht nicht perfekt. Perfektes Üben macht perfekt.\" Dieses Zitat erinnert uns, dass Qualität wichtiger ist als Quantität. Achte auf korrekte Fingerstellung.",
      "Mit dem Abschluss dieses 30-Tage-Programms hast du ein Fundament gebaut, das dir jahrelang dienen wird. Deine Tippgeschwindigkeit hat sich wahrscheinlich verdoppelt oder verdreifacht.",
      "Letzte Herausforderung: Öl, Ärger, Übung und Größe! 123 + 456 = 579. E-Mail: test@beispiel.de. Preis: 29,99 (20% Rabatt). Tel: (0555) 867-5309.",
    ]
  },
];
