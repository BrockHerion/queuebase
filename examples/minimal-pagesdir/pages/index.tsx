import { jobs } from "@/utils/queuebase";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center space-y-6 p-24">
      <h1>Queuebase Next.js Pages Minimal Example</h1>
      <button
        onClick={async () => {
          await jobs("helloFromPages").enqueue();
        }}
        className="px h-10 rounded-md border bg-emerald-600 px-4 py-2 text-white"
      >
        Execute job
      </button>
    </main>
  );
}
