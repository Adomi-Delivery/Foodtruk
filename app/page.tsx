import FormOrder from './components/forms/FormOrder'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between h-screen bg-white">
      <div className="flex flex-col items-center pb-3">
        <FormOrder />
      </div>
    </main>
  );
}