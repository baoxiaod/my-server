let diaries = [];
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'GET') {
    return res.json({ total: diaries.length, diaries: diaries.slice(0, 10) });
  }
  if (req.method === 'POST') {
    const { date, summary, keyword } = req.body;
    if (!date || !summary) return res.status(400).json({ error: '不能为空～' });
    const diary = { id: diaries.length + 1, date, summary, keyword: keyword || '日常', createdAt: new Date().toISOString() };
    diaries.unshift(diary);
    return res.json({ success: true, diary });
  }
  res.status(405).json({ error: '不支持～' });
}
