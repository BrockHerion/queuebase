import ExecuteFailure from "./execute-failure";
import ExecuteJob from "./execute-job";

export const metadata = {
  title: "Queuebase Next.js Minimal Example",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center space-y-6 p-24">
      <h1>Queuebase Next.js Minimal Example</h1>
      <ExecuteJob />
      <ExecuteFailure />
    </main>
  );
}
