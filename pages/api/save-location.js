import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Дозволяємо лише POST запити
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не дозволений' });
  }

  try {
    // Отримуємо дані з тіла запиту (з нашої форми в адмінці)
    const newLocation = req.body;

    // Шлях до файлу locations.json у папці public
    const filePath = path.join(process.cwd(), 'public', 'locations.json');

    // 1. Читаємо поточні дані з файлу
    const fileData = fs.readFileSync(filePath, 'utf8');
    const locations = JSON.parse(fileData);

    // 2. Додаємо нову локацію до масиву
    // Генеруємо ID на основі часу, якщо його немає
    const locationWithId = {
      ...newLocation,
      id: newLocation.id || Date.now(),
      // Переконуємось, що координати — це числа
      lat: parseFloat(newLocation.lat),
      lng: parseFloat(newLocation.lng)
    };

    locations.push(locationWithId);

    // 3. Записуємо оновлений масив назад у файл
    // JSON.stringify(locations, null, 2) робить гарні відступи у файлі
    fs.writeFileSync(filePath, JSON.stringify(locations, null, 2), 'utf8');

    return res.status(200).json({ message: 'Локацію успішно додано!', data: locationWithId });

  } catch (error) {
    console.error('Помилка API:', error);
    return res.status(500).json({ message: 'Помилка при збереженні даних' });
  }
}