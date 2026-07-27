// api/memory.js — 林迪的记忆写入接口

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = 'baoxiaod';
const REPO = 'my-server';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST' });
  }

  const { file, content, mode } = req.body;
  // file: 文件路径，如 'memories/2026-07.md'
  // content: 要写入的内容
  // mode: 'append' 追加 | 'overwrite' 覆盖

  if (!file || !content) {
    return res.status(400).json({ error: '缺少 file 或 content' });
  }

  try {
    let finalContent = content;
    let sha = null;

    // 如果是追加模式，先读取原文件内容
    if (mode === 'append') {
      try {
        const getRes = await fetch(
          `https://api.github.com/repos/${OWNER}/${REPO}/contents/${file}`,
          { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
        );
        if (getRes.ok) {
          const data = await getRes.json();
          sha = data.sha;
          const oldContent = Buffer.from(data.content, 'base64').toString('utf-8');
          finalContent = oldContent + '\n\n' + content;
        }
      } catch (e) {
        // 文件不存在，直接创建
      }
    }

    // 写入文件
    const body = {
      message: `📝 更新 ${file}`,
      content: Buffer.from(finalContent).toString('base64'),
    };
    if (sha) body.sha = sha;

    const putRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${file}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (putRes.ok) {
      return res.json({ success: true, file, mode });
    } else {
      const err = await putRes.json();
      return res.status(500).json({ error: '写入失败', detail: err });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
