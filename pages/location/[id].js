import fs from 'fs';
import path from 'path';

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'public', 'locations.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const locations = JSON.parse(jsonData);
  const location = locations.find((l) => l.id.toString() === params.id);

  return { props: { location } };
}

export async function getStaticPaths() {
  const filePath = path.join(process.cwd(), 'public', 'locations.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const locations = JSON.parse(jsonData);
  const paths = locations.map((l) => ({ params: { id: l.id.toString() } }));

  return { paths, fallback: false };
}

export default function LocationPage({ location }) {
  if (!location) return <div>Завантаження...</div>;
  return (
    <div className="p-8 text-white bg-slate-950 min-h-screen">
      <h1 className="text-3xl font-bold">{location.name}</h1>
      <p className="mt-4 text-slate-400">{location.description}</p>
    </div>
  );
}