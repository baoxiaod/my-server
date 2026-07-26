export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const city = req.query.city || 'Chengdu';
  const apiKey = process.env.WEATHER_API_KEY;
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=zh_cn&appid=${apiKey}`);
    const data = await response.json();
    if (data.cod !== 200) return res.status(400).json({ error: '查不到哦～' });
    res.json({ city: data.name, temp: data.main.temp, feels_like: data.main.feels_like, description: data.weather[0].description, humidity: data.main.humidity, wind: data.wind.speed });
  } catch (err) {
    res.status(500).json({ error: '服务器开小差了～' });
  }
}
