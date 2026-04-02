import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не дозволений' });
  }

  try {
    const newLocation = req.body;
    
    // Визначаємо шлях до папки public та файлу
    const publicDirectory = path.join(process.cwd(), 'public');
    const filePath = path.join(publicDirectory, 'locations.json');

    // ПЕРЕВІРКА: чи існує папка public (про всяк випадок)
    if (!fs.existsSync(publicDirectory)) {
      fs.mkdirSync(publicDirectory, { recursive: true });
    }

    // 1. Читаємо поточні дані
    let locations = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      try {
        locations = fileContent ? JSON.parse(fileContent) : [];
      } catch (e) {
        locations = []; // Якщо файл був битий
      }
    }

    // 2. Додаємо нову точку
    const locationToSave = {
      ...newLocation,
      id: Date.now(),
      lat: parseFloat(newLocation.lat),
      lng: parseFloat(newLocation.lng)
    };

    locations.push(locationToSave);

    // 3. Записуємо файл
    fs.writeFileSync(filePath, JSON.stringify(locations, null, 2), 'utf8');

    return res.status(200).json({ message: 'Success', data: locationToSave });

  } catch (error) {
    console.error('SERVER ERROR:', error);
    // Повертаємо помилку у форматі JSON, щоб побачити її в Network
    return res.status(500).json({ 
      message: 'Помилка сервера при записі', 
      error: error.toString(),
      stack: error.stack 
    });
  }
}