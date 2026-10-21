// Built-in feel-good quotes, used when today's quote can't be fetched
// (offline, first launch, or an edition that can't reach the published file).
export const QUOTES = [
  ['Act as if what you do makes a difference. It does.', 'William James'],
  ['What you do today can improve all your tomorrows.', 'Ralph Marston'],
  ['Start where you are. Use what you have. Do what you can.', 'Arthur Ashe'],
  ['Well done is better than well said.', 'Benjamin Franklin'],
  ['No act of kindness, no matter how small, is ever wasted.', 'Aesop'],
  ['The journey of a thousand miles begins with one step.', 'Lao Tzu'],
  ['We are what we repeatedly do. Excellence, then, is not an act, but a habit.', 'Will Durant'],
  ['Courage doesn’t always roar. Sometimes courage is the quiet voice at the end of the day saying, “I will try again tomorrow.”', 'Mary Anne Radmacher'],
  ['If you can’t fly then run, if you can’t run then walk, if you can’t walk then crawl, but whatever you do you have to keep moving forward.', 'Martin Luther King Jr.'],
  ['Inaction breeds doubt and fear. Action breeds confidence and courage.', 'Dale Carnegie'],
  ['Our greatest glory is not in never falling, but in rising every time we fall.', 'Oliver Goldsmith'],
  ['Small deeds done are better than great deeds planned.', 'Peter Marshall'],
  ['Be kind whenever possible. It is always possible.', 'Dalai Lama'],
  ['Gratitude turns what we have into enough.', 'Unknown'],
  ['One day at a time.', 'Proverb'],
  ['A calm mind brings inner strength and self-confidence.', 'Dalai Lama'],
  ['Focus on being productive instead of busy.', 'Tim Ferriss'],
  ['Family is not an important thing. It’s everything.', 'Michael J. Fox'],
  ['Energy and persistence conquer all things.', 'Benjamin Franklin'],
  ['The best time to plant a tree was 20 years ago. The second best time is now.', 'Proverb'],
  ['Make each day your masterpiece.', 'John Wooden'],
  ['Do the best you can until you know better. Then when you know better, do better.', 'Maya Angelou'],
  ['Whoever is happy will make others happy too.', 'Anne Frank'],
  ['Life is 10% what happens to you and 90% how you react to it.', 'Charles R. Swindoll'],
  ['Perseverance is not a long race; it is many short races one after the other.', 'Walter Elliot'],
  ['You miss 100% of the shots you don’t take.', 'Wayne Gretzky'],
  ['Little by little, one travels far.', 'Proverb'],
  ['Rest is not idleness.', 'John Lubbock'],
  ['Do what you can, with what you have, where you are.', 'Theodore Roosevelt'],
  ['Happiness is not something ready made. It comes from your own actions.', 'Dalai Lama'],
];

/** Same quote all day, a different one each day (by days since 1970). */
export function builtInQuote(dateStr) {
  const day = Math.floor(Date.parse(dateStr + 'T00:00:00Z') / 86400000);
  const [q, a] = QUOTES[((day % QUOTES.length) + QUOTES.length) % QUOTES.length];
  return { q, a, source: 'built-in' };
}
